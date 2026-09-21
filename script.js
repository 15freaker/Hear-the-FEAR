const bgMusic = document.getElementById("bgMusic");
const clickAudio = document.getElementById("clickAudio");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

function playClick(){
    clickAudio.currentTime =0;
    clickAudio.play();
}

yesBtn.addEventListener("click", () =>{
    playClick();
    bgMusic.volume=0.4;
    bgMusic.play();
    message.textContent="Good";
});

noBtn.addEventListener("click",()=> {
    playClick();
    message.textContent="Put your headphones on first";
});
