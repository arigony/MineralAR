(() => {
  let facingMode = "user";
  const original = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
  if (!original) return;

  navigator.mediaDevices.getUserMedia = constraints => {
    const next = structuredClone(constraints || {});
    if (next.video) {
      next.video = typeof next.video === "object" ? next.video : {};
      next.video.facingMode = { ideal: facingMode };
    }
    return original(next);
  };

  function updateLabel() {
    document.body.classList.toggle("front-camera", facingMode === "user");
    document.body.classList.toggle("rear-camera", facingMode !== "user");
    const button = document.getElementById("cameraFlip");
    if (button) button.textContent = facingMode === "user" ? "Câmera: frontal" : "Câmera: traseira";
  }

  addEventListener("DOMContentLoaded", () => {
    updateLabel();
    document.getElementById("cameraFlip")?.addEventListener("click", () => {
      facingMode = facingMode === "user" ? "environment" : "user";
      updateLabel();
      dispatchEvent(new CustomEvent("mineralar-camera-change"));
    });
  });
})();
