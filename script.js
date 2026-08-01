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

/* ============ BIRTHDAY MUSIC (real audio file, auto-plays) ============ */
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
let musicPlaying = false;

function setPlayingUI(isPlaying) {
  musicPlaying = isPlaying;
  musicIcon.textContent = isPlaying ? "❚❚" : "♪";
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause birthday tune" : "Play birthday tune");
}

// Browsers block audio with sound from autoplaying until the visitor
// interacts with the page at least once. We try immediately on load;
// if that's blocked, we start on the very first click/tap/keypress instead.
function attemptAutoplay() {
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => setPlayingUI(true))
      .catch(() => {
        const startOnFirstInteraction = () => {
          bgMusic.play().then(() => setPlayingUI(true)).catch(() => {});
          window.removeEventListener("click", startOnFirstInteraction);
          window.removeEventListener("touchstart", startOnFirstInteraction);
          window.removeEventListener("keydown", startOnFirstInteraction);
        };
        window.addEventListener("click", startOnFirstInteraction, { once: true });
        window.addEventListener("touchstart", startOnFirstInteraction, { once: true });
        window.addEventListener("keydown", startOnFirstInteraction, { once: true });
      });
  }
}

window.addEventListener("DOMContentLoaded", attemptAutoplay);

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    bgMusic.pause();
    setPlayingUI(false);
  } else {
    bgMusic.play().then(() => setPlayingUI(true)).catch(() => {});
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
