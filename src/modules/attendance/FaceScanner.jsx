// FaceScanner.jsx
import { useEffect, useRef, useState, useCallback } from "react";

const FACE_API_JS  = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const MODEL_URL    = "https://cdn.jsdelivr.net/gh/vladmandic/face-api@master/model/";
const OVAL_TOTAL   = 292;
const CHALLENGES   = ["BLINK", "LOOK_LEFT", "LOOK_RIGHT"];

// ── Tunables ──────────────────────────────────────────────────────────────
const MIN_DETECTION_SCORE = 0.5;    
const TINY_INPUT_SIZE     = 224;    
const FACE_MIN_RATIO      = 0.20;   
const FACE_MAX_RATIO      = 0.90;   
const CENTER_TOLERANCE    = 0.28;   
const GEO_GRACE_FRAMES    = 4;      
const CALIB_FRAMES        = 6;      
const BLINK_DROP_RATIO    = 0.85;   
const OPEN_RECOVER_RATIO  = 0.92;   
const NEEDED_OPEN_FRAMES  = 1;
const NEEDED_CLOSED_FRAMES= 1;
const LOOP_INTERVAL_MS    = 90;     
const BEZEL_CHECK_EVERY   = 9;      
const BEZEL_LINE_THRESH   = 7.5;    

const FLICKER_SAMPLES     = 14;     
const FLICKER_SAMPLE_GAP  = 10;     
const FLICKER_SCORE_MAX   = 0.55;   
const TEXTURE_MIN         = 4;      
const TEXTURE_MAX         = 900;    

// ── Liveness Math ────────────────────────────────────────────────────────────
function ear(eye) {
  return (Math.abs(eye[1].y - eye[5].y) + Math.abs(eye[2].y - eye[4].y))
       / (2 * Math.abs(eye[0].x - eye[3].x));
}
function avgEar(lm) {
  return (ear(lm.getLeftEye()) + ear(lm.getRightEye())) / 2;
}
function isLookLeft(lm)  {
  const n = lm.getNose()[0].x, j = lm.getJawOutline();
  return Math.abs(j[16].x - n) / Math.abs(n - j[0].x) > 1.9;
}
function isLookRight(lm) {
  const n = lm.getNose()[0].x, j = lm.getJawOutline();
  return Math.abs(n - j[0].x) / Math.abs(j[16].x - n) > 1.9;
}

// Check if face is looking straight/centered (Strict check for final photo)
function isLookingStraight(lm, box, vidWidth) {
  const n = lm.getNose()[0].x;
  const j = lm.getJawOutline();
  const leftRatio = Math.abs(n - j[0].x);
  const rightRatio = Math.abs(j[16].x - n);
  const symmetry = Math.max(leftRatio, rightRatio) / Math.min(leftRatio, rightRatio);
  
  return symmetry < 1.35; 
}

function checkFaceGeometry(box, vidWidth, vidHeight) {
  const faceRatioW = box.width / vidWidth;
  const cx = (box.x + box.width / 2) / vidWidth;
  const cy = (box.y + box.height / 2) / vidHeight;

  if (faceRatioW < FACE_MIN_RATIO) return { ok: false, reason: "TOO_FAR" };
  if (faceRatioW > FACE_MAX_RATIO) return { ok: false, reason: "TOO_CLOSE" };
  if (Math.abs(cx - 0.5) > CENTER_TOLERANCE || Math.abs(cy - 0.5) > CENTER_TOLERANCE) {
    return { ok: false, reason: "NOT_CENTERED" };
  }
  return { ok: true };
}

