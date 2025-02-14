
const AFRAME = {};
document.addEventListener("DOMContentLoaded", () => {
  
    const allowText = "Prince";
    const denyText = "Not Now";
    const dialogText = "Allow us to personalize your experience?";
    const onAllowClicked = () => {
      console.log("User clicked Allow, starting experience.");
    };
    const onDenyClicked = () => {
      console.log("User clicked Deny, experience will be limited.");
    };
  
    const devicePermissionDialogEl =  AFRAME.createPermissionDialog (
      denyText, allowText, dialogText, onAllowClicked, onDenyClicked)
  
    // Append the dialog to the A-Frame scene
    document.querySelector("a-scene").appendChild(devicePermissionDialogEl);
      
      console.log("============", AFRAME);

});