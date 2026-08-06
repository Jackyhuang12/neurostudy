import { Niivue, SLICE_TYPE } from "../vendor/niivue.js";

let nv = null;
let activeCase = null;
const sliceTypes = { axial:SLICE_TYPE.AXIAL, coronal:SLICE_TYPE.CORONAL, sagittal:SLICE_TYPE.SAGITTAL, multiplanar:SLICE_TYPE.MULTIPLANAR };

function setStatus(text, kind="") {
  const el = document.getElementById("viewer-status");
  if (el) { el.textContent = text; el.dataset.kind = kind; }
}

async function init(caseId="normal-t1") {
  const canvas = document.getElementById("niivue-canvas");
  if (!canvas || typeof LEARNING_CASES === "undefined") return;
  activeCase = LEARNING_CASES.imaging.find(x => x.id === caseId) || LEARNING_CASES.imaging[0];
  setStatus("正在载入真实三维体数据…");
  try {
    nv = new Niivue({
      backColor:[0.025,0.045,0.075,1], crosshairColor:[1,0.55,0.2,1],
      show3Dcrosshair:true, isResizeCanvas:true, dragAndDropEnabled:false
    });
    await nv.attachToCanvas(canvas);
    await nv.loadVolumes(activeCase.volumes);
    nv.setSliceType(SLICE_TYPE.MULTIPLANAR);
    nv.onLocationChange = loc => {
      const vox = loc && loc.vox ? loc.vox.map(v=>Math.round(v)).join(" / ") : "移动十字线读取位置";
      setStatus(`当前体素：${vox} · 用滚轮逐层浏览，拖动十字线定位`);
    };
    setStatus("已载入 · 滚轮换层，拖动十字线，右键拖动调窗");
  } catch (err) {
    console.error(err);
    setStatus("影像载入失败：请检查网络后刷新页面", "error");
  }
}

function setPlane(plane) {
  if (!nv || !sliceTypes[plane]) return;
  nv.setSliceType(sliceTypes[plane]);
  document.querySelectorAll("[data-plane]").forEach(b=>b.classList.toggle("active", b.dataset.plane===plane));
}

function toggleOverlay(show) {
  if (!nv || !nv.volumes || nv.volumes.length < 2) return;
  nv.setOpacity(1, show ? 0.62 : 0);
}

function reset() { if (activeCase) init(activeCase.id); }

window.MedicalViewer = { init, setPlane, toggleOverlay, reset };
window.dispatchEvent(new Event("medical-viewer-ready"));