let bezelCanvas = null;
function detectBezelFrame(videoEl) {
  const W = 96, H = 72;
  if (!bezelCanvas) bezelCanvas = document.createElement("canvas");
  bezelCanvas.width = W; bezelCanvas.height = H;
  const ctx = bezelCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(videoEl, 0, 0, W, H);

  let gray;
  try { gray = ctx.getImageData(0, 0, W, H).data; } catch { return false; }

  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4;
    lum[i] = 0.299 * gray[o] + 0.587 * gray[o + 1] + 0.114 * gray[o + 2];
  }
  const px = (x, y) => lum[y * W + x];

  const rowEnergy = new Float32Array(H);
  const colEnergy = new Float32Array(W);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const idx = y * W + x;
      colEnergy[x] += Math.abs(lum[idx + 1] - lum[idx - 1]);
      rowEnergy[y] += Math.abs(lum[idx + W] - lum[idx - W]);
    }
  }
  const margin = 2; 
  const lineScore = (arr, total) => {
    const inner = arr.slice(margin, total - margin);
    const sorted = [...inner].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 1;
    return Math.max(...inner) / Math.max(median, 1);
  };
  const hasLine = lineScore(rowEnergy, H) > BEZEL_LINE_THRESH || lineScore(colEnergy, W) > BEZEL_LINE_THRESH;

  const stripStats = (samples) => {
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
    return { mean, variance };
  };
  const centerSamples = [];
  for (let y = Math.floor(H * 0.35); y < H * 0.65; y++) {
    for (let x = Math.floor(W * 0.35); x < W * 0.65; x++) centerSamples.push(px(x, y));
  }
  const leftSamples = [], rightSamples = [], topSamples = [];
  const stripW = Math.max(2, Math.floor(W * 0.06));
  const stripH = Math.max(2, Math.floor(H * 0.08));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < stripW; x++) { leftSamples.push(px(x, y)); rightSamples.push(px(W - 1 - x, y)); }
  }
  for (let y = 0; y < stripH; y++) {
    for (let x = 0; x < W; x++) topSamples.push(px(x, y));
  }
  const centerStat = stripStats(centerSamples);
  const edgeIsBezel = (samples) => {
    const st = stripStats(samples);
    return st.variance < 60 && Math.abs(st.mean - centerStat.mean) > 18;
  };
  const hasDarkBorder = edgeIsBezel(leftSamples) || edgeIsBezel(rightSamples) || edgeIsBezel(topSamples);

  let transitions = 0;
  const rowY = Math.floor(H * 0.07);
  for (let x = 1; x < W - 1; x++) {
    if (Math.abs(px(x, rowY) - px(x - 1, rowY)) > 35) transitions++;
  }
  const hasIconClutter = transitions > W * 0.18;

  return hasLine || hasDarkBorder || hasIconClutter;
}

function faceCropGray(ctx, video, box, size) {
  const px = box.x + box.width * 0.25;
  const py = box.y + box.height * 0.2;
  const pw = box.width * 0.5;
  const ph = box.height * 0.4;
  ctx.drawImage(video, px, py, pw, ph, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const gray = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) {
    const o = i * 4;
    gray[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
  }
  return gray;
}

function laplacianVariance(gray, size) {
  const lap = [];
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = y * size + x;
      lap.push(4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - size] - gray[i + size]);
    }
  }
  const mean = lap.reduce((a, b) => a + b, 0) / lap.length;
  return lap.reduce((a, b) => a + (b - mean) ** 2, 0) / lap.length;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

let burstCanvas = null;
async function runSpoofBurstCheck(video, box) {
  const SZ = 48;
  if (!burstCanvas) burstCanvas = document.createElement("canvas");
  burstCanvas.width = SZ; burstCanvas.height = SZ;
  const ctx = burstCanvas.getContext("2d", { willReadFrequently: true });

  const samples = [];
  for (let i = 0; i < FLICKER_SAMPLES; i++) {
    try {
      const px = box.x + box.width * 0.3, py = box.y + box.height * 0.25;
      const pw = box.width * 0.4, ph = box.height * 0.3;
      ctx.drawImage(video, px, py, pw, ph, 0, 0, 12, 12);
      const d = ctx.getImageData(0, 0, 12, 12).data;
      let sum = 0;
      for (let j = 0; j < d.length; j += 4) sum += 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
      samples.push(sum / (d.length / 4));
    } catch {}
    await sleep(FLICKER_SAMPLE_GAP);
  }

  let flickerScore = 0;
  if (samples.length > 4) {
    const meanLum = samples.reduce((a, b) => a + b, 0) / samples.length || 1;
    let jitter = 0;
    for (let i = 1; i < samples.length; i++) jitter += Math.abs(samples[i] - samples[i - 1]);
    jitter /= (samples.length - 1);
    flickerScore = jitter / Math.max(meanLum, 1) * 10;
  }

  let textureVariance = 100;
  try {
    const gray = faceCropGray(ctx, video, box, SZ);
    textureVariance = laplacianVariance(gray, SZ);
  } catch {}

  const suspicious = flickerScore > FLICKER_SCORE_MAX || textureVariance < TEXTURE_MIN || textureVariance > TEXTURE_MAX;
  return { suspicious, flickerScore, textureVariance };
}

