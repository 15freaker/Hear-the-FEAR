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

const horrorPath =document.getElementById("horrorPath");
const horrorWorld = document.getElementById("horrorWorld");
const pathControls= document.getElementById("pathControls");

const ghosts =[...document.querySelectorAll(".ghost")].map(ghost => {
    return {
        element:ghost,
        image:ghost.querySelector("img"),
        audio:ghost.querySelector("audio"),
        position:Number (ghost.dataset.position)
    };
});
let pathPosition=0;
let pathDirection =0;
let pathWalking=false;
let pathAnimationFrame=null;
let pathWalkTime=0;
let pathLastStep=0;

const pathStep1=new Audio("assests/sounds/step1.mp3");
const pathStep2=new Audio("assests/sounds/step2.mp3");

let pathStepNumber = 0;

function startHorrorPath() {
    doorVideo.style.display = "none"
    horrorPath.style.display="block";
    
    pathPosition=0;
    pathDirection=0;
    pathWalking=false;
    pathWalkTime=0;
    
    updateHorrorPath();

    setTimeout(()=> {
        pathControls.style.opacity ="0";
    },5000);
}
function updateHorrorPath(){
    const bobY=pathWalking
    ? Math.sin(pathWalkTime * 2)* 6
    : 0;

    const bobX = pathWalking
    ?Math.sin(pathWalkTime) *3
    : 0;

    const tilt = pathWalking
    ? Math.sin(pathWalkTime)*0.8
    : 0;

horrorWorld.style.transform=`translate(${bobX}px) rotate(${tilt}deg)`;

ghosts.forEach(ghost => {
    const distance = Math.abs(pathPosition - ghost.position);
    const visibilityRange = 180;
    const audioRange =300;

    let opacity = 0;

    if (distance < visibilityRange) {
        opacity =1 - distance / visibilityRange;
    }
    ghost.element.style.opacity=opacity;
    const scale=0.7 + Math.max(
        0,
        1- distance / visibilityRange)*0.3;
        ghost.element.style.transform =
        `translateY(-50%) scale(${scale})`;
        let volume=0;
        if (distance < audioRange) {
            volume=1 -distance / audioRange;
        }
        volume = Math.max(0,Math.min(1,volume));
        ghost.audio.volume = volume *0.9;

        if(volume > 0.01) {
            if (ghost.audio.paused) {
                ghost.audio.currentTime=0;
                ghost.audio.play().catch(()=>{});
            }
        } else {
            if (!ghost.audio.paused){
                ghost.audio.pause();
                ghost.audio.currentTime =0;
            }
        }
});
}
function startPathWalking(){
    if (pathWalking)return;
    pathWalking =true;
    pathWalkTime=0;
    pathLastStep=0;
    
    function walk() {
        if (!pathWalking) {
            pathAnimationFrame =null;
            updateHorrorPath();
            return;
        }
        if (pathDirection === 1){
            pathPosition += 2;
        }
        if(pathDirection === -1){
            pathPosition -= 2;
        }
        pathPosition = Math.max(0,Math.min(2100,pathPosition));
        pathWalkTime += 0.18;
        updateHorrorPath();
        const now = performance.now();
        if (now - pathLastStep > 420) {
            playPathStep();
            pathLastStep=now;
        }
        pathAnimationFrame=requestAnimationFrame(walk);
    }
    pathAnimationFrame = requestAnimationFrame(walk);
}
function stopPathWalking(){
    pathWalking = false;

    if (pathAnimationFrame) {
        cancelAnimationFrame(pathAnimationFrame);
        pathAnimationFrame = null;
    }
    updateHorrorPath();
}
function playPathStep() {
    if (pathStepNumber === 0) {
        pathStep1.currentTime = 0;
        pathStep1.play().catch(()=> {});
        pathStepNumber =1;
    } else {
        pathStep2.currentTime=0;
        pathStep2.play().catch(()=> {});
        pathStepNumber=0;
    }
}
document.addEventListener("keydown",event =>{
    if (horrorPath.style.display !== "block")return;
    if (
        event.key ==="w" ||
        event.key === "W" ||
        event.key === "ArrowUp"
    ){
        event.preventDefault();
        pathDirection=1;
        startPathWalking();
    }
    if (
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ){
        event.preventDefault();
        pathDirection =-1;
        startPathWalking();
    }
});
document.addEventListener("keyup", event => {
    if (
        event.key === "w" ||
        event.key === "W" ||
        event.key === "ArrowUp" ||
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ){
        pathDirection=0;
        stopPathWalking();
    }
});
doorVideo.addEventListener("ended", ()=>{
    startHorrorPath();
});