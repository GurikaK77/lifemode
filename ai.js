let detector;
let video;
let canvas;
let ctx;
let animationId;
let count = 0;
let isDown = false;
let isRunning = false;

// მგრძნობელობის პარამეტრები
const THRESHOLD_DOWN = 0.65; 
const THRESHOLD_UP = 0.45;

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

    const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            isRunning = true;
            count = 0;
            isDown = false;
            updateCountUI();
            detectPose();
            resolve();
        };
    });
}

async function detectPose() {
    if (!isRunning) return;

    try {
        const poses = await detector.estimatePoses(video);
        if (poses && poses.length > 0) {
            const keypoints = poses[0].keypoints;
            drawSkeleton(keypoints); // ხაზების გავლება
            analyzeMovement(keypoints);
        }
    } catch (e) {
        console.error(e);
    }

    animationId = requestAnimationFrame(detectPose);
}

// ჩონჩხის დახატვა
function drawSkeleton(keypoints) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // წერტილები
    keypoints.forEach(kp => {
        if(kp.score > 0.3) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#00ff9d';
            ctx.fill();
        }
    });

    // ხაზები (მხრები, ხელები, ტანი)
    const connections = [
        ['left_shoulder', 'right_shoulder'],
        ['left_shoulder', 'left_elbow'],
        ['left_elbow', 'left_wrist'],
        ['right_shoulder', 'right_elbow'],
        ['right_elbow', 'right_wrist'],
        ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip'],
        ['left_hip', 'right_hip']
    ];

    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 3;

    connections.forEach(([p1, p2]) => {
        const kp1 = keypoints.find(k => k.name === p1);
        const kp2 = keypoints.find(k => k.name === p2);
        
        if(kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.stroke();
        }
    });
}

function analyzeMovement(keypoints) {
    const nose = keypoints.find(k => k.name === 'nose');

    if (nose && nose.score > 0.4) {
        const y = nose.y / canvas.height;

        // დიაგნოსტიკური ხაზები
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
        ctx.moveTo(0, canvas.height * THRESHOLD_DOWN);
        ctx.lineTo(canvas.width, canvas.height * THRESHOLD_DOWN);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
        ctx.moveTo(0, canvas.height * THRESHOLD_UP);
        ctx.lineTo(canvas.width, canvas.height * THRESHOLD_UP);
        ctx.stroke();

        if (y > THRESHOLD_DOWN) {
            isDown = true;
            document.getElementById('aiCountDisplay').style.color = 'yellow';
        } else if (y < THRESHOLD_UP && isDown) {
            count++;
            isDown = false;
            updateCountUI();
            playBeep();
            document.getElementById('aiCountDisplay').style.color = '#00e676';
        }
    }
}

function updateCountUI() {
    document.getElementById('aiCountDisplay').innerText = count;
}

function playBeep() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

export function stopCamera() {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    return count;
}

document.addEventListener('DOMContentLoaded', initAI);
