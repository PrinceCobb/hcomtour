const scene = document.getElementById("scene");

const menu = document.getElementById("menubtn");
const videoSphere = document.getElementById("main-video-sphere");
const homebtn = document.getElementById("home");
const cursor = document.querySelector("a-cursor");
const skipButton = document.getElementById("skip-button");
const playPauseButton = document.getElementById("play-pause-button");
const videoTimeline = document.getElementById("video-timeline");
const videoControls = document.getElementById("video-controls");

const playButtonIdsMap = {
  intro: "intro-play-btn",
  ommLab: "ommLab-btn",
  anatomyLab: "anatomyLab-btn",
  clinicalLab: "clinicalLab-btn",
  translationLab: "translationLab-btn",
  cafe: "cafe-btn",
  study: "study-btn",
  fitness: "fitness-btn",
  admin: "admin-btn",
};
const videoIdsMap = {
  intro: "intro-video",
  ommLab: "scene-two-video",
  anatomyLab: "scene-three-video",
  clinicalLab: "scene-four-video",
  translationLab: "scene-five-video",
  cafe: "scene-six-video",
  study: "scene-seven-video",
  fitness: "scene-eight-video",
  admin: "scene-nine-video",
};
const videoUrlsMap = {
  intro: "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/intro-test.mp4"
};

const videoKeys = Object.keys(videoIdsMap);
const videoIds = Object.values(videoIdsMap);

const videoElements = Object.values(videoIdsMap).map((id) =>
  document.getElementById(id)
);

const introVideo = document.getElementById(videoIdsMap.intro);
const introPlayButton = document.getElementById(playButtonIdsMap.intro);

// Hide controls initially
playPauseButton.style.display = "none";
videoControls.style.display = "none";

let lastPlayedVideo = null; // Track the last played video

// Function to get the currently playing video
function getCurrentPlayingVideo() {
  return (
    videoElements.find((video) => !video.paused && video.readyState >= 3) ||
    lastPlayedVideo
  );
}

// Play/Pause Button Click Event
playPauseButton.addEventListener("click", () => {
  const currentVideo = getCurrentPlayingVideo();

  if (currentVideo) {
    if (currentVideo.paused) {
      currentVideo.muted = false; // Ensure it's unmuted before playing
      currentVideo
        .play()
        .then(() => {
          playPauseButton.textContent = "II"; // Show Pause symbol
          lastPlayedVideo = currentVideo; // Store last played video
        })
        .catch((error) => {
          console.error("Playback failed:", error);
        });
    } else {
      currentVideo.pause();
      playPauseButton.textContent = "▶"; // Show Play symbol
    }
  } else {
    console.warn("No video is currently playing.");
  }
});

// Ensure the play/pause button only appears when a video starts playing
videoElements.forEach((video) => {
  video.addEventListener("play", () => {
    lastPlayedVideo = video; // Track the currently playing video
    playPauseButton.style.display = "flex"; // Show play/pause button
    playPauseButton.textContent = "II"; // Set to pause
    videoControls.style.display = "flex"; // Show timeline
  });

  video.addEventListener("pause", () => {
    playPauseButton.style.display = "flex"; // Keep visible even when paused
    playPauseButton.textContent = "▶"; // Set to play
    videoControls.style.display = "flex"; // Keep timeline visible
  });

  video.addEventListener("ended", () => {
    playPauseButton.style.display = "none"; // Hide button when video ends
    videoControls.style.display = "none"; // Hide timeline when video ends

    if (video.id === videoIdsMap.intro) {
      menu.setAttribute("visible", true);
      menu.classList.remove("hidden");
      cursor.setAttribute("raycaster", "objects: .clickable");
    } else {
      menu.classList.add("hidden");
      homebtn.setAttribute("visible", true);
      homebtn.classList.remove("hidden");
      cursor.setAttribute("raycaster", "objects: .clickable");
    }
  });

  video.addEventListener("timeupdate", updateTimeline);
});

// Function to update the timeline as video plays
function updateTimeline() {
  const currentVideo = getCurrentPlayingVideo();
  if (currentVideo && currentVideo.duration) {
    videoTimeline.max = currentVideo.duration;
    videoTimeline.value = currentVideo.currentTime;
  }
}

