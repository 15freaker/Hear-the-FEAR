const bgMusic = document.getElementById("bgMusic");
const clickAudio = document.getElementById("clickAudio");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");
//door
const doorScene = document.getElementById("doorScene");
const doorImage = document.getElementById("doorImage");
const interactBox = document.getElementById("interactBox");
const controlsHint = document.getElementById("controlsHint");
const doorVideo = document.getElementById("doorVideo");
const doorAudio = document.getElementById("doorAudio");
//stranger
const strangerScene = document.getElementById("strangerScene");
const stranger = document.getElementById("stranger");
const dialogueBox = document.getElementById("dialogueBox");
const speakerName = document.getElementById("speakerName");
const dialogueText = document.getElementById("dialogueText");
const choiceContainer = document.getElementById("choiceContainer");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
//audio
const talkAudio = document.getElementById("talkAudio");
const dialogueClickAudio = document.getElementById("dialogueClickAudio");
//step
const strangerStep1 = document.getElementById("strangerStep1");
const strangerStep2 = document.getElementById("strangerStep2");

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
let strangerWalking = false;
let strangerProgress = 0;
let strangerAnimation = null;
let strangerStepNumber = 0;
let lastStrangerStep = 0;
let typing = false;
let typingTimer = null;
let currentDialogue = null;