export default function FaceScanner({ onCapture, onClose }) {
  const videoRef   = useRef(null);
  const timerRef   = useRef(null);
  const streamRef  = useRef(null);
  const stRef      = useRef({
    step: 0, pct: 0, ch: "BLINK",
    openFrames: 0, closedFrames: 0, blinked: false,
    earSamples: [], baselineEar: null,
    badGeoFrames: 0, badGeoReason: null,
    tick: 0, bezelFlag: false, busy: false,
  });

  const [pct,     setPct]     = useState(0);
  const [msg,     setMsg]     = useState("Loading face engine…");
  const [isOk,    setIsOk]    = useState(true);
  const [loading, setLoading] = useState(true);

  const stopAll = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const handleClose = useCallback(() => { stopAll(); onClose(); }, [stopAll, onClose]);

  const capture = useCallback(() => {
    const vid = videoRef.current;
    const c   = document.createElement("canvas");
    c.width = vid.videoWidth; c.height = vid.videoHeight;
    c.getContext("2d").drawImage(vid, 0, 0);
    c.toBlob(blob => { stopAll(); onCapture(blob); }, "image/jpeg", 0.92);
  }, [stopAll, onCapture]);

  const startLoop = useCallback(() => {
    const s = stRef.current;
    s.step = 0; s.pct = 0; s.blinked = false;
    s.openFrames = 0; s.closedFrames = 0;
    s.earSamples = []; s.baselineEar = null;
    s.badGeoFrames = 0; s.badGeoReason = null;
    s.tick = 0; s.bezelFlag = false; s.burstRunning = false; s.busy = false;
    s.ch   = CHALLENGES[Math.floor(Math.random() * 3)];
    
    const label = { BLINK: "Blink your eyes", LOOK_LEFT: "Turn face LEFT ←", LOOK_RIGHT: "Turn face RIGHT →" };
    setMsg(`Face detected — ${label[s.ch]}`);
    setIsOk(true);

    timerRef.current = setInterval(async () => {
      const s = stRef.current;
      if (s.step === 4 || s.burstRunning || s.busy) return;
      const vid = videoRef.current;
      if (!vid || vid.videoWidth === 0) return;

      s.busy = true;
      try {
        s.tick++;

        if (s.tick % BEZEL_CHECK_EVERY === 0) {
          s.bezelFlag = detectBezelFrame(vid);
        }
        if (s.bezelFlag) {
          s.pct = Math.max(0, s.pct - 4);
          s.step = 0; s.blinked = false; s.openFrames = 0; s.closedFrames = 0;
          s.earSamples = []; s.baselineEar = null;
          setPct(s.pct); setIsOk(false);
          setMsg("Phone/screen ya photo frame detected — sirf chehra dikhaye");
          return;
        }

        const det = await window.faceapi
          .detectSingleFace(vid, new window.faceapi.TinyFaceDetectorOptions({
            inputSize: TINY_INPUT_SIZE,
            scoreThreshold: MIN_DETECTION_SCORE,
          }))
          .withFaceLandmarks();

        if (!det) {
          s.pct  = Math.max(0, s.pct - 5);
          s.step = 0; s.blinked = false; s.openFrames = 0; s.closedFrames = 0;
          s.earSamples = []; s.baselineEar = null;
          setPct(s.pct); setIsOk(false); setMsg("Face not found — look at camera"); return;
        }

        const geo = checkFaceGeometry(det.detection.box, vid.videoWidth, vid.videoHeight);
        if (!geo.ok) {
          s.badGeoFrames++;
          s.badGeoReason = geo.reason;
          if (s.badGeoFrames >= GEO_GRACE_FRAMES) {
            s.pct = Math.max(0, s.pct - 3);
            s.step = 0; s.blinked = false; s.openFrames = 0; s.closedFrames = 0;
            s.earSamples = []; s.baselineEar = null;
            setPct(s.pct); setIsOk(false);
            const reasonMsg = {
              TOO_FAR: "Bring your face closer",
              TOO_CLOSE: "Move back a little",
              NOT_CENTERED: "Center your face in the oval",
            };
            setMsg(reasonMsg[geo.reason]);
          }
          return; 
        }
        s.badGeoFrames = 0;
        setIsOk(true);
        
        const lm = det.landmarks;
        const label = { BLINK: "Blink your eyes", LOOK_LEFT: "Turn face LEFT ←", LOOK_RIGHT: "Turn face RIGHT →" };

        if (s.step === 0) {
          s.pct = Math.min(s.pct + 2, 35);
          setPct(Math.round(s.pct));

          if (s.pct >= 20) {
            s.earSamples.push(avgEar(lm));
            if (s.earSamples.length > CALIB_FRAMES) s.earSamples.shift();
          }
          setMsg(`Locking face… ${Math.round(s.pct)}%`);

          if (s.pct >= 35) {
            if (s.earSamples.length > 0) {
              s.baselineEar = s.earSamples.reduce((a, b) => a + b, 0) / s.earSamples.length;
            }

            s.burstRunning = true;
            setMsg("Verifying real face… hold still");
            const result = await runSpoofBurstCheck(vid, det.detection.box);
            s.burstRunning = false;

            if (result.suspicious) {
              s.pct = 15; 
              s.earSamples = []; s.baselineEar = null;
              setPct(s.pct); setIsOk(false);
              setMsg("Real face required — screen/photo na use karein");
              return;
            }
            s.step = 1;
          }

        } else if (s.step === 1) {
          if (s.ch === "BLINK") {
            const e = avgEar(lm);
            const closedT = (s.baselineEar || 0.3) * BLINK_DROP_RATIO;
            const openT   = (s.baselineEar || 0.3) * OPEN_RECOVER_RATIO;

            if (e <= closedT) {
              s.closedFrames++; s.openFrames = 0;
              if (s.closedFrames >= NEEDED_CLOSED_FRAMES) setMsg("Eyes closed — now open");
            } else if (e >= openT) {
              if (s.closedFrames >= NEEDED_CLOSED_FRAMES) {
                s.openFrames++;
                if (s.openFrames >= NEEDED_OPEN_FRAMES) {
                  s.pct = 70; s.closedFrames = 0; s.openFrames = 0; s.step = 2; 
                }
              } else {
                setMsg(`${label.BLINK}  ${Math.round(s.pct)}%`);
              }
            }

          } else if (s.ch === "LOOK_LEFT") {
            s.pct = Math.min(s.pct + 1, 68); setPct(Math.round(s.pct));
            if (isLookLeft(lm)) { s.pct = 70; s.step = 2; }
            else { setMsg(`${label.LOOK_LEFT}  ${Math.round(s.pct)}%`); }

          } else {
            s.pct = Math.min(s.pct + 1, 68); setPct(Math.round(s.pct));
            if (isLookRight(lm)) { s.pct = 70; s.step = 2; }
            else { setMsg(`${label.LOOK_RIGHT}  ${Math.round(s.pct)}%`); }
          }

        } else if (s.step === 2) {
          setMsg("Challenge verified ✓ Now look straight for photo (सामने सीधे देखें)");
          
          if (isLookingStraight(lm, det.detection.box, vid.videoWidth)) {
            s.step = 3; 
          } else {
            s.pct = Math.max(70, s.pct - 0.5);
            setPct(Math.round(s.pct));
          }

        } else if (s.step === 3) {
          s.pct = Math.min(s.pct + 4, 100);
          setPct(Math.round(s.pct));
          setMsg(`Saving clean profile… ${Math.round(s.pct)}%`);
          if (s.pct >= 100) { s.step = 4; capture(); }
        }

        setPct(Math.round(Math.min(s.pct, 100)));
      } catch (err) {
        console.error("Scanner internal failure loop:", err);
      } finally {
        s.busy = false;
      }
    }, LOOP_INTERVAL_MS);
  }, [capture]);

  useEffect(() => {
    const init = async () => {
      if (!window.faceapi) {
        await new Promise((res, rej) => {
          const sc = document.createElement("script");
          sc.src = FACE_API_JS;
          sc.onload = res; sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }
      if (!window.faceapi.nets.tinyFaceDetector.isLoaded) {
        setMsg("Loading face models…");
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
      }
      setLoading(false);
      setMsg("Starting camera…");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
        streamRef.current = stream;
        const vid = videoRef.current;
        vid.srcObject = stream;
        vid.onloadedmetadata = () => vid.play().then(startLoop);
      } catch {
        setMsg("Camera access denied!"); setIsOk(false);
      }
    };
    init();
    return () => stopAll();
  }, [startLoop, stopAll]);

  const offset     = OVAL_TOTAL - (OVAL_TOTAL * pct / 100);
  const strokeClr  = isOk ? "#22d3ee" : "#f87171";
  const cornerSide = { borderColor: strokeClr };

  return (
    <div style={css.overlay}>
      <div style={css.modal}>
        <div style={css.header}>
          <span style={css.title}>Face Scanner</span>
          <button style={css.closeBtn} onClick={handleClose}>✕</button>
        </div>

        <div style={css.camBox}>
          <video ref={videoRef} style={css.video} autoPlay muted playsInline />
          <div style={css.uiLayer}>
            <div style={css.ovalWrap}>
              {[
                { top: 0,    left: 0,    borderRightColor:"transparent", borderBottomColor:"transparent" },
                { top: 0,    right: 0,   borderLeftColor:"transparent",  borderBottomColor:"transparent" },
                { bottom: 0, left: 0,    borderRightColor:"transparent", borderTopColor:"transparent" },
                { bottom: 0, right: 0,   borderLeftColor:"transparent",  borderTopColor:"transparent" },
              ].map((pos, i) => (
                <div key={i} style={{ ...css.corner, ...cornerSide, ...pos }} />
              ))}

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
                <ellipse cx="50" cy="50" rx="46" ry="47" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1.5"/>
                <ellipse cx="50" cy="50" rx="46" ry="47" fill="none" stroke={strokeClr} strokeWidth="2.5"
                  strokeDasharray={OVAL_TOTAL} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)"
                  style={{ transition:"stroke-dashoffset .18s linear, stroke .25s" }}/>
              </svg>
            </div>
          </div>

          {loading && (
            <div style={css.dimmer}>
              <div style={css.spinner}/>
            </div>
          )}
        </div>

        <div style={{ ...css.statusBar, borderColor: isOk ? "rgba(34,211,238,.2)" : "rgba(248,113,113,.2)", color: strokeClr }}>
          {msg}
        </div>

        <div style={css.track}>
          <div style={{ ...css.fill, width:`${pct}%`, background: strokeClr }} />
        </div>
        <div style={css.pctLabel}>{pct}%</div>
      </div>
    </div>
  );
}

