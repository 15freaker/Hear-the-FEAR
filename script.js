const bgMusic = document.getElementById("bgMusic");
const clickAudio = document.getElementById("clickAudio");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const doorScene = document.getElementById("doorScene");
const doorImage = document.getElementById("doorImage");
const interactBox = document.getElementById("interactBox");
const controlsHint = document.getElementById("controlsHint");
const doorVideo = document.getElementById("doorVideo");
const doorAudio = document.getElementById("doorAudio");

const step1 = new Audio("assests/sounds/step1.mp3");
const step2 = new Audio("assests/sounds/step2.mp3");

const jumpScareAudio = new Audio ("assests/sounds/jump.mp3");
const jumpScareImage = document.createElement("img");

jumpScareImage.src = "assests/jump.png";
jumpScareImage.id = "jumpScareImage";

document.body.appendChild(jumpScareImage);
let jumpScareActive = false;
let nextJumpScare = null;

let playerPosition = 0;
let turn = 0;

let moveDirection = 0;
let walking = false;
let walkTime = 0;
let animationFrame = null;

let stepNumber = 0;
let lastStepTime = 0;

function playClick() {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
}

yesBtn.addEventListener("click", () => {
    playClick();

    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});

    doorScene.style.display = "block";

    playerPosition = 0;
    turn = 0;

    updateDoor();

    setTimeout(() => {
        controlsHint.style.opacity = "0";
    }, 5000);
});

noBtn.addEventListener("click", () => {
    playClick();
    message.textContent = "Put your headphones on first";
});

document.addEventListener("keydown", (event) => {
    if (doorScene.style.display !== "block") return;

    if (
        event.key === "w" ||
        event.key === "W" ||
        event.key === "ArrowUp"
    ) {
        event.preventDefault();
        moveDirection = 1;
        startWalking();
    }

    if (
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ) {
        event.preventDefault();
        moveDirection = -1;
        startWalking();
    }

    if (
        event.key === "a" ||
        event.key === "A" ||
        event.key === "ArrowLeft"
    ) {
        event.preventDefault();
        turn -= 5;
        updateDoor();
    }

    if (
        event.key === "d" ||
        event.key === "D" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
        turn += 5;
        updateDoor();
    }
});

document.addEventListener("keyup", (event) => {
    if (
        event.key === "w" ||
        event.key === "W" ||
        event.key === "ArrowUp" ||
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ) {
        moveDirection = 0;
        stopWalking();
    }
});

function startWalking() {
    if (walking) return;

    walking = true;
    walkTime = 0;
    lastStepTime = 0;

    function walk() {
        if (!walking) {
            animationFrame = null;

            doorImage.dataset.bobY = 0;
            doorImage.dataset.bobX = 0;
            doorImage.dataset.tilt = 0;

            updateDoor();
            return;
        }

        if (moveDirection === 1) {
            playerPosition += 0.35;
        }

        if (moveDirection === -1) {
            playerPosition -= 0.35;
        }

        playerPosition = Math.max(0, Math.min(100, playerPosition));

        walkTime += 0.18;

        const bobY = Math.sin(walkTime * 2) * 7;
        const bobX = Math.sin(walkTime) * 3;
        const tilt = Math.sin(walkTime) * 1.2;

        doorImage.dataset.bobY = bobY;
        doorImage.dataset.bobX = bobX;
        doorImage.dataset.tilt = tilt;

        updateDoor();

        const now = performance.now();

        if (now - lastStepTime > 420) {
            playStep();
            lastStepTime = now;
        }

        animationFrame = requestAnimationFrame(walk);
    }

    animationFrame = requestAnimationFrame(walk);
}

function stopWalking() {
    walking = false;

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    doorImage.dataset.bobY = 0;
    doorImage.dataset.bobX = 0;
    doorImage.dataset.tilt = 0;

    updateDoor();
}

function updateDoor() {
    const scale = 0.35 + (playerPosition / 100) * 1.65;

    const horizontalMove = turn * 2;

    const bobY = parseFloat(doorImage.dataset.bobY || 0);
    const bobX = parseFloat(doorImage.dataset.bobX || 0);
    const tilt = parseFloat(doorImage.dataset.tilt || 0);

    doorImage.style.transform =
        `translate(calc(-50% + ${horizontalMove + bobX}px), calc(-50% + ${bobY}px)) rotate(${tilt}deg) scale(${scale})`;

    if (playerPosition >= 85) {
        interactBox.style.display = "block";
    } else {
        interactBox.style.display = "none";
    }
}

function playStep() {
    if (stepNumber === 0) {
        step1.currentTime = 0;
        step1.play().catch(() => {});
        stepNumber = 1;
    } else {
        step2.currentTime = 0;
        step2.play().catch(() => {});
        stepNumber = 0;
    }
}

interactBox.addEventListener("click", () => {
    stopWalking();

    doorImage.style.display = "none";
    interactBox.style.display = "none";

    doorAudio.currentTime = 0;
    doorAudio.play().catch(() => {});

    doorVideo.style.display = "block";
    doorVideo.currentTime = 0;
    doorVideo.play().catch(() => {});
});
