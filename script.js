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
  menu: document.getElementById("menubtn"),
  videoSphere: document.getElementById("main-video-sphere"),
  homebtn: document.getElementById("home"),
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
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/intro-test.mp4",
  [SCENES.OMM_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/OMM.mp4",
  [SCENES.ANATOMY_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/Anatomy.mp4",
  [SCENES.CLINICAL_LAB]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/CTAC.mp4",
  [SCENES.TRANSLATION_LAB]: "",
  [SCENES.CAFE]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/Student.mp4",
  [SCENES.STUDY]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/Classrooms.mp4",
  [SCENES.FITNESS]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/Fitness.mp4",
  [SCENES.ADMIN]:
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/Admissionnw.mp4",
};

// State variables
let lastPlayedVideo = null;
let introVideoPauseTime = 0;

// Get all video elements
const videoElements = Object.values(videoIdsMap).map((id) =>
  document.getElementById(id)
);
const introVideo = document.getElementById(videoIdsMap[SCENES.INTRO]);

// Initialize controls
elements.playPauseButton.style.display = "none";
elements.videoControls.style.display = "none";
elements.skipButton.style.display = "none";
elements.menu.classList.add("hidden");
elements.cursor.setAttribute("raycaster", "objects: none");

// Helper Functions
function getCurrentPlayingVideo() {
  return (
    videoElements.find((video) => !video.paused && video.readyState >= 3) ||
    lastPlayedVideo
  );
}

function updateTimeline() {
  const currentVideo = getCurrentPlayingVideo();
  if (currentVideo?.duration) {
    elements.videoTimeline.max = currentVideo.duration;
    elements.videoTimeline.value = currentVideo.currentTime;
  }
}

function showMenu() {
  elements.menu.setAttribute("visible", true);
  elements.menu.classList.remove("hidden");
  elements.cursor.setAttribute("raycaster", "objects: .clickable");
}

function showHomeButton() {
  elements.menu.classList.add("hidden");
  elements.homebtn.setAttribute("visible", true);
  elements.homebtn.classList.remove("hidden");
  elements.cursor.setAttribute("raycaster", "objects: .clickable");
}

// Video Control Functions
function togglePlayPause() {
  const currentVideo = getCurrentPlayingVideo();
  if (!currentVideo) return;

  if (currentVideo.paused) {
    currentVideo.muted = false;
    currentVideo
      .play()
      .then(() => {
        elements.playPauseButton.textContent = "II";
        lastPlayedVideo = currentVideo;
      })
      .catch((error) => console.error("Playback failed:", error));
  } else {
    currentVideo.pause();
    elements.playPauseButton.textContent = "▶";
  }
}

function switchVideo(key, videoId) {
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

  elements.menu.setAttribute("visible", false);
  elements.menu.classList.add("hidden");
  elements.homebtn.setAttribute("visible", false);
  elements.homebtn.classList.add("hidden");
  elements.cursor.setAttribute("raycaster", "objects: none");

  if (videoId === videoIdsMap[SCENES.INTRO]) {
    elements.homebtn.setAttribute("visible", false);
    elements.homebtn.classList.add("hidden");
  }
}

// Event Listeners Setup
function setupVideoListeners(video) {
  video.addEventListener("play", () => {
    lastPlayedVideo = video;
    elements.playPauseButton.style.display = "flex";
    elements.playPauseButton.textContent = "II";
    elements.videoControls.style.display = "flex";
  });

  video.addEventListener("pause", () => {
    elements.playPauseButton.textContent = "▶";
  });

  video.addEventListener("ended", () => {
    elements.playPauseButton.style.display = "none";
    elements.videoControls.style.display = "none";

    if (video.id === videoIdsMap[SCENES.INTRO]) {
      showMenu();
    } else {
      showHomeButton();
    }
  });

  video.addEventListener("timeupdate", updateTimeline);

  // Error handling
  video.addEventListener("waiting", () =>
    console.warn(`Buffering: ${video.id}`)
  );
  video.addEventListener("stalled", () => {
    console.warn(`Stalled: ${video.id}`);
    video.play().catch((e) => console.error("Playback Error:", e));
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

  // Intro video setup
  introVideo.load();
  introVideo.pause();
  introVideo.currentTime = 0;
  introVideo.muted = true;

  // Button click handlers
  elements.playPauseButton.addEventListener("click", togglePlayPause);

  elements.videoTimeline.addEventListener("change", () => {
    const currentVideo = getCurrentPlayingVideo();
    if (currentVideo) {
      currentVideo.currentTime = elements.videoTimeline.value;
    }
  });

  // Setup intro play button
  const introPlayButton = document.getElementById(
    playButtonIdsMap[SCENES.INTRO]
  );
  introPlayButton.addEventListener("click", () => {
    introPlayButton.style.display = "none";
    elements.scene.style.visibility = "visible";
    elements.skipButton.style.display = "block";

    introVideo.src = videoUrlsMap[SCENES.INTRO];
    introVideo.muted = false;
    introVideo
      .play()
      .then(() => console.log("Intro video started."))
      .catch((error) => console.error("Playback Error:", error));
  });

  // Setup skip button
  elements.skipButton.addEventListener("click", () => {
    if (introVideo.readyState >= 3) {
      introVideo.currentTime = introVideo.duration - 2;
      introVideo.play();
      elements.skipButton.style.display = "none";
    }
  });

  // Setup home button
  elements.homebtn.addEventListener("click", () => {
    introVideo.pause();
    introVideo.load();
    elements.videoSphere.setAttribute("src", `#${videoIdsMap[SCENES.INTRO]}`);
    // Reset video elements except intro video
    videoElements
      .filter((video) => video !== introVideo)
      .forEach((video) => {
        video.src = "";
        video.load();
      });

    function seekAndPauseIntro() {
      if (!isNaN(introVideo.duration) && introVideo.duration > 4) {
        introVideo.currentTime = introVideo.duration - 4;
        introVideo.pause();
      }
    }

    if (introVideo.readyState >= 2) {
      seekAndPauseIntro();
    } else {
      introVideo.addEventListener("loadedmetadata", seekAndPauseIntro, {
        once: true,
      });
    }

    elements.homebtn.setAttribute("visible", false);
    elements.homebtn.classList.add("hidden");
    elements.homebtn.style.display = "none";
    showMenu();
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

  // Mobile touch handler
  document.body.addEventListener(
    "touchstart",
    () => {
      if (introVideo.paused) {
        introVideo
          .play()
          .catch((e) => console.error("iOS Touch Play Error:", e));
      }
    },
    { once: true }
  );

  // Show menu near end of intro video
  introVideo.addEventListener("timeupdate", () => {
    if (introVideo.duration - introVideo.currentTime <= 5) {
      showMenu();
    }
  });
});
