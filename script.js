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
  // Shows the age being turned THIS calendar year (not the exact
  // current age), so the reveal is correct even before the actual
  // birthday date arrives.
  const dob = new Date(dobString);
  const today = new Date();
  return today.getFullYear() - dob.getFullYear();
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
    item.addEventListener("click", () => openLightbox(photo.src, photo.caption));
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

  // launch the full-page photo-by-photo story shortly after, so the
  // age reveal + confetti burst are visible for a beat first
  setTimeout(openStory, 900);
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
  setTimeout(openStory, 500);
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

/* ============ FULLSCREEN STORY (photos one-by-one, then the Reel) ============ */
// Final video shown after the photos (place the file in the images/ folder)
const FINAL_VIDEO_SRC = "images/final-video.mp4";

const STORY_DURATION = 20000; // ms each photo stays on screen (20s)

const storyViewer = document.getElementById("story-viewer");
const storyStage = document.getElementById("story-stage");
const storyProgress = document.getElementById("story-progress");
const storyCloseBtn = document.getElementById("story-close");
const storyPrevZone = document.getElementById("story-prev");
const storyNextZone = document.getElementById("story-next");

let storyIndex = 0;
let storyTimer = null;
let storySlides = [];
const totalStorySlides = GALLERY_PHOTOS.length + 1; // + 1 for the reel slide

function buildStory() {
  storyStage.innerHTML = "";
  storyProgress.innerHTML = "";
  storySlides = [];

  GALLERY_PHOTOS.forEach((photo) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = `<span class="bar-fill"></span>`;
    storyProgress.appendChild(bar);

    const slide = document.createElement("div");
    slide.className = "story-slide";
    slide.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" /><p class="story-caption">${photo.caption}</p>`;
    storyStage.appendChild(slide);
    storySlides.push(slide);
  });

  const reelBar = document.createElement("div");
  reelBar.className = "bar";
  reelBar.innerHTML = `<span class="bar-fill"></span>`;
  storyProgress.appendChild(reelBar);

  const videoSlide = document.createElement("div");
  videoSlide.className = "story-slide reel-slide";
  videoSlide.innerHTML = `
    <video id="final-video" src="${FINAL_VIDEO_SRC}" playsinline webkit-playsinline controls></video>
    <button id="story-finish">Continue to the site 🎉</button>
  `;
  storyStage.appendChild(videoSlide);
  storySlides.push(videoSlide);
}

let musicWasPlayingBeforeVideo = false;

function playFinalVideo() {
  const video = document.getElementById("final-video");
  if (!video) return;

  // duck the background music so only the video's own audio plays
  musicWasPlayingBeforeVideo = musicPlaying;
  if (musicPlaying) {
    bgMusic.pause();
    setPlayingUI(false);
  }

  video.currentTime = 0;
  video.muted = false;
  video.play().catch(() => {}); // if blocked, the visible controls let them hit play
  video.onended = () => closeStory();
}

function resumeMusicAfterVideo() {
  if (musicWasPlayingBeforeVideo) {
    musicWasPlayingBeforeVideo = false;
    bgMusic.play().then(() => setPlayingUI(true)).catch(() => {});
  }
}

function setStoryBars(i) {
  const bars = storyProgress.querySelectorAll(".bar");
  bars.forEach((bar, idx) => {
    bar.classList.remove("active", "done");
    if (idx < i) bar.classList.add("done");
    if (idx === i) {
      bar.classList.add("active");
      bar.style.setProperty("--story-duration", `${STORY_DURATION}ms`);
    }
  });
}

function goToStorySlide(i) {
  clearTimeout(storyTimer);
  if (i < 0) i = 0;
  if (i >= totalStorySlides) {
    closeStory();
    return;
  }

  storyIndex = i;
  storySlides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  setStoryBars(i);

  const isReel = i === totalStorySlides - 1;
  storyPrevZone.style.display = isReel ? "none" : "block";
  storyNextZone.style.display = isReel ? "none" : "block";

  if (isReel) {
    playFinalVideo();
    // no auto-advance here — the video auto-closes the story when it ends,
    // or the visitor can tap "Continue" any time
  } else {
    storyTimer = setTimeout(() => goToStorySlide(i + 1), STORY_DURATION);
  }
}

function openStory() {
  buildStory();
  storyViewer.classList.add("active");
  document.body.classList.add("story-open");
  goToStorySlide(0);
}

function closeStory() {
  clearTimeout(storyTimer);
  const video = document.getElementById("final-video");
  if (video) video.pause();
  resumeMusicAfterVideo();
  storyViewer.classList.remove("active");
  document.body.classList.remove("story-open");
}

storyCloseBtn.addEventListener("click", closeStory);
storyPrevZone.addEventListener("click", () => goToStorySlide(storyIndex - 1));
storyNextZone.addEventListener("click", () => goToStorySlide(storyIndex + 1));
storyStage.addEventListener("click", (e) => {
  if (e.target && e.target.id === "story-finish") closeStory();
});
document.addEventListener("keydown", (e) => {
  if (!storyViewer.classList.contains("active")) return;
  if (e.key === "Escape") closeStory();
  if (e.key === "ArrowRight") goToStorySlide(storyIndex + 1);
  if (e.key === "ArrowLeft") goToStorySlide(storyIndex - 1);
});

/* ============ LIGHTBOX (tap a gallery photo to view it full-fit) ============ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("active");
  document.body.classList.add("story-open"); // reuse the no-scroll body class
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.classList.remove("story-open");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox(); // tapping the backdrop closes it too
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
});
