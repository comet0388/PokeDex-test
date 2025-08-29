// Teachable Machine Model URL (replace with your model link)
const MODEL_URL = "./model/"; // should contain model.json and metadata.json

let model, webcamStream;

window.addEventListener('DOMContentLoaded', init);

async function init() {
  const video = document.getElementById('camera');
  const captureBtn = document.getElementById('capture');
  const resultDiv = document.getElementById('result');

  try {
    // Start webcam
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = webcamStream;
    video.play();
    console.log("Camera started.");
  } catch (err) {
    console.error("Camera access denied:", err);
    alert("Camera access is required for predictions!");
    return;
  }

  try {
    // Load the model
    model = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
    console.log("Model loaded successfully.");
  } catch (err) {
    console.error("Failed to load model:", err);
    alert("Could not load model. Check path and files.");
    return;
  }

  // Capture button logic
  captureBtn.addEventListener('click', async () => {
    const prediction = await predict(video);
    resultDiv.innerText = prediction;
  });
}

// Prediction function
async function predict(videoElement) {
  if (!model) return "Model not loaded.";

  const predictions = await model.predict(videoElement);
  let bestPrediction = predictions[0];

  // Find highest probability class
  for (let p of predictions) {
    if (p.probability > bestPrediction.probability) {
      bestPrediction = p;
    }
  }

  return `Prediction: ${bestPrediction.className} (${(bestPrediction.probability * 100).toFixed(2)}%)`;
}
