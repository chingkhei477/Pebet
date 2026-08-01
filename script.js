/* ============ CONFIG ============ */
const CORRECT_DOB = "2001-08-11"; // 11 August 2001

const GALLERY_PHOTOS = [
  { src: "images/photo1.jpg", caption: "Effortlessly extra 😄" },
  { src: "images/photo2.jpg", caption: "Certified heartbreaker energy" },
  { src: "images/photo3.jpg", caption: "Plotting something, probably" },
  { src: "images/photo4.jpg", caption: "Iconic. No notes." },
  { src: "images/photo5.jpg", caption: "Main character moment" },
  { src: "images/photo6.jpg", caption: "10/10, no notes" },
];

/* ============ DOM REFS ============ */
const dobInput = document.getElementById("dob-input");
const unlockBtn = document.getElementById("unlock-btn");
const verifyMessage = document.getElementById("verify-message");
const ageSection = document.getElementById("age-section");
const ageNumberEl = document.getElementById("age-number");
const gallerySection = document.getElementById("gallery-section");
const galleryGrid = document.getElementById("gallery-grid");
const replayBtn = document.getElementById("replay-btn");

/* ============ DOB VERIFICATION + AGE CALC ============ */
function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

function animateAgeNumber(target) {
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    ageNumberEl.textContent = current;
  }, 40);
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  GALLERY_PHOTOS.forEach(photo => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.innerHTML = `
      <img src="${photo.src}" alt="${photo.caption}" />
      <div class="gallery-caption">${photo.caption}</div>
    `;
    galleryGrid.appendChild(item);
  });
}

function unlockCelebration() {
  const age = calculateAge(CORRECT_DOB);

  ageSection.classList.add("show");
  animateAgeNumber(age);

  renderGallery();
  gallerySection.classList.add("show");

  burstConfetti();
  burstHearts();

  ageSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

unlockBtn.addEventListener("click", () => {
  if (dobInput.value === CORRECT_DOB) {
    verifyMessage.textContent = "";
    unlockCelebration();
  } else {
    verifyMessage.textContent = "Nope, that's not it 😄 Try again!";
  }
});

replayBtn.addEventListener("click", () => {
  burstConfetti();
  burstHearts();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============ GENERATED BIRTHDAY TUNE (no external file needed) ============ */
let audioCtx = null;
let musicPlaying = false;
let musicTimeouts = [];

// Simple "Happy Birthday"-style melody as note/duration pairs (Hz, beats)
const TUNE = [
  [392, 0.5], [392, 0.5], [440, 1], [392, 1], [523, 1], [494, 2],
  [392, 0.5], [392, 0.5], [440, 1], [392, 1], [587, 1], [523, 2],
  [392, 0.5], [392, 0.5], [784, 1], [659, 1], [523, 1], [494, 1], [440, 2],
  [698, 0.5], [698, 0.5], [659, 1], [523, 1], [587, 1], [523, 2],
];

function playTune() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const beatLength = 0.32;
  let t = audioCtx.currentTime;

  TUNE.forEach(([freq, beats]) => {
    const duration = beats * beatLength;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
    t += duration * 0.92;
  });

  const totalDuration = TUNE.reduce((sum, [, beats]) => sum + beats * beatLength * 0.92, 0);
  const loopTimeout = setTimeout(() => {
    if (musicPlaying) playTune();
  }, totalDuration * 1000);
  musicTimeouts.push(loopTimeout);
}

function stopTune() {
  musicTimeouts.forEach(clearTimeout);
  musicTimeouts = [];
}

const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
musicToggle.addEventListener("click", () => {
  musicPlaying = !musicPlaying;
  if (musicPlaying) {
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    playTune();
    musicIcon.textContent = "❚❚";
  } else {
    stopTune();
    musicIcon.textContent = "♪";
  }
});
const sparkleLayer = document.getElementById("sparkle-layer");
const sparkleEmojis = ["✨", "⭐", "💫"];
function spawnSparkle() {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
  s.style.left = Math.random() * 100 + "vw";
  s.style.bottom = "-20px";
  s.style.animationDuration = (5 + Math.random() * 4) + "s";
  s.style.fontSize = (0.8 + Math.random() * 0.8) + "rem";
  sparkleLayer.appendChild(s);
  setTimeout(() => s.remove(), 9000);
}
setInterval(spawnSparkle, 600);

/* ============ CONFETTI BURST ============ */
const confettiLayer = document.getElementById("confetti-layer");
const confettiColors = ["#ffc9dd", "#d9c8f5", "#f6c667", "#fff7f0"];
function burstConfetti() {
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      c.style.animationDuration = (2.5 + Math.random() * 2) + "s";
      confettiLayer.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }, i * 15);
  }
}

/* ============ HEART BURST ============ */
const heartsLayer = document.getElementById("hearts-layer");
function burstHearts() {
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.textContent = "❤";
      h.style.left = Math.random() * 100 + "vw";
      h.style.fontSize = (1 + Math.random() * 1.2) + "rem";
      h.style.animationDuration = (4 + Math.random() * 3) + "s";
      heartsLayer.appendChild(h);
      setTimeout(() => h.remove(), 8000);
    }, i * 60);
  }
}
