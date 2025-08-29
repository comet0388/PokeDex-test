let model, webcamStream, capturedImage;

async function init() {
  const video = document.getElementById("camera");
  try {
    // Access back camera
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    });
    video.srcObject = webcamStream;
  } catch (error) {
    console.error("Camera access error:", error);
    document.getElementById("result").innerText = "Camera access denied or unavailable.";
  }

  // Load the model
  try {
    model = await tmImage.load("my_model/model.json", "my_model/metadata.json");
    console.log("Model loaded successfully!");
  } catch (error) {
    console.error("Error loading model:", error);
    document.getElementById("result").innerText = "Failed to load model. Check path.";
  }
}

document.getElementById("capture").addEventListener("click", async () => {
  if (!model) {
    document.getElementById("result").innerText = "Model not loaded yet!";
    return;
  }

  const video = document.getElementById("camera");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  capturedImage = new Image();
  capturedImage.src = canvas.toDataURL("image/png");

  document.getElementById("result").innerText = "Image captured! Processing...";

  // Predict
  capturedImage.onload = async () => {
    const prediction = await model.predict(capturedImage);
    let highest = prediction[0];
    for (let p of prediction) {
      if (p.probability > highest.probability) highest = p;
    }
    document.getElementById("result").innerText = `Prediction: ${highest.className} (${(highest.probability * 100).toFixed(2)}%)`;
  };
});

init();