const css = {
  overlay:   { position:"fixed", inset:0, background:"rgba(4,7,14,.9)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 },
  modal:     { background:"#0e1422", borderRadius:22, border:"1px solid rgba(255,255,255,.07)", padding:24, width:"100%", maxWidth:460, boxShadow:"0 32px 80px rgba(0,0,0,.7)" },
  header:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
  title:     { fontSize:16, fontWeight:600, color:"#f1f5f9" },
  closeBtn:  { background:"none", border:"none", color:"rgba(255,255,255,.3)", fontSize:18, cursor:"pointer", lineHeight:1, padding:4 },
  camBox:    { position:"relative", aspectRatio:"4/3", borderRadius:14, overflow:"hidden", background:"#050810" },
  video:     { width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)", display:"block" },
  uiLayer:   { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" },
  ovalWrap:  { position:"relative", width:200, height:267 },
  corner:    { position:"absolute", width:24, height:24, border:"3px solid", borderRadius:5 },
  dimmer:    { position:"absolute", inset:0, background:"rgba(5,8,16,.7)", display:"flex", alignItems:"center", justifyContent:"center" },
  spinner:   { width:36, height:36, border:"3px solid rgba(34,211,238,.2)", borderTopColor:"#22d3ee", borderRadius:"50%", animation:"spin .8s linear infinite" },
  statusBar: { marginTop:14, border:"1px solid", borderRadius:10, padding:"10px 14px", textAlign:"center", fontSize:14, fontWeight:500 },
  track:     { marginTop:10, height:4, background:"rgba(255,255,255,.06)", borderRadius:4, overflow:"hidden" },
  fill:      { height:"100%", borderRadius:4, transition:"width .2s, background .3s" },
  pctLabel:  { textAlign:"right", fontSize:12, color:"rgba(255,255,255,.25)", marginTop:4 },
};