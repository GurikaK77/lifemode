let detector;
let video;
let canvas;
let ctx;
let animationId;
let count = 0;
let isRunning = false;
let poseState = 'up'; // 'up' or 'down'

// AI-ის მგრძნობელობის პარამეტრები (Pushscroll სტილი)
const ANGLE_DOWN = 90; // იდაყვის კუთხე, როცა ქვევით ხარ
const ANGLE_UP = 160;   // იდაყვის კუთხე, როცა ზევით ხარ (გაშლილი ხელი)

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
            poseState = 'up';
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
            drawSkeleton(keypoints);
            analyzeMovement(keypoints);
        }
    } catch (e) {
        console.error(e);
    }

    animationId = requestAnimationFrame(detectPose);
}

// კუთხის გამოთვლის ფორმულა (სამი წერტილის მიხედვით)
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
}

function analyzeMovement(keypoints) {
    // ვიღებთ მარცხენა და მარჯვენა მხარეს
    const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
    const leftElbow = keypoints.find(k => k.name === 'left_elbow');
    const leftWrist = keypoints.find(k => k.name === 'left_wrist');

    const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');
    const rightElbow = keypoints.find(k => k.name === 'right_elbow');
    const rightWrist = keypoints.find(k => k.name === 'right_wrist');

    let angle = 0;
    let confidence = 0;

    // ვირჩევთ იმ მხარეს, რომელიც უკეთ ჩანს
    if (leftShoulder?.score > 0.3 && leftElbow?.score > 0.3 && leftWrist?.score > 0.3) {
        angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        confidence = leftElbow.score;
    } else if (rightShoulder?.score > 0.3 && rightElbow?.score > 0.3 && rightWrist?.score > 0.3) {
        angle = calculateAngle(rightShoulder, rightElbow, rightWrist);
        confidence = rightElbow.score;
    }

    const feedbackEl = document.getElementById('aiFeedback');

    if (confidence > 0.3) {
        // ვიზუალიზაცია: კუთხის ჩვენება
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(Math.round(angle) + "°", 20, 50);

        // State Machine ლოგიკა (Pushscroll)
        if (poseState === 'up') {
            feedbackEl.innerText = "ჩადი ქვევით...";
            if (angle < ANGLE_DOWN) {
                poseState = 'down';
                playTone(400); // სიგნალი რომ ჩახვედი
            }
        } 
        else if (poseState === 'down') {
            feedbackEl.innerText = "ადი ზევით!";
            if (angle > ANGLE_UP) {
                count++;
                poseState = 'up';
                updateCountUI();
                playTone(800); // სიგნალი რომ ახვედი (წარმატებული რეპ)
                triggerConfettiLocal();
            }
        }
    } else {
        feedbackEl.innerText = "ვერ ვხედავ იდაყვს...";
    }
}

function drawSkeleton(keypoints) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const connections = [
        ['left_shoulder', 'right_shoulder'],
        ['left_shoulder', 'left_elbow'],
        ['left_elbow', 'left_wrist'],
        ['right_shoulder', 'right_elbow'],
        ['right_elbow', 'right_wrist'],
        ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip']
    ];

    ctx.lineWidth = 4;

    connections.forEach(([p1, p2]) => {
        const kp1 = keypoints.find(k => k.name === p1);
        const kp2 = keypoints.find(k => k.name === p2);
        
        if(kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.strokeStyle = (poseState === 'down') ? '#ffff00' : '#00ff9d'; // ყვითელი თუ ჩასული ხარ, მწვანე თუ ზევით
            ctx.stroke();
        }
    });

    keypoints.forEach(kp => {
        if(kp.score > 0.3 && (kp.name.includes('nose') || kp.name.includes('shoulder') || kp.name.includes('elbow') || kp.name.includes('wrist'))) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
    });
}

function updateCountUI() {
    const el = document.getElementById('aiCountDisplay');
    el.innerText = count;
    el.style.transform = "scale(1.5)";
    setTimeout(() => el.style.transform = "scale(1)", 200);
}

function playTone(freq) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function triggerConfettiLocal() {
    if(typeof confetti !== 'undefined') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            disableForReducedMotion: true
        });
    }
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