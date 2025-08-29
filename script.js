let model;
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');
const result = document.getElementById('result');
const captureBtn = document.getElementById('captureBtn');

// Start camera (back camera if available)
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Back camera not found, switching to front camera:", error);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  }
}

// Load model
async function loadModel() {
  try {
    model = await tf.loadLayersModel('/model/model.json');
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

// Capture image
captureBtn.addEventListener('click', async () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/png');
  capturedImage.src = dataUrl;
  capturedImage.style.display = 'block';

  result.innerText = "Processing...";

  // Preprocess image
  const imgTensor = tf.browser.fromPixels(canvas)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();

  // Predict
  if (model) {
    const prediction = await model.predict(imgTensor).data();
    const predictedIndex = prediction.indexOf(Math.max(...prediction));
    result.innerText = `Predicted Pokémon ID: ${predictedIndex}`;
  } else {
    result.innerText = "Model not loaded!";
  }
});

// Initialize
window.onload = async () => {
  await startCamera();
  await loadModel();
};
