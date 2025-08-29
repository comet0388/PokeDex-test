let model, webcamStream;
const video = document.getElementById("camera");
const captureBtn = document.getElementById("capture");
const resultDiv = document.getElementById("result");
const snapshotCanvas = document.createElement("canvas");
const snapshotImg = document.createElement("img");
document.body.appendChild(snapshotImg);

async function init() {
  try {
    // Load your model
    model = await tmImage.load("./model/model.json", "./model/metadata.json");
    
    // Try accessing the back camera
    const constraints = {
      video: {
        facingMode: { ideal: "environment" }, // Prefer back camera
        width: 320,
        height: 240
      },
      audio: false
    };

    webcamStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = webcamStream;
    video.play();
  } catch (error) {
    console.error("Error accessing camera:", error);
    resultDiv.textContent = "Camera access failed. Check permissions.";
  }
}

captureBtn.addEventListener("click", async () => {
  snapshotCanvas.width = video.videoWidth;
  snapshotCanvas.height = video.videoHeight;
  snapshotCanvas.getContext("2d").drawImage(video, 0, 0);
  
  // Show the captured frame
  snapshotImg.src = snapshotCanvas.toDataURL("image/png");
  snapshotImg.style.width = "300px";
  snapshotImg.style.marginTop = "20px";

  // Predict
  const prediction = await model.predict(snapshotCanvas);
  const best = prediction.reduce((prev, current) =>
    prev.probability > current.probability ? prev : current
  );
  resultDiv.textContent = `Predicted Pokémon: ${best.className} (${(best.probability * 100).toFixed(2)}%)`;
});

init();
