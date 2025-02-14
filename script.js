const playButton = document.getElementById("play-button");
const scene = document.getElementById("scene");
const introVideo = document.getElementById("intro-video");
const secVideo = document.getElementById("scene-two-video");
const thirdVideo = document.getElementById("scene-three-video");
const fourthVideo = document.getElementById("scene-four-video");
const fifthVideo = document.getElementById("scene-five-video");
const sixthVideo = document.getElementById("scene-six-video");
const sevVideo = document.getElementById("scene-seven-video");
const eigVideo = document.getElementById("scene-eight-video");
const nineVideo = document.getElementById("scene-nine-video");
const menu = document.getElementById("menubtn");
const videoSky = document.getElementById("video-sky");
const homebtn = document.getElementById("home");
const cursor = document.querySelector("a-cursor");
const skipButton = document.getElementById("skip-button");
const playPauseButton = document.getElementById("play-pause-button");
const videoTimeline = document.getElementById("video-timeline");
const videoControls = document.getElementById("video-controls");

const allVideos = [
  introVideo,
  secVideo,
  thirdVideo,
  fourthVideo,
  fifthVideo,
  sixthVideo,
  sevVideo,
  eigVideo,
  nineVideo,
];

// Step 1: Completely remove the video source on page load
document.addEventListener("DOMContentLoaded", () => {
  introVideo.removeAttribute("src"); // Remove src
  introVideo.load(); // Force browser to clear any preloaded content
  console.log("Intro video source removed to block autoplay.");
});

// Hide controls initially
playPauseButton.style.display = "none";
videoControls.style.display = "none";

let lastPlayedVideo = null; // Track the last played video

