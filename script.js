const bgMusic = document.getElementById("bgMusic");
const clickAudio = document.getElementById("clickAudio");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const doorScene=document.getElementById("doorScene");
const doorImage=document.getElementById("doorImage");
const interactBox=document.getElementById("interactBox");
const controlsHint=document.getElementById("controlsHint");
const doorVideo=document.getElementById("doorVideo");
const doorAudio=document.getElementById("doorAudio");

const step1 = new Audio("assests/sounds/step1.mp3");
const step2 = new Audio("assests/sounds/step2.mp3");

let playerPosition=0;
let turn =0;
let walking= false;
let stepNumber=0;

function playClick(){
    clickAudio.currentTime =0;
    clickAudio.play();
}

yesBtn.addEventListener("click", () =>{
    playClick();
    bgMusic.volume=0.4;
    bgMusic.play();
    doorScene.style.display="block";

    setTimeout(()=> {
        controlsHint.style.opacity="0";
    },5000);
});

noBtn.addEventListener("click",()=> {
    playClick();
    message.textContent="Put your headphones on first";
});

document.addEventListener("keydown",(event)=>{
    if (doorScene.style.display !== "block")return;
    if (event.key ==="w" || event.key==="ArrowUp"){
        moveForward();
    }
    if (event.key==="s" || event.key==="ArrowDown"){
        moveBackward();
    }
    if (event.key ==="a" || event.key ==="ArrowLeft"){
        turn -= 5;
        updateDoor();
    }
    if (event.key==="d" || event.key ==="ArrowRight"){
        turn += 5;
        updateDoor();
    }
})
function moveForward() {
playerPosition += 5;
if (playerPosition > 100) {
    playerPosition = 100;
}
playStep();
updateDoor();
}
function moveBackward(){
    playerPosition -=5;
    if (playerPosition < 0) {
        playerPosition = 0;
    }
    playStep();
    updateDoor();
}
function updateDoor(){
    const scale = 1 + playerPosition / 12;
    const horizontalMove = turn * 2;
    doorImage.style.transform = `translate(calc(-50% + ${horizontalMove}px),-50%)scale(${scale})`;

    if (playerPosition >= 85) {
        interactBox.style.display = "block";
    }else {
        interactBox.style.display="none";
    }
}
function playStep() {
    if (walking) return;
    walking = true;
    if (stepNumber === 0) {
        step1.currentTime = 0;
        step1.play();
        stepNumber = 1;
    } else {
        step2.currentTime = 0;
        step2.play();
        stepNumber = 0;
    }
    setTimeout(() => {
        walking = false;
    }, 250);
}
interactBox.addEventListener("click", () =>{
    doorImage.style.display="none";
    interactBox.style.display="none";

    doorAudio.currentTime = 0;
    doorAudio.play();

    doorVideo.style.display="block";
    doorVideo.currentTime=0;
    doorVideo.play();
});