// Function to seek video when user interacts with timeline
videoTimeline.addEventListener("change", () => {
  const currentVideo = getCurrentPlayingVideo();
  if (currentVideo) {
    currentVideo.currentTime = videoTimeline.value;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hlsUrl =
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/intro-test.mp4/playlist.m3u8";

  //Stop browser from preloading or playing video
  introVideo.load(); // Force browser to clear any preloaded content
  introVideo.pause();
  introVideo.currentTime = 0;
  introVideo.muted = true; // Keep muted until user interaction
  skipButton.style.display = "none"; // Initially hide Skip Intro button

  introVideo.currentTime = 0; // Ensure it starts at 0
  introVideo.removeAttribute("src"); // Prevents auto-loading
  menu.classList.add("hidden"); // Hide menu initially

  introPlayButton.addEventListener("click", () => {
    introPlayButton.style.display = "none"; // Hide Start Experience button
    scene.style.visibility = "visible"; // Show A-Frame scene
    skipButton.style.display = "block"; // Show Skip button

    introVideo.src = videoUrlsMap.intro;
    introVideo.muted = false; // Ensure it's not muted
    introVideo
      .play()
      .then(() => {
        console.log("Intro video started.");
      })
      .catch((error) => {
        console.error("Playback Error:", error);
      });

    // // 🚀 Load HLS ONLY when the user clicks "Start Experience"
    // if (Hls.isSupported()) {
    //   const hls = new Hls();
    //   hls.loadSource(hlsUrl);
    //   hls.attachMedia(introVideo);
    //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //     console.log("HLS manifest loaded, ready to play intro video.");
    //     introVideo.muted = false; // Ensure it's not muted
    //     introVideo.play().catch((e) => console.error("Playback Error:", e));
    //   });
    //   console.log("Experience started, playing intro video.");
    // } else if (introVideo.canPlayType("application/vnd.apple.mpegurl")) {
    //   introVideo.src = hlsUrl;
    //   introVideo.muted = false;
    //   introVideo.play().catch((e) => console.error("Playback Error:", e));
    //   console.log("Experience started, playing intro video.");
    // } else {
    //   console.error("HLS not supported on this browser.");
    // }
  });

  // 🚀 Show Menu 5 Seconds Before the Intro Video Ends
  introVideo.addEventListener("timeupdate", () => {
    if (introVideo.duration - introVideo.currentTime <= 5) {
      menu.setAttribute("visible", true);
      menu.classList.remove("hidden");

      // Enable cursor interactions for menu
      cursor.setAttribute("raycaster", "objects: .clickable");

      console.log("Menu displayed 5 seconds before the intro video ends.");
    }
  });

  skipButton.addEventListener("click", () => {
    if (introVideo.readyState >= 3) {
      introVideo.currentTime = introVideo.duration - 2;
      introVideo.play();
      console.log("Intro skipped.");
    } else {
      console.error("Intro video is not ready.");
    }

    // Hide Skip Intro button after skipping
    skipButton.style.display = "none";
  });

  // Apply best practices for mobile streaming
  videoElements.forEach((video) => {
    video.setAttribute("preload", "auto"); // Preload improves playback
    video.setAttribute("playsinline", "true");
    video.setAttribute("muted", "true"); // Required for autoplay on mobile
    video.setAttribute("autoplay", "false"); // Start manually after interaction
    video.setAttribute("controls", "false");
    video.setAttribute("loop", "false");

    // Event listeners to recover from buffering issues
    video.addEventListener("waiting", () => {
      console.warn(`Buffering detected in ${video.id}, attempting recovery...`);
    });

    video.addEventListener("stalled", () => {
      console.warn(`Network stalled for ${video.id}, retrying...`);
      video.play().catch((e) => console.error("Playback Error:", e));
    });

    video.addEventListener("error", (e) => {
      console.error(`Error loading video: ${video.id}`, e);
    });
  });

  // Click Events for Switching Videos
  videoKeys.forEach((videoKey) => {
    const buttonId = playButtonIdsMap[videoKey];
    const videoId = videoIdsMap[videoKey];
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => switchVideo(videoId));
  });

  // Handle iOS autoplay issues by ensuring a user interaction
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
  ); // Runs only once
});

//  Disable cursor interactions at the start
cursor.setAttribute("raycaster", "objects: none");

//  Store last timestamp for `intro-video`
let introVideoPauseTime = 0;

//  Function to Switch Videos
function switchVideo(videoId) {
  videoElements.forEach((vid) => vid.pause());

  videoSphere.setAttribute("src", `#${videoId}`);
  const newVideo = document.getElementById(videoId);
  newVideo.currentTime = 0;
  newVideo.muted = false;
  newVideo.play().catch((e) => console.error(e));

  //  Hide Menu & Home Button During Video Play
  menu.setAttribute("visible", false);
  menu.classList.add("hidden");

  homebtn.setAttribute("visible", false);
  homebtn.classList.add("hidden");

  //  Disable cursor interactions until the home button appears
  cursor.setAttribute("raycaster", "objects: none");

  //  Show Home Button Only When NOT Intro Video
  if (videoId === videoIdsMap.intro) {
    homebtn.setAttribute("visible", false);
    homebtn.classList.add("hidden");
  }
}

//  Home Button Click: Return to Intro Video & Show Menu
homebtn.addEventListener("click", () => {
  console.log("🏠 Home button clicked. Returning to Intro Video...");

  // Pause any playing videos and reset the scene to intro video
  introVideo.pause();
  introVideo.load();
  videoSphere.setAttribute("src", `#${videoIdsMap.intro}`);

  function seekAndPauseIntro() {
    if (!isNaN(introVideo.duration) && introVideo.duration > 4) {
      introVideo.currentTime = introVideo.duration - 4; // Seek to last 4 seconds
      introVideo.pause();
      console.log(
        `✅ Intro Video Paused at ${introVideo.currentTime.toFixed(2)}s`
      );
    } else {
      console.warn("⏳ Waiting for metadata...");
    }
  }

  if (introVideo.readyState >= 2) {
    seekAndPauseIntro();
  } else {
    introVideo.addEventListener("loadedmetadata", seekAndPauseIntro, {
      once: true,
    });
  }

  // 🔥 Hide the home button completely (Both A-Frame & CSS)
  homebtn.setAttribute("visible", false); // A-Frame method
  homebtn.classList.add("hidden"); // Hide using CSS
  homebtn.style.display = "none"; // Ensure it doesn’t show again

  // Show menu again
  menu.setAttribute("visible", true);
  menu.classList.remove("hidden");

  console.log(
    "🏠 Successfully switched back to the Intro Video, home button removed."
  );
});

//  Button Hover Effects
document.querySelectorAll(".clickable").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.setAttribute("scale", "1.1 1.1 1");
    button.setAttribute("material", "color: #FFFF00");
  });

  button.addEventListener("mouseleave", () => {
    button.setAttribute("scale", "1 1 1");
    button.setAttribute("material", "color: #FFFFFF");
  });

  button.addEventListener("click", () => {
    console.log(`${button.id} clicked!`);
  });
});
