// function requestMotionSensors() {
//   let motionPromise = Promise.resolve();
//   let orientationPromise = Promise.resolve();

//   if (
//     typeof DeviceMotionEvent !== "undefined" &&
//     typeof DeviceMotionEvent.requestPermission === "function"
//   ) {
//     motionPromise = DeviceMotionEvent.requestPermission();
//   }
//   if (
//     typeof DeviceOrientationEvent !== "undefined" &&
//     typeof DeviceOrientationEvent.requestPermission === "function"
//   ) {
//     orientationPromise = DeviceOrientationEvent.requestPermission();
//   }

//   return Promise.all([motionPromise, orientationPromise])
//     .then(([motionPermission, orientationPermission]) => {
//       if (
//         motionPermission === "granted" ||
//         orientationPermission === "granted"
//       ) {
//         console.log("Motion and Orientation sensors granted.");
//         return true;
//       } else {
//         console.warn("Motion or Orientation sensor access denied.");
//         return false;
//       }
//     })
//     .catch(console.error);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const playButton = document.getElementById("intro-play-btn");

//   playButton.addEventListener("click", () => {
//     requestMotionSensors().then((granted) => {
//       if (granted) {
//         const script = document.createElement("script");
//         script.src = "https://aframe.io/releases/1.4.0/aframe.min.js";
//         script.onload = () => {
//           console.log("A-Frame loaded after permissions granted.");
//           initializeTour();
//         };
//         document.head.appendChild(script);
//       } else {
//         alert("Motion sensor permission is required to view the virtual tour.");
//       }
//     });
//   });
// });

// function initializeTour() {
//   const playButton = document.getElementById("intro-play-btn");
//   const scene = document.getElementById("scene");
//   playButton.style.display = "none";
//   scene.style.visibility = "visible";

//   // All your existing JavaScript code for video, controls, buttons, and scenes goes here.
//   // ...
//   console.log("Virtual tour initialized.");
// }