// Function to get the currently playing video
function getCurrentPlayingVideo() {
  return (
    allVideos.find((video) => !video.paused && video.readyState >= 3) ||
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
allVideos.forEach((video) => {
  video.addEventListener("play", () => {
    lastPlayedVideo = video; // Track the currently playing video
    playPauseButton.style.display = "flex"; // Show play/pause button
    playPauseButton.textContent = "II"; // Set to pause
  });

  video.addEventListener("pause", () => {
    playPauseButton.style.display = "flex"; // Keep visible even when paused
    playPauseButton.textContent = "▶"; // Set to play
  });

  video.addEventListener("ended", () => {
    playPauseButton.style.display = "none"; // Hide button when video ends
  });
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

// Show timeline when a video starts playing
allVideos.forEach((video) => {
  video.addEventListener("play", () => {
    videoControls.style.display = "flex"; // Show timeline
  });

  video.addEventListener("timeupdate", updateTimeline);

  video.addEventListener("pause", () => {
    videoControls.style.display = "flex"; // Keep timeline visible
  });

  video.addEventListener("ended", () => {
    videoControls.style.display = "none"; // Hide timeline when video ends
  });
});

// Ensure video does not autoplay on page load
introVideo.pause();
introVideo.currentTime = 0;
introVideo.muted = true; // Keep muted until user interaction

document.addEventListener("DOMContentLoaded", () => {
  const introVideo = document.getElementById("intro-video");
  const hlsUrl =
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/intro-test.mp4/playlist.m3u8";

  //Stop browser from preloading or playing video
  introVideo.pause();
  introVideo.currentTime = 0; // Ensure it starts at 0
  introVideo.removeAttribute("src"); // Prevents auto-loading
  menu.classList.add("hidden"); // Hide menu initially

  playButton.addEventListener("click", () => {
    playButton.style.display = "none"; // Hide Start Experience button
    scene.style.visibility = "visible"; // Show A-Frame scene
    skipButton.style.display = "block"; // Show Skip button

    // 🚀 Load HLS ONLY when the user clicks "Start Experience"
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(introVideo);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded, ready to play intro video.");
        introVideo.muted = false; // Ensure it's not muted
        introVideo.play().catch((e) => console.error("Playback Error:", e));
      });
    } else if (introVideo.canPlayType("application/vnd.apple.mpegurl")) {
      introVideo.src = hlsUrl;
      introVideo.muted = false;
      introVideo.play().catch((e) => console.error("Playback Error:", e));
    } else {
      console.error("HLS not supported on this browser.");
    }
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
});

//  Disable cursor interactions at the start
cursor.setAttribute("raycaster", "objects: none");

// Play Experience Button Click Event
// Step 2: Only load video when user clicks "Start Experience"
playButton.addEventListener("click", () => {
  playButton.style.display = "none"; // Hide Start Experience button
  scene.style.visibility = "visible"; // Show A-Frame scene
  skipButton.style.display = "block"; // Show Skip button

  // Attach video source dynamically only when button is clicked
  const videoUrl =
    "https://m2qall8jajdg-hls-push.5centscdn.com/mp4/comp/intro-test.mp4";

  introVideo.src = videoUrl;
  introVideo.muted = false; // Ensure sound is ON
  introVideo.currentTime = 0; // Start from beginning
  introVideo.pause(); // Ensure video is paused until explicitly played
  console.log("Intro video loaded but still paused.");

  // Set video to A-Frame videosphere
  const videoSphere = document.getElementById("video-sky");
  videoSphere.setAttribute("src", "#intro-video");

  // Explicitly start video
  introVideo
    .play()
    .then(() => {
      console.log("Intro video started with sound.");
    })
    .catch((error) => {
      console.error("Playback Error:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("play-button");
  const skipButton = document.getElementById("skip-button");

  // Initially hide Skip Intro button
  skipButton.style.display = "none";

  // Show Skip Intro button only when Start Experience is clicked
  playButton.addEventListener("click", () => {
    playButton.style.display = "none"; // Hide Start Experience button
    skipButton.style.display = "block"; // Show Skip Intro button
  });

  // Skip Intro functionality
  skipButton.addEventListener("click", () => {
    const introVideo = document.getElementById("intro-video");

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
});

//  Store last timestamp for `intro-video`
let introVideoPauseTime = 0;

// Handle Video End Logic
function handleVideoEnd(video) {
  video.addEventListener("ended", () => {
    if (video.id === "intro-video") {
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
}

// Attach event listener to each video
allVideos.forEach(handleVideoEnd);

//  Function to Switch Videos
function switchVideo(videoId) {
  allVideos.forEach((vid) => vid.pause());
  skipButton.style.display = "none";

  videoSky.setAttribute("src", `#${videoId}`);
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
  if (videoId === "intro-video") {
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
  videoSky.setAttribute("src", "#intro-video");

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

// Click Events for Switching Videos
document
  .getElementById("ommlab")
  .addEventListener("click", () => switchVideo("scene-two-video"));
document
  .getElementById("anatomy")
  .addEventListener("click", () => switchVideo("scene-three-video"));
document
  .getElementById("clinical")
  .addEventListener("click", () => switchVideo("scene-four-video"));
document
  .getElementById("translation")
  .addEventListener("click", () => switchVideo("scene-five-video"));
document
  .getElementById("cafe")
  .addEventListener("click", () => switchVideo("scene-six-video"));
document
  .getElementById("study")
  .addEventListener("click", () => switchVideo("scene-seven-video"));
document
  .getElementById("fitness")
  .addEventListener("click", () => switchVideo("scene-eight-video"));
document
  .getElementById("admin")
  .addEventListener("click", () => switchVideo("scene-nine-video"));

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

// Function to enhance video performance on Android
document.addEventListener("DOMContentLoaded", () => {
  const allVideos = document.querySelectorAll("video");

  // Apply best practices for mobile streaming
  allVideos.forEach((video) => {
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

  // Ensure videos only start after user interaction
  const playButton = document.getElementById("play-button");
  playButton.addEventListener("click", () => {
    playButton.style.display = "none";

    // Play the intro video (ensuring unmuted)
    const introVideo = document.getElementById("intro-video");
    introVideo.muted = false;
    introVideo.play().catch((e) => console.error("Playback Error:", e));

    console.log("Experience started, playing intro video.");
  });
});

// Ensure playsinline & autoplay permissions
introVideo.setAttribute("playsinline", "true");
introVideo.setAttribute("muted", "true");

// Step 1: Allow playback after user interaction
playButton.addEventListener("click", () => {
  playButton.classList.add("hidden"); // Hide button

  introVideo.muted = false; // Unmute (required after click)
  introVideo
    .play()
    .then(() => {
      console.log("Video playing successfully.");
    })
    .catch((error) => {
      console.error("Playback Error:", error);
    });
});

// Step 2: iOS Touch Event Fallback
document.body.addEventListener(
  "touchstart",
  () => {
    introVideo.play().catch((e) => console.error("iOS Touch Play Error:", e));
  },
  { once: true }
);

// Step 3: Ensure the video is loaded before playing
introVideo.addEventListener("canplaythrough", () => {
  console.log("Video can play through, starting playback.");
  introVideo.play();
});

// Step 4: Debugging - Catch errors
introVideo.addEventListener("error", (e) => {
  console.error("Video error:", e);
});

document.addEventListener("DOMContentLoaded", () => {
  const introVideo = document.getElementById("intro-video");
  const playButton = document.getElementById("play-button");

  // Prevent autoplay before user clicks the button
  introVideo.pause();
  introVideo.currentTime = 0;
  introVideo.muted = true; // Keep muted until user interacts

  playButton.addEventListener("click", () => {
    playButton.style.display = "none"; // Hide button after clicking
    introVideo.muted = false; // Unmute video after interaction
    introVideo.removeAttribute("muted"); // Ensure browsers recognize change
    introVideo.currentTime = 0; // Restart from beginning

    introVideo
      .play()
      .then(() => {
        console.log("Intro video started.");
      })
      .catch((error) => {
        console.error("Playback Error:", error);
      });
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