function playClick() {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
}
function playDialogueClick() {
    dialogueClickAudio.currentTime = 0;
    dialogueClickAudio.play().catch(() => {});
}
function playTalk() {
    talkAudio.currentTime = 0;
    talkAudio.play().catch(() => {});
}
yesBtn.addEventListener("click", () => {
    playClick();
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    document.getElementById("startScreen").style.display = "none";
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
    if (doorScene.style.display !== "block") {
        return;
    }
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
    if (walking) {
        return;
    }
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
        playerPosition = Math.max(
            0,
            Math.min(100, playerPosition)
        );
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
    const scale =
        0.35 +
        (playerPosition / 100) * 1.65;
    const horizontalMove =
        turn * 2;
    const bobY =
        parseFloat(
            doorImage.dataset.bobY || 0
        );
    const bobX =
        parseFloat(
            doorImage.dataset.bobX || 0
        );
    const tilt =
        parseFloat(
            doorImage.dataset.tilt || 0
        );
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
doorVideo.addEventListener("ended", () => {
    doorVideo.style.display = "none";
    doorScene.style.display = "none";
    startStrangerScene();
});
function startStrangerScene() {
    strangerScene.style.display = "block";
    dialogueBox.style.display = "none";
    stranger.style.display = "block";
    strangerProgress = 0;
    strangerWalking = true;
    stranger.classList.add("walking");
    stranger.style.opacity = "0";
    stranger.style.transform =
        "translate(-50%, -50%) scale(0.08)";
    lastStrangerStep = performance.now();
    strangerAnimation =
        requestAnimationFrame(approachStranger);
}
function approachStranger() {
    if (!strangerWalking) {
        return;
    }
    strangerProgress += 0.0017;
    if (strangerProgress > 1) {
        strangerProgress = 1;
    }
    const scale =
        0.08 +
        strangerProgress * 1.05;
    const verticalMovement =
        Math.sin(
            strangerProgress * Math.PI * 10
        ) * 2;
    stranger.style.transform =
        `translate(-50%, calc(-50% + ${verticalMovement}px)) scale(${scale})`;
    stranger.style.opacity =
        Math.min(
            1,
            strangerProgress * 2.5
        );
    const now = performance.now();
    const stepDelay =
        700 -
        strangerProgress * 350;
    if (now - lastStrangerStep > stepDelay) {
        playStrangerStep();
        lastStrangerStep = now;
    }
    if (strangerProgress < 1) {
        strangerAnimation =
            requestAnimationFrame(
                approachStranger
            );
    } else {
        strangerWalking = false;
        stranger.classList.remove("walking");
        setTimeout(() => {
            startDialogueSequence();
        }, 700);
    }
}
function playStrangerStep() {
    if (strangerStepNumber === 0) {
        strangerStep1.currentTime = 0;
        strangerStep1.volume =
            0.2 +
            strangerProgress * 0.8;
        strangerStep1.play().catch(() => {});
        strangerStepNumber = 1;
    } else {
        strangerStep2.currentTime = 0;
        strangerStep2.volume =
            0.2 +
            strangerProgress * 0.8;
        strangerStep2.play().catch(() => {});
        strangerStepNumber = 0;
    }
}
const dialogue = {
    opening: {
        speaker: "STRANGER",
        text: "Hey... what are you doing out this late?",
        choices: [
            {
                text: "I was just walking around.",
                next: "walk"
            },
            {
                text: "That's none of your business.",
                next: "rude"
            }
        ]
    },
    walk: {
        speaker: "YOU",
        text: "I was just walking around.",
        choices: [
            {
                text: "Ask him who he is.",
                next: "who"
            },
            {
                text: "Ask why he is here.",
                next: "why"
            }
        ]
    },
    rude: {
        speaker: "YOU",
        text: "That's none of your business.",
        choices: [
            {
                text: "Calm down and explain.",
                next: "explain"
            },
            {
                text: "Walk past him.",
                next: "past"
            }
        ]
    },
    who: {
        speaker: "STRANGER",
        text: "Me? I live nearby.",
        choices: [
            {
                text: "I've never seen you here before.",
                next: "never"
            },
            {
                text: "Oh... okay.",
                next: "okay"
            }
        ]
    },
    why: {
        speaker: "STRANGER",
        text: "I could ask you the same thing.",
        choices: [
            {
                text: "I was looking for someone.",
                next: "looking"
            },
            {
                text: "I don't know. I just ended up here.",
                next: "ended"
            }
        ]
    },
    explain: {
        speaker: "STRANGER",
        text: "You don't have to be angry. I was only asking.",
        choices: [
            {
                text: "Sorry. It's been a strange night.",
                next: "strange"
            },
            {
                text: "I'm leaving.",
                next: "leaving"
            }
        ]
    },
    past: {
        speaker: "STRANGER",
        text: "Wait.",
        choices: [
            {
                text: "Stop.",
                next: "stop"
            },
            {
                text: "Keep walking.",
                next: "keep"
            }
        ]
    },
    never: {
        speaker: "STRANGER",
        text: "People don't usually come this way.",
        choices: [
            {
                text: "Why not?",
                next: "not"
            },
            {
                text: "What do you mean?",
                next: "mean"
            }
        ]
    },
    okay: {
        speaker: "STRANGER",
        text: "You should probably go home.",
        choices: [
            {
                text: "Why?",
                next: "whyHome"
            },
            {
                text: "I can take care of myself.",
                next: "myself"
            }
        ]
    },
    looking: {
        speaker: "STRANGER",
        text: "At this hour?",
        choices: [
            {
                text: "Yeah. It's important.",
                next: "important"
            },
            {
                text: "Never mind.",
                next: "nevermind"
            }
        ]
    },
    ended: {
        speaker: "STRANGER",
        text: "That's strange.",
        choices: [
            {
                text: "What is strange about it?",
                next: "strangeAbout"
            },
            {
                text: "I should probably leave.",
                next: "leave2"
            }
        ]
    },
    strange: {
        speaker: "STRANGER",
        text: "A strange night...",
        choices: [
            {
                text: "Yeah.",
                next: "yeah"
            },
            {
                text: "Why are you repeating me?",
                next: "repeat"
            }
        ]
    },
    leaving: {
        speaker: "STRANGER",
        text: "Leaving already?",
        choices: [
            {
                text: "Yes.",
                next: "yesLeave"
            },
            {
                text: "Do you want something?",
                next: "want"
            }
        ]
    },
    stop: {
        speaker: "STRANGER",
        text: "You shouldn't go that way.",
        choices: [
            {
                text: "Why?",
                next: "danger"
            },
            {
                text: "I'll go wherever I want.",
                next: "whatever"
            }
        ]
    },
    keep: {
        speaker: "STRANGER",
        text: "You're not listening.",
        choices: [
            {
                text: "What are you talking about?",
                next: "talking"
            },
            {
                text: "Leave me alone.",
                next: "alone"
            }
        ]
    },
    not: {
        speaker: "STRANGER",
        text: "Because it's quiet.",
        choices: [
            {
                text: "Quiet?",
                next: "quiet"
            },
            {
                text: "There's nothing wrong with quiet.",
                next: "nothing"
            }
        ]
    },
    mean: {
        speaker: "STRANGER",
        text: "I mean... nobody comes here anymore.",
        choices: [
            {
                text: "Why?",
                next: "whyAgain"
            },
            {
                text: "Who used to come here?",
                next: "used"
            }
        ]
    },
    whyHome: {
        speaker: "STRANGER",
        text: "Because it's getting late.",
        choices: [
            {
                text: "What time is it?",
                next: "time"
            },
            {
                text: "It doesn't feel that late.",
                next: "feels"
            }
        ]
    },
    myself: {
        speaker: "STRANGER",
        text: "I'm sure you can.",
        choices: [
            {
                text: "Then why are you still here?",
                next: "still"
            },
            {
                text: "Goodnight.",
                next: "goodnight"
            }
        ]
    },
    important: {
        speaker: "STRANGER",
        text: "Important enough to come here alone?",
        choices: [
            {
                text: "Yes.",
                next: "yesImportant"
            },
            {
                text: "I changed my mind.",
                next: "changed"
            }
        ]
    },
    nevermind: {
        speaker: "STRANGER",
        text: "Sometimes that's the safest answer.",
        choices: [
            {
                text: "What does that mean?",
                next: "safe"
            },
            {
                text: "I'm going.",
                next: "going"
            }
        ]
    },
    strangeAbout: {
        speaker: "STRANGER",
        text: "You said you ended up here. People usually choose to come here.",
        choices: [
            {
                text: "I didn't choose this place.",
                next: "didntChoose"
            },
            {
                text: "Maybe I did.",
                next: "maybe"
            }
        ]
    },
    leave2: {
        speaker: "STRANGER",
        text: "You can try.",
        choices: [
            {
                text: "Try?",
                next: "try"
            },
            {
                text: "What do you mean?",
                next: "meaning"
            }
        ]
    },
    yeah: {
        speaker: "STRANGER",
        text: "Then you should understand why I'm here.",
        choices: [
            {
                text: "I don't understand.",
                next: "dontUnderstand"
            },
            {
                text: "Maybe I do.",
                next: "maybeUnderstand"
            }
        ]
    },
    repeat: {
        speaker: "STRANGER",
        text: "I wasn't repeating you.",
        choices: [
            {
                text: "Yes, you were.",
                next: "yesWere"
            },
            {
                text: "Forget it.",
                next: "forget"
            }
        ]
    },
    yesLeave: {
        speaker: "STRANGER",
        text: "Then don't look behind you.",
        choices: [
            {
                text: "Why?",
                next: "lookWhy"
            },
            {
                text: "What is behind me?",
                next: "behind"
            }
        ]
    },
    want: {
        speaker: "STRANGER",
        text: "No. I just wanted to see if you were real.",
        choices: [
            {
                text: "What does that mean?",
                next: "real"
            },
            {
                text: "I'm real.",
                next: "prove"
            }
        ]
    },
    danger: {
        speaker: "STRANGER",
        text: "Because that's where I came from.",
        choices: [
            {
                text: "What happened there?",
                next: "happened"
            },
            {
                text: "I don't believe you.",
                next: "believe"
            }
        ]
    },
    whatever: {
        speaker: "STRANGER",
        text: "That's what the last person said.",
        choices: [
            {
                text: "Last person?",
                next: "last"
            },
            {
                text: "Who?",
                next: "whoLast"
            }
        ]
    },
    talking: {
        speaker: "STRANGER",
        text: "Nothing.",
        choices: [
            {
                text: "That doesn't answer my question.",
                next: "question"
            },
            {
                text: "Forget it.",
                next: "forget2"
            }
        ]
    },
    alone: {
        speaker: "STRANGER",
        text: "You are not alone.",
        choices: [
            {
                text: "What do you mean?",
                next: "notAlone"
            },
            {
                text: "Stop trying to scare me.",
                next: "scare"
            }
        ]
    },
    quiet: {
        speaker: "STRANGER",
        text: "Too quiet.",
        choices: [
            {
                text: "I don't hear anything.",
                next: "hear"
            },
            {
                text: "Neither do I.",
                next: "neither"
            }
        ]
    },
    nothing: {
        speaker: "STRANGER",
        text: "Maybe.",
        choices: [
            {
                text: "Maybe what?",
                next: "maybeWhat"
            },
            {
                text: "You're being strange.",
                next: "strangeAgain"
            }
        ]
    },
    whyAgain: {
        speaker: "STRANGER",
        text: "Because they stopped coming back.",
        choices: [
            {
                text: "Who?",
                next: "whoAgain"
            },
            {
                text: "Stopped coming back from where?",
                next: "where"
            }
        ]
    },
    used: {
        speaker: "STRANGER",
        text: "People who were looking for something.",
        choices: [
            {
                text: "Did they find it?",
                next: "find"
            },
            {
                text: "What were they looking for?",
                next: "lookingFor"
            }
        ]
    },
    time: {
        speaker: "STRANGER",
        text: "Late enough.",
        choices: [
            {
                text: "That's not a time.",
                next: "notTime"
            },
            {
                text: "You're avoiding the question.",
                next: "avoid"
            }
        ]
    },
    feels: {
        speaker: "STRANGER",
        text: "That's because you're not where you think you are.",
        choices: [
            {
                text: "What?",
                next: "what"
            },
            {
                text: "Explain.",
                next: "explain2"
            }
        ]
    },
    still: {
        speaker: "STRANGER",
        text: "Because someone has to stay.",
        choices: [
            {
                text: "Stay for what?",
                next: "stay"
            },
            {
                text: "I'm leaving now.",
                next: "leaveNow"
            }
        ]
    },
    goodnight: {
        speaker: "STRANGER",
        text: "Goodnight.",
        choices: [
            {
                text: "Goodnight.",
                next: "end"
            },
            {
                text: "Wait.",
                next: "wait"
            }
        ]
    },
    end: {
        speaker: "STRANGER",
        text: "You should not have answered.",
        choices: [
            {
                text: "What?",
                next: "final"
            },
            {
                text: "Why?",
                next: "final"
            }
        ]
    },
    final: {
        speaker: "STRANGER",
        text: "Because now I know you can hear me.",
        choices: [
            {
                text: "Continue.",
                next: "finish"
            },
            {
                text: "Continue.",
                next: "finish"
            }
        ]
    },
    finish: {
        speaker: "STRANGER",
        text: "Good.",
        choices: []
    }
};
dialogue.yesImportant = {
    speaker:"STRANGER",
    text:"Then you should be careful about who you meet here.",
    choices:[
        {text:"Why?",next:"careful"},
        {text:"I'm not afraid.",next:"notAfraid"}
    ]
};
dialogue.changed = {
    speaker:"STRANGER",
    text:"Changing your mind doesn't always change where you are.",
    choices:[
        {text:"What does that mean?",next:"meaning"},
        {text:"I'm leaving anyway.",next:"leaveNow"}
    ]
};
dialogue.safe = {
    speaker:"STRANGER",
    text:"It means you should listen when someone tells you to leave.",
    choices:[
        {text:"Are you warning me?",next:"warning"},
        {text:"I don't trust you.",next:"trust"}
    ]
};
dialogue.going = {
    speaker:"STRANGER",
    text:"Then go. But don't take the path behind the door.",
    choices:[
        {text:"Why not?",next:"danger"},
        {text:"What path?",next:"path"}
    ]
};
dialogue.didntChoose = {
    speaker:"STRANGER",
    text:"Then maybe something chose it for you.",
    choices:[
        {text:"That's impossible.",next:"impossible"},
        {text:"What chose it?",next:"whatChose"}
    ]
};
dialogue.maybe = {
    speaker:"STRANGER",
    text:"Then you already know more than you should.",
    choices:[
        {text:"Know what?",next:"knowWhat"},
        {text:"Forget I said that.",next:"forget"}
    ]
};
dialogue.try = {
    speaker:"STRANGER",
    text:"Try walking away. See what happens.",
    choices:[
        {text:"I'm going.",next:"leaveNow"},
        {text:"You're not making sense.",next:"meaning"}
    ]
};
dialogue.meaning = {
    speaker:"STRANGER",
    text:"Some places remember the people who enter them.",
    choices:[
        {text:"What does this place remember?",next:"remember"},
        {text:"I don't want to know.",next:"forget"}
    ]
};
dialogue.dontUnderstand = {
    speaker:"STRANGER",
    text:"You will.",
    choices:[
        {text:"What am I supposed to understand?",next:"understand"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.maybeUnderstand = {
    speaker:"STRANGER",
    text:"Then you know why you shouldn't stay.",
    choices:[
        {text:"Why shouldn't I stay?",next:"stay"},
        {text:"I'm staying.",next:"stayHere"}
    ]
};
dialogue.yesWere = {
    speaker:"STRANGER",
    text:"Maybe you heard something you weren't supposed to hear.",
    choices:[
        {text:"What did I hear?",next:"hearWhat"},
        {text:"You're confusing me.",next:"confused"}
    ]
};
dialogue.forget = {
    speaker:"STRANGER",
    text:"You can forget the words. You can't forget the place.",
    choices:[
        {text:"What place?",next:"path"},
        {text:"I'm leaving now.",next:"leaveNow"}
    ]
};
dialogue.lookWhy = {
    speaker:"STRANGER",
    text:"Because sometimes the person behind you isn't the person you expect.",
    choices:[
        {text:"Then who is it?",next:"behind"},
        {text:"I'm not looking.",next:"notLooking"}
    ]
};
dialogue.behind = {
    speaker:"STRANGER",
    text:"Don't turn around.",
    choices:[
        {text:"Why?",next:"danger"},
        {text:"I don't believe you.",next:"believe"}
    ]
};
dialogue.real = {
    speaker:"STRANGER",
    text:"That's exactly what I wanted to know.",
    choices:[
        {text:"Why?",next:"whyReal"},
        {text:"What are you?",next:"whatAreYou"}
    ]
};
dialogue.prove = {
    speaker:"STRANGER",
    text:"Then prove it to yourself. Keep walking.",
    choices:[
        {text:"Where?",next:"path"},
        {text:"No.",next:"no"}
    ]
};
dialogue.happened = {
    speaker:"STRANGER",
    text:"People went in. Not everyone came back.",
    choices:[
        {text:"What was inside?",next:"inside"},
        {text:"I'm not going there.",next:"leaveNow"}
    ]
};
dialogue.believe = {
    speaker:"STRANGER",
    text:"You don't have to believe me.",
    choices:[
        {text:"Then why tell me?",next:"whyTell"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.last = {
    speaker:"STRANGER",
    text:"The last person who ignored me.",
    choices:[
        {text:"What happened to them?",next:"happened"},
        {text:"Was it here?",next:"here"}
    ]
};
dialogue.whoLast = {
    speaker:"STRANGER",
    text:"Someone who thought they were alone.",
    choices:[
        {text:"Were they?",next:"notAlone"},
        {text:"Where are they now?",next:"where"}
    ]
};
dialogue.question = {
    speaker:"STRANGER",
    text:"Maybe you shouldn't be asking questions anymore.",
    choices:[
        {text:"Why?",next:"danger"},
        {text:"I need answers.",next:"answers"}
    ]
};
dialogue.forget2 = {
    speaker:"STRANGER",
    text:"That's usually what people say before they remember.",
    choices:[
        {text:"Remember what?",next:"remember"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.notAlone = {
    speaker:"STRANGER",
    text:"You haven't been alone since you opened that door.",
    choices:[
        {text:"What was behind the door?",next:"inside"},
        {text:"Stop.",next:"stop"}
    ]
};
dialogue.scare = {
    speaker:"STRANGER",
    text:"I'm not trying to scare you.",
    choices:[
        {text:"Then what are you doing?",next:"whyTell"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.hear = {
    speaker:"STRANGER",
    text:"Listen carefully.",
    choices:[
        {text:"I hear something.",next:"hearWhat"},
        {text:"I hear nothing.",next:"neither"}
    ]
};
dialogue.neither = {
    speaker:"STRANGER",
    text:"That's what makes it worse.",
    choices:[
        {text:"Why?",next:"quiet"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.maybeWhat = {
    speaker:"STRANGER",
    text:"Maybe there is something you haven't noticed yet.",
    choices:[
        {text:"What?",next:"what"},
        {text:"I don't want to know.",next:"forget"}
    ]
};
dialogue.strangeAgain = {
    speaker:"STRANGER",
    text:"You noticed that too.",
    choices:[
        {text:"Noticed what?",next:"what"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.whoAgain = {
    speaker:"STRANGER",
    text:"People like you.",
    choices:[
        {text:"What happened to them?",next:"happened"},
        {text:"How many?",next:"howMany"}
    ]
};
dialogue.where = {
    speaker:"STRANGER",
    text:"Beyond the path you came through.",
    choices:[
        {text:"Can I go there?",next:"path"},
        {text:"I don't want to.",next:"leaveNow"}
    ]
};
dialogue.find = {
    speaker:"STRANGER",
    text:"Some did. Some found something they wished they hadn't.",
    choices:[
        {text:"What did they find?",next:"inside"},
        {text:"I don't want to know.",next:"forget"}
    ]
};
dialogue.lookingFor = {
    speaker:"STRANGER",
    text:"Something they thought they had lost.",
    choices:[
        {text:"Did they find it?",next:"find"},
        {text:"What was it?",next:"whatWasIt"}
    ]
};
dialogue.notTime = {
    speaker:"STRANGER",
    text:"No. It isn't.",
    choices:[
        {text:"Then what time is it?",next:"time"},
        {text:"What are you hiding?",next:"hiding"}
    ]
};
dialogue.avoid = {
    speaker:"STRANGER",
    text:"Because the exact time doesn't matter anymore.",
    choices:[
        {text:"Why?",next:"whyTime"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.what = {
    speaker:"STRANGER",
    text:"Look around you.",
    choices:[
        {text:"What am I looking for?",next:"lookingFor"},
        {text:"There's nothing here.",next:"nothing"}
    ]
};
dialogue.explain2 = {
    speaker:"STRANGER",
    text:"You walked through a door that wasn't meant for you.",
    choices:[
        {text:"What does that mean?",next:"meaning"},
        {text:"How do I get back?",next:"back"}
    ]
};
dialogue.stay = {
    speaker:"STRANGER",
    text:"For the people who are still trying to leave.",
    choices:[
        {text:"Can I leave?",next:"back"},
        {text:"Why don't they leave?",next:"whyStay"}
    ]
};
dialogue.leaveNow = {
    speaker:"STRANGER",
    text:"Then walk toward the sound and don't stop.",
    choices:[
        {text:"What sound?",next:"hearWhat"},
        {text:"Where does it lead?",next:"path"}
    ]
};
dialogue.wait = {
    speaker:"STRANGER",
    text:"You shouldn't have waited.",
    choices:[
        {text:"Why?",next:"final"},
        {text:"What happens now?",next:"finish"}
    ]
};
dialogue.careful = {
    speaker:"STRANGER",
    text:"Because this place doesn't forgive mistakes.",
    choices:[
        {text:"What mistake?",next:"mistake"},
        {text:"I need to leave.",next:"leaveNow"}
    ]
};
dialogue.notAfraid = {
    speaker:"STRANGER",
    text:"Everyone says that at first.",
    choices:[
        {text:"At first?",next:"atFirst"},
        {text:"What happens next?",next:"finish"}
    ]
};
dialogue.warning = {
    speaker:"STRANGER",
    text:"Maybe. Or maybe I'm too late.",
    choices:[
        {text:"Too late for what?",next:"tooLate"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.trust = {
    speaker:"STRANGER",
    text:"You don't need to trust me. Just listen.",
    choices:[
        {text:"I'm listening.",next:"hearWhat"},
        {text:"No.",next:"finish"}
    ]
};
dialogue.path = {
    speaker:"STRANGER",
    text:"The same way you came. Just don't expect it to look the same.",
    choices:[
        {text:"What changed?",next:"changedPlace"},
        {text:"I'll find out.",next:"finish"}
    ]
};
dialogue.impossible = {
    speaker:"STRANGER",
    text:"You'd be surprised what is possible here.",
    choices:[
        {text:"What is this place?",next:"whatPlace"},
        {text:"Enough.",next:"finish"}
    ]
};
dialogue.whatChose = {
    speaker:"STRANGER",
    text:"Something that has been waiting for someone to open that door.",
    choices:[
        {text:"Who was it waiting for?",next:"whoWaiting"},
        {text:"I'm leaving.",next:"leaveNow"}
    ]
};
dialogue.knowWhat = {
    speaker:"STRANGER",
    text:"You know where the path leads.",
    choices:[
        {text:"Tell me.",next:"inside"},
        {text:"I don't want to know.",next:"finish"}
    ]
};
dialogue.remember = {
    speaker:"STRANGER",
    text:"Faces. Voices. Footsteps.",
    choices:[
        {text:"And mine?",next:"yourFace"},
        {text:"I don't like this.",next:"finish"}
    ]
};
dialogue.understand = {
    speaker:"STRANGER",
    text:"That you were never supposed to meet me.",
    choices:[
        {text:"Then why did I?",next:"whyMeet"},
        {text:"I want to leave.",next:"leaveNow"}
    ]
};
dialogue.stayHere = {
    speaker:"STRANGER",
    text:"Then I'll see you again.",
    choices:[
        {text:"What does that mean?",next:"final"},
        {text:"Goodbye.",next:"finish"}
    ]
};
dialogue.hearWhat = {
    speaker:"STRANGER",
    text:"Footsteps. Yours aren't the only ones.",
    choices:[
        {text:"Where?",next:"where"},
        {text:"I don't hear them.",next:"neither"}
    ]
};
dialogue.confused = {
    speaker:"STRANGER",
    text:"Good. Confusion keeps people from noticing things.",
    choices:[
        {text:"What things?",next:"what"},
        {text:"I'm done.",next:"finish"}
    ]
};
dialogue.notLooking = {
    speaker:"STRANGER",
    text:"Good.",
    choices:[
        {text:"Good?",next:"final"},
        {text:"I'm leaving.",next:"finish"}
    ]
};
dialogue.whyReal = {
    speaker:"STRANGER",
    text:"Because I haven't seen anyone real in a long time.",
    choices:[
        {text:"What happened to them?",next:"happened"},
        {text:"Who are you?",next:"who"}
    ]
};
dialogue.whatAreYou = {
    speaker:"STRANGER",
    text:"Someone who was here before you.",
    choices:[
        {text:"And before that?",next:"whoAgain"},
        {text:"I don't understand.",next:"dontUnderstand"}
    ]
};
dialogue.no = {
    speaker:"STRANGER",
    text:"Then you have already made your choice.",
    choices:[
        {text:"What choice?",next:"final"},
        {text:"Goodbye.",next:"finish"}
    ]
};
dialogue.inside = {
    speaker:"STRANGER",
    text:"A place that looks different to everyone who enters.",
    choices:[
        {text:"What did you see?",next:"whatSaw"},
        {text:"I don't want to see it.",next:"finish"}
    ]
};
dialogue.whyTell = {
    speaker:"STRANGER",
    text:"Because you deserve to know what comes next.",
    choices:[
        {text:"What comes next?",next:"next"},
        {text:"I don't want to know.",next:"finish"}
    ]
};
dialogue.here = {
    speaker:"STRANGER",
    text:"Yes. Right here.",
    choices:[
        {text:"Then how do I leave?",next:"back"},
        {text:"Why are you helping me?",next:"whyHelp"}
    ]
};
dialogue.answers = {
    speaker:"STRANGER",
    text:"Answers aren't always safer than questions.",
    choices:[
        {text:"Then give me one answer.",next:"final"},
        {text:"Forget it.",next:"finish"}
    ]
};
dialogue.howMany = {
    speaker:"STRANGER",
    text:"Enough that I stopped counting.",
    choices:[
        {text:"Where are they?",next:"where"},
        {text:"I don't want to know.",next:"finish"}
    ]
};
dialogue.whatWasIt = {
    speaker:"STRANGER",
    text:"A way out.",
    choices:[
        {text:"Did they find it?",next:"find"},
        {text:"Can I find it?",next:"back"}
    ]
};
dialogue.hiding = {
    speaker:"STRANGER",
    text:"Nothing. I'm waiting.",
    choices:[
        {text:"For what?",next:"tooLate"},
        {text:"I'm leaving.",next:"finish"}
    ]
};
dialogue.whyTime = {
    speaker:"STRANGER",
    text:"Because time doesn't move normally here.",
    choices:[
        {text:"Then how long have I been here?",next:"howLong"},
        {text:"I want out.",next:"back"}
    ]
};
dialogue.back = {
    speaker:"STRANGER",
    text:"Follow the path behind me.",
    choices:[
        {text:"Okay.",next:"finish"},
        {text:"Why should I trust you?",next:"trust"}
    ]
};
dialogue.whyStay = {
    speaker:"STRANGER",
    text:"Because leaving isn't always an option.",
    choices:[
        {text:"What happens if you try?",next:"tryLeave"},
        {text:"That's impossible.",next:"impossible"}
    ]
};
dialogue.mistake = {
    speaker:"STRANGER",
    text:"Opening the door.",
    choices:[
        {text:"Then why did you let me?",next:"whyLet"},
        {text:"I'm leaving.",next:"finish"}
    ]
};
dialogue.atFirst = {
    speaker:"STRANGER",
    text:"Before they hear the second voice.",
    choices:[
        {text:"What second voice?",next:"secondVoice"},
        {text:"I don't hear anything.",next:"hear"}
    ]
};
dialogue.tooLate = {
    speaker:"STRANGER",
    text:"For you to turn back.",
    choices:[
        {text:"Then what do I do?",next:"back"},
        {text:"I'm not staying.",next:"finish"}
    ]
};
dialogue.changedPlace = {
    speaker:"STRANGER",
    text:"You did.",
    choices:[
        {text:"What?",next:"final"},
        {text:"I don't understand.",next:"dontUnderstand"}
    ]
};
dialogue.whatPlace = {
    speaker:"STRANGER",
    text:"A place between where you were and where you thought you were going.",
    choices:[
        {text:"How do I get back?",next:"back"},
        {text:"I don't believe you.",next:"believe"}
    ]
};
dialogue.whoWaiting = {
    speaker:"STRANGER",
    text:"You.",
    choices:[
        {text:"Why me?",next:"whyMeet"},
        {text:"I want to leave.",next:"finish"}
    ]
};
dialogue.yourFace = {
    speaker:"STRANGER",
    text:"I hope I remember it.",
    choices:[
        {text:"What does that mean?",next:"final"},
        {text:"Goodbye.",next:"finish"}
    ]
};
dialogue.whyMeet = {
    speaker:"STRANGER",
    text:"Because you opened the door.",
    choices:[
        {text:"And now?",next:"final"},
        {text:"I'm leaving.",next:"finish"}
    ]
};
dialogue.whatSaw = {
    speaker:"STRANGER",
    text:"A road that never seemed to end.",
    choices:[
        {text:"Is that where I am going?",next:"next"},
        {text:"No.",next:"finish"}
    ]
};
dialogue.next = {
    speaker:"STRANGER",
    text:"You'll see soon enough.",
    choices:[
        {text:"What should I do?",next:"back"},
        {text:"I don't want to.",next:"finish"}
    ]
};
dialogue.whyHelp = {
    speaker:"STRANGER",
    text:"Maybe I'm not helping you.",
    choices:[
        {text:"What do you mean?",next:"final"},
        {text:"I'm leaving.",next:"finish"}
    ]
};
dialogue.tryLeave = {
    speaker:"STRANGER",
    text:"You come back here.",
    choices:[
        {text:"Every time?",next:"final"},
        {text:"Then I'll find another way.",next:"finish"}
    ]
};
dialogue.whyLet = {
    speaker:"STRANGER",
    text:"I didn't.",
    choices:[
        {text:"Then who did?",next:"whoWaiting"},
        {text:"I want to leave.",next:"finish"}
    ]
};
dialogue.secondVoice = {
    speaker:"STRANGER",
    text:"Listen.",
    choices:[
        {text:"I hear it.",next:"final"},
        {text:"I hear nothing.",next:"finish"}
    ]
};
dialogue.howLong = {
    speaker:"STRANGER",
    text:"Long enough for the path to change.",
    choices:[
        {text:"Then show me the way out.",next:"back"},
        {text:"I'm staying here.",next:"finish"}
    ]
};

function startDialogueSequence() {
    dialogueBox.style.display = "block";
    showDialogue("opening");
}
function showDialogue(id) {
    const scene = dialogue[id];
    if (!scene) {
        return;
    }
    currentDialogue = id;
    typing = true;
    clearInterval(typingTimer);
    dialogueText.textContent = "";
    speakerName.textContent =
        scene.speaker;
    choiceContainer.style.display =
        "none";
    choice1.style.display = "none";
    choice2.style.display = "none";
    playTalk();
    let index = 0;
    typingTimer = setInterval(() => {
        dialogueText.textContent +=
            scene.text[index];
        index++;
        if (index >= scene.text.length) {
            clearInterval(typingTimer);
            typing = false;
            setTimeout(() => {
                showChoices(scene);
            }, 500);
        }
    }, 35);
}
function showChoices(scene) {
    if (!scene.choices ||
        scene.choices.length === 0) {
        setTimeout(() => {
            finishConversation();
        }, 2500);
        return;
    }
    choiceContainer.style.display =
        "flex";
    choice1.style.display =
        "block";
    choice1.textContent =
        scene.choices[0].text;
    choice1.onclick = () => {
        if (typing) {
            finishTyping();
            return;
        }
        playDialogueClick();
        showDialogue(
            scene.choices[0].next
        );
    };
    if (scene.choices[1]) {
        choice2.style.display =
            "block";
        choice2.textContent =
            scene.choices[1].text;
        choice2.onclick = () => {
            if (typing) {
                finishTyping();
                return;
            }
            playDialogueClick();
            showDialogue(
                scene.choices[1].next
            );
        };
    } else {
        choice2.style.display =
            "none";
    }
}
function finishTyping() {
    const scene =
        dialogue[currentDialogue];
    if (!scene) {
        return;
    }
    clearInterval(typingTimer);
    dialogueText.textContent =
        scene.text;
    typing = false;
    showChoices(scene);
}
function finishConversation() {
    choiceContainer.style.display = "none";
    dialogueText.textContent = "";
    speakerName.textContent = "";
    stranger.style.opacity = "0";

    setTimeout(() => {
        strangerScene.style.display = "none";
        pathwayScene.style.display = "block";
        document.body.style.background = "black";
        startPathwayScene();
    },2500);
}
const pathwayScene = document.getElementById("pathwayScene");
const pathwayControls = document.getElementById("pathwayControls");
const pathImages = [
    document.getElementById("pathImage1"),
    document.getElementById("pathImage2"),
    document.getElementById("pathImage3"),
    document.getElementById("pathImage4"),
    document.getElementById("pathImage5"),
    document.getElementById("pathImage6"),
    document.getElementById("pathImage7"),
    document.getElementById("pathImage8"),
    document.getElementById("pathImage9"),
    document.getElementById("pathImage10")
];
const pathAudios = [
    document.getElementById("pathAudio1"),
    document.getElementById("pathAudio2"),
    document.getElementById("pathAudio3"),
    document.getElementById("pathAudio4"),
    document.getElementById("pathAudio5"),
    document.getElementById("pathAudio6"),
    document.getElementById("pathAudio7"),
    document.getElementById("pathAudio8"),
    document.getElementById("pathAudio9"),
    document.getElementById("pathAudio10")
];

let pathwayPosition = 0;
let pathwayDirection = 0;
let pathwayWalking = false;
let pathwayAnimation = null;
let pathwayTime = 0;

function startPathwayScene() {
    pathwayScene.style.display = "block";
    pathwayPosition = 0;
    pathwayDirection = 0;
    pathwayWalking = false;
    pathwayTime = 0;
    pathImages.forEach(image => {
        image.style.opacity = "0";
        image.style.transform = "translateY(-50%) scale(0.4)";
    });
    pathAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
    });
    updatePathway();
    setTimeout(() => {
        pathwayControls.style.opacity = "0";
    },5000);
}

function updatePathway() {
    pathImages.forEach((image,index) => {
        const distance = Math.abs(index * 10 - pathwayPosition);
        const visibility = Math.max(0,1 - distance / 16);
        const scale = 0.35 + visibility * 0.75;
        const sideMovement = index % 2 === 0 ? -distance * 2 : distance * 2;
        image.style.opacity = visibility;
        image.style.filter = `brightness(${0.15 + visibility * 0.85})`;
        image.style.transform = `translateY(-50%) translateX(${sideMovement}px) scale(${scale})`;
    });

    pathAudios.forEach((audio,index) => {
        const distance = Math.abs(index * 10 - pathwayPosition);
        const volume = Math.max(0,1 - distance / 18);
        audio.volume = volume * 0.9;

        if (volume > 0.02 && audio.paused) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }

        if (volume <= 0.02 && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function startPathwayWalking() {
    if (pathwayWalking) {
        return;
    }

    pathwayWalking = true;

    function walkPathway() {
        if (!pathwayWalking) {
            pathwayAnimation = null;
            return;
        }

        if (pathwayDirection === 1) {
            pathwayPosition += 0.22;
        }

        if (pathwayDirection === -1) {
            pathwayPosition -= 0.22;
        }

        pathwayPosition = Math.max(0,Math.min(100,pathwayPosition));

        pathwayTime += 0.12;

        const bob = Math.sin(pathwayTime * 2) * 4;

        pathImages.forEach(image => {
            image.style.marginTop = `${bob}px`;
        });

        updatePathway();
        pathwayAnimation = requestAnimationFrame(walkPathway);
    }

    pathwayAnimation = requestAnimationFrame(walkPathway);
}

function stopPathwayWalking() {
    pathwayWalking = false;

    if (pathwayAnimation) {
        cancelAnimationFrame(pathwayAnimation);
        pathwayAnimation = null;
    }

    pathImages.forEach(image => {
        image.style.marginTop = "0";
    });
}

document.addEventListener("keydown",event => {
    if (pathwayScene.style.display !== "block") {
        return;
    }

    if (
        event.key === "w" ||
        event.key === "W" ||
        event.key === "ArrowUp"
    ) {
        event.preventDefault();
        pathwayDirection = 1;
        startPathwayWalking();
    }

    if (
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ) {
        event.preventDefault();
        pathwayDirection = -1;
        startPathwayWalking();
    }
});

document.addEventListener("keyup",event => {
    if (pathwayScene.style.display !== "block") {
        return;
    }

    if (
        event.key === "w" ||
        event.key === "W" ||
        event.key === "ArrowUp" ||
        event.key === "s" ||
        event.key === "S" ||
        event.key === "ArrowDown"
    ) {
        pathwayDirection = 0;
        stopPathwayWalking();
    }
});