// Video Scene Keys
const SCENES = {
  INTRO: "intro",
  OMM_LAB: "ommLab",
  ANATOMY_LAB: "anatomyLab",
  CLINICAL_LAB: "clinicalLab",
  TRANSLATION_LAB: "translationLab",
  CAFE: "cafe",
  STUDY: "study",
  FITNESS: "fitness",
  ADMIN: "admin",
};

// DOM Elements
const elements = {
  scene: document.getElementById("scene"),
  menuOptions: document.getElementById("menubtn"),
  videoSphere: document.getElementById("main-video-sphere"),
  backToHomeBtn: document.getElementById("home"),
  cursor: document.querySelector("a-cursor"),
  skipButton: document.getElementById("skip-button"),
  playPauseButton: document.getElementById("play-pause-button"),
  videoTimeline: document.getElementById("video-timeline"),
  videoControls: document.getElementById("video-controls"),
};

// Video and Button Mappings
const playButtonIdsMap = {
  [SCENES.INTRO]: "intro-play-btn",
  [SCENES.OMM_LAB]: "ommLab-btn",
  [SCENES.ANATOMY_LAB]: "anatomyLab-btn",
  [SCENES.CLINICAL_LAB]: "clinicalLab-btn",
  [SCENES.TRANSLATION_LAB]: "translationLab-btn",
  [SCENES.CAFE]: "cafe-btn",
  [SCENES.STUDY]: "study-btn",
  [SCENES.FITNESS]: "fitness-btn",
  [SCENES.ADMIN]: "admin-btn",
};

const videoIdsMap = {
  [SCENES.INTRO]: "intro-video",
  [SCENES.OMM_LAB]: "scene-two-video",
  [SCENES.ANATOMY_LAB]: "scene-three-video",
  [SCENES.CLINICAL_LAB]: "scene-four-video",
  [SCENES.TRANSLATION_LAB]: "scene-five-video",
  [SCENES.CAFE]: "scene-six-video",
  [SCENES.STUDY]: "scene-seven-video",
  [SCENES.FITNESS]: "scene-eight-video",
  [SCENES.ADMIN]: "scene-nine-video",
};

