let detector;
let video;
let canvas;
let ctx;
let animationId;
let count = 0;
let isRunning = false;
let poseState = 'up';

const ANGLE_DOWN = 90;
const ANGLE_UP = 160;

export async function initAI() {
    await tf.setBackend('webgl');
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.LIGHTNING
    });
    console.log("AI Model Loaded");
}

export async function startCamera() {
    video = document.getElementById('webcam');
    canvas = document.getElementById('outputCanvas');
    ctx = canvas.getContext('2d');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        isRunning = true; count = 0; poseState = 'up';
        updateCountUI(); detectPose();
    };
}

async function detectPose() {
    if (!isRunning) return;
    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
        drawSkeleton(poses[0].keypoints);
        analyzeMovement(poses[0].keypoints);
    }
    animationId = requestAnimationFrame(detectPose);
}

function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
}

function analyzeMovement(kp) {
    const ls = kp.find(k=>k.name==='left_shoulder'), le = kp.find(k=>k.name==='left_elbow'), lw = kp.find(k=>k.name==='left_wrist');
    let angle = 0; let conf = 0;
    if(ls?.score>0.3 && le?.score>0.3 && lw?.score>0.3) { angle = calculateAngle(ls, le, lw); conf = le.score; }
    
    const fb = document.getElementById('aiFeedback');
    if (conf > 0.3) {
        if (poseState === 'up') {
            fb.innerText = "ჩადი ქვევით...";
            if (angle < ANGLE_DOWN) { poseState = 'down'; }
        } else if (poseState === 'down') {
            fb.innerText = "ადი ზევით!";
            if (angle > ANGLE_UP) { count++; poseState = 'up'; updateCountUI(); }
        }
    } else { fb.innerText = "ვერ ვხედავ სხეულს..."; }
}

function drawSkeleton(kp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    kp.forEach(p => {
        if(p.score > 0.3) {
            ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
            ctx.fillStyle = '#00d2ff'; ctx.fill();
        }
    });
}

function updateCountUI() {
    document.getElementById('aiCountDisplay').innerText = count;
}

export function stopCamera() {
    isRunning = false; cancelAnimationFrame(animationId);
    if(video?.srcObject) video.srcObject.getTracks().forEach(t=>t.stop());
    return count;
}

document.addEventListener('DOMContentLoaded', initAI);