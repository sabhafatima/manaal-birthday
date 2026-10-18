// Sound Setup
const music = document.getElementById("bg-music");

// Initialize Continuous Floating Balloons
let balloonInterval = null;

function startContinuousBalloons() {
  const container = document.getElementById("balloon-container");
  const colors = ["#ff7675", "#fd79a8", "#a29bfe", "#ffeaa7", "#74b9ff", "#fab1a0", "#55efc4"];

  function createSingleBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.left = `${Math.random() * 92}vw`;
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const duration = 6 + Math.random() * 5;
    balloon.style.animationDuration = `${duration}s`;
    container.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, duration * 1000);
  }

  // Create initial wave
  for (let i = 0; i < 15; i++) {
    setTimeout(createSingleBalloon, i * 250);
  }

  // Keep spawning continuously
  if (!balloonInterval) {
    balloonInterval = setInterval(createSingleBalloon, 600);
  }
}

// Stage Switching
function goToStage(stageNumber) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  if (stageNumber === 2) document.getElementById('stage-ready').classList.add('active');
  if (stageNumber === 3) {
    document.getElementById('stage-wish').classList.add('active');
    startMusic();
    startContinuousBalloons();
    triggerConfettiBurst();
  }
  if (stageNumber === 4) document.getElementById('stage-gallery').classList.add('active');
  if (stageNumber === 5) document.getElementById('stage-cake').classList.add('active');
  if (stageNumber === 6) document.getElementById('stage-letter').classList.add('active');
  if (stageNumber === 7) {
    document.getElementById('stage-thankyou').classList.add('active');
    triggerGrandCelebration();
  }
}

// STAGE 1: Check Passcode
function checkLock() {
  const input = document.getElementById('passcode-input').value;
  const error = document.getElementById('lock-error');

  if (input === "0000") {
    error.innerText = "";
    goToStage(2);
  } else {
    error.innerText = "❌ Incorrect passcode! Hint: 4 zeros (0000)";
    shakeCard();
  }
}

function shakeCard() {
  const card = document.querySelector('#stage-lock .glass-card');
  card.style.transform = "translateX(-8px)";
  setTimeout(() => card.style.transform = "translateX(8px)", 80);
  setTimeout(() => card.style.transform = "translateX(-6px)", 160);
  setTimeout(() => card.style.transform = "translateX(0)", 240);
}

// STAGE 2: Funny NO Button Logic
let noClickCount = 0;
const funnyResponses = [
  "Wait... what?! Did you really just press NO? 😠 Try again!",
  "Hey Manaal Amer! How dare you say NO to your best friend?! 😤",
  "Don't be stubborn now! Click YES right this second! 😡💖",
  "Warning: Saying NO is illegal on your birthday! Click YES! 👊🎉"
];

function rejectNo() {
  const alertBox = document.getElementById('funny-alert');
  alertBox.innerText = funnyResponses[noClickCount % funnyResponses.length];
  noClickCount++;
}

function dodgeNo() {
  if (noClickCount >= 1) {
    const noBtn = document.getElementById('no-button');
    const randomX = Math.floor(Math.random() * 120) - 60;
    const randomY = Math.floor(Math.random() * 80) - 40;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }
}

// Play Music Safely
function startMusic() {
  if (music && music.paused) {
    music.volume = 0.8;
    music.play().catch(e => console.log("Audio needs user interaction: ", e));
  }
}

// STAGE 4: Memory Gallery Array
const memories = [
  {
    image: "images/photo2.jpg",
    caption: "Proof that we are completely crazy together and I wouldn't trade it for the world! 😂💖"
  },
  {
    image: "images/photo3.jpg",
    caption: "Here's to the late night talks, silly inside jokes, and endless giggles! 🌸✨"
  },
  {
    image: "images/photo4.jpg",
    caption: "Always looking gorgeous as ever! May your glow never fade, my bestie! 👑💫"
  }
];

let currentMemory = 0;

function nextMemory() {
  currentMemory++;
  if (currentMemory < memories.length) {
    document.getElementById('memory-counter').innerText = `Memory ${currentMemory + 1} of 3`;
    document.getElementById('gallery-img').src = memories[currentMemory].image;
    document.getElementById('gallery-caption').innerText = memories[currentMemory].caption;
  } else {
    goToStage(5);
  }
}

// STAGE 5: Cake Candle Blow
let candleBlown = false;

function blowCandle() {
  if (candleBlown) return;

  const flame = document.getElementById('flame');
  flame.classList.add('off');
  candleBlown = true;

  document.getElementById('blow-btn').classList.add('hidden');
  document.getElementById('final-btn').classList.remove('hidden');

  triggerGrandCelebration();
}

// STAGE 6: Celebrate Twice Logic
let celebrateCount = 0;

function handleCelebrateAgain() {
  celebrateCount++;
  triggerGrandCelebration();

  const btn = document.getElementById('celebrate-btn');
  if (celebrateCount === 1) {
    btn.innerText = "One More Time! 🎉 (Click Again)";
  } else if (celebrateCount >= 2) {
    setTimeout(() => {
      goToStage(7);
    }, 1200);
  }
}

// STAGE 7: Close Website
function closeWebsite() {
  triggerGrandCelebration();
  document.getElementById('exit-msg').classList.remove('hidden');

  setTimeout(() => {
    window.open('', '_self', '');
    window.close();

    document.body.innerHTML = `
      <div style="text-align: center; color: #ff4757; font-family: 'Poppins', sans-serif; padding: 30px;">
        <h1 style="font-size: 32px;">Happy Birthday Again, Manaal Amer! 💖</h1>
        <p style="font-size: 18px; color: #555; margin-top: 12px;">You can now close this tab. Have the most wonderful day! 🌸✨</p>
      </div>
    `;
  }, 1800);
}

// Animations & Confetti
function triggerConfettiBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function triggerGrandCelebration() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
  }, 250);
}