const videoUrlsMap = {
  [SCENES.INTRO]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/HCOMVideos/intro_fn2.mp4",
  [SCENES.OMM_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/OMMFinal.mp4",
  [SCENES.ANATOMY_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/AnatomyFinal.mp4",
  [SCENES.CLINICAL_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/CTACFinal.mp4",
  [SCENES.TRANSLATION_LAB]: "http://m2qall8jajdg-hls-push.5centscdn.com/mp4/HCOMVideos/Credits_fn3.mp4",
  [SCENES.CAFE]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/StudentFinal.mp4",
  [SCENES.STUDY]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/ClassroomFinal.mp4",
  [SCENES.FITNESS]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/FitnessFinal.mp4",
  [SCENES.ADMIN]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/AdmissionFinal.mp4",
};

/**
 * @type {HTMLVideoElement}
 */
let currentVideo = null;
const introPlayButton = document.getElementById(playButtonIdsMap[SCENES.INTRO]);
let currentScene = null;

// Get all video elements
const videoElements = Object.values(videoIdsMap).map((id) =>
  document.getElementById(id)
);

function hideVideoControls() {
  elements.playPauseButton.style.display = "none";
  elements.videoControls.style.display = "none";
  elements.skipButton.style.display = "none";
}

// Initialize controls
hideVideoControls();
elements.menuOptions.setAttribute("visible", false);
elements.backToHomeBtn.setAttribute("visible", false);
elements.cursor.setAttribute("raycaster", "objects: none");

function showMenuOptions() {
  elements.menuOptions.setAttribute("visible", true);
  elements.cursor.setAttribute("raycaster", "objects: .clickable");
}

function showBackToHomeButton() {
  elements.backToHomeBtn.setAttribute("visible", true);
  elements.cursor.setAttribute("raycaster", "objects: .clickable");
}

// Video Control Functions
function togglePlayPause() {
  if (!currentVideo) return;

  if (currentVideo.paused) {
    currentVideo.muted = false;
    currentVideo.play()
      .then(() => {
        elements.playPauseButton.textContent = "II";
      })
      .catch((error) => console.error("Playback failed:", error));
  } else {
    currentVideo.pause();
    elements.playPauseButton.textContent = "▶";

    // Ensure no unintended event triggers playback
    currentVideo.onpause = null;
    currentVideo.onended = null;

    // Explicitly prevent auto-resume by removing stalled auto-playback
    currentVideo.dataset.manualPause = "true"; // Flag manual pause
  }
}

function skipToAlmostEnd() {
  if (currentVideo && currentVideo.readyState >= 3) {
    currentVideo.currentTime = currentVideo.duration - 2;
    currentVideo.play();
    elements.skipButton.style.display = "none";
  // Delay showing the menu button by 1.5 seconds
        setTimeout(() => {
            showMenuOptions();
        }, 1500);
    }
}

function skipToEnd() {
  if (currentVideo) {
    currentVideo.currentTime = currentVideo.duration;
  }
}

function switchVideo(key, videoId) {
  if (currentScene === key) return;
  currentScene = key;
  videoElements.forEach((vid) => vid.pause());

  elements.videoSphere.setAttribute("src", `#${videoId}`);
  const newVideo = document.getElementById(videoId);
  newVideo.currentTime = 0;
  newVideo.muted = false;
  // load video source if not already loaded
  if (!newVideo.src) {
    newVideo.src = videoUrlsMap[key];
  }
  newVideo.play().catch((e) => console.error(e));
  currentVideo = newVideo;

  elements.menuOptions.setAttribute("visible", false);
  elements.backToHomeBtn.setAttribute("visible", false);
  elements.cursor.setAttribute("raycaster", "objects: none");

  if (videoId === videoIdsMap[SCENES.INTRO]) {
    elements.skipButton.style.display = "block";
    introPlayButton.style.display = "none";
  } else {
    // hide skip button
    elements.skipButton.style.display = "none";
  }
}

// Event Listeners Setup
function setupVideoListeners(video) {
  video.addEventListener("play", () => {
    currentVideo.dataset.manualPause = "false"; // Reset pause flag
    lastPlayedVideo = video;
    elements.playPauseButton.style.display = "flex";
    elements.playPauseButton.textContent = "II";
    elements.videoControls.style.display = "flex";
    if (currentVideo && currentVideo.id === videoIdsMap[SCENES.INTRO]) {
      elements.skipButton.style.display = "block";
    }
  });

  video.addEventListener("pause", () => {
    elements.playPauseButton.textContent = "▶";
  });

  video.addEventListener("ended", () => {
    elements.playPauseButton.style.display = "none";
    elements.videoControls.style.display = "none";
    elements.skipButton.style.display = "none";

    if (video.id === videoIdsMap[SCENES.INTRO]) {
      showMenuOptions();
    } else {
      showBackToHomeButton();
    }
  });

  video.addEventListener("timeupdate", () => {
    if (currentVideo?.duration) {
      elements.videoTimeline.max = currentVideo.duration;
      elements.videoTimeline.value = currentVideo.currentTime;
    }
  });

  // Error handling
  video.addEventListener("waiting", () =>
    console.warn(`Buffering: ${video.id}`)
  );
  video.addEventListener("stalled", () => {
  console.warn(`Stalled: ${video.id}`);

  // Resume only if video was NOT manually paused
  if (!video.paused && currentVideo.dataset.manualPause !== "true") {
    video.play().catch((e) => console.error("Playback Error:", e));
  }
});

  video.addEventListener("error", (e) =>
    console.error(`Error: ${video.id}`, e)
  );
}

// Initialize video settings
function initializeVideo(video) {
  video.setAttribute("preload", "auto");
  video.setAttribute("playsinline", "true");
  video.setAttribute("muted", "true");
  video.setAttribute("autoplay", "false");
  video.setAttribute("controls", "false");
  video.setAttribute("loop", "false");
}

// DOMContentLoaded setup
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all videos
  videoElements.forEach((video) => {
    initializeVideo(video);
    setupVideoListeners(video);
  });

  // Button click handlers
  elements.playPauseButton.addEventListener("click", togglePlayPause);

  elements.videoTimeline.addEventListener("change", () => {
    if (currentVideo) {
      currentVideo.currentTime = elements.videoTimeline.value;
    }
  });

  // Setup skip button
  elements.skipButton.addEventListener("click", skipToAlmostEnd);

  // Setup home button
  elements.backToHomeBtn.addEventListener("click", () => {
    switchVideo(SCENES.INTRO, videoIdsMap[SCENES.INTRO]);
    skipToEnd();
    hideVideoControls();
    showMenuOptions();
  });

  // Setup video buttons
  Object.entries(videoIdsMap).forEach(([key, videoId]) => {
    const buttonId = playButtonIdsMap[key];
    const button = document.getElementById(buttonId);
    button?.addEventListener("click", () => switchVideo(key, videoId));
  });

  // Setup button hover effects
  document.querySelectorAll(".clickable").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.setAttribute("scale", "1.1 1.1 1");
      button.setAttribute("material", "color: #FFFF00");
    });

    button.addEventListener("mouseleave", () => {
      button.setAttribute("scale", "1 1 1");
      button.setAttribute("material", "color: #FFFFFF");
    });
  });
});
