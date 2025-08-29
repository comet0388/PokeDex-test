let model, webcamStream;
const URL = "./model/"; // Path to your Teachable Machine model folder

const video = document.getElementById("camera");
const capturedImg = document.getElementById("captured");
const captureButton = document.getElementById("capture");
const retakeButton = document.getElementById("retake");
const resultDiv = document.getElementById("result");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

async function init() {
  try {
    // Load model
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");

    // Request back camera
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    });

    video.srcObject = webcamStream;
  } catch (error) {
    console.warn("Back camera not available, switching to default:", error);

    // Fallback to default camera
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = webcamStream;
  }
}

captureButton.addEventListener("click", async () => {
  if (!model) {
    resultDiv.innerText = "Model is still loading. Please wait...";
    return;
  }

  // Capture current frame
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Show captured image
  capturedImg.src = canvas.toDataURL("image/png");
  capturedImg.style.display = "block";
  video.style.display = "none";
  captureButton.style.display = "none";
  retakeButton.style.display = "inline-block";

  // Predict
  const prediction = await model.predict(canvas);
  const topPrediction = prediction.reduce((max, current) =>
    current.probability > max.probability ? current : max
  );

  resultDiv.innerText = `Predicted Pokémon: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(2)}%)`;
});

retakeButton.addEventListener("click", () => {
  // Switch back to live camera view
  capturedImg.style.display = "none";
  video.style.display = "block";
  captureButton.style.display = "inline-block";
  retakeButton.style.display = "none";
  resultDiv.innerText = "";
});

// Initialize camera and model
init();
