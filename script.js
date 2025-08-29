const URL = "./model/"; // your model folder

let model, maxPredictions;
let webcamVideo;
let webcamCanvas, webcamContext;
let capturedCanvas, capturedContext;

// Start camera button handler
document.getElementById("start-btn").addEventListener("click", initCamera);

async function initCamera() {
    try {
        // Load the Teachable Machine model
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Create webcam video element
        webcamVideo = document.createElement("video");
        webcamVideo.width = 200;
        webcamVideo.height = 200;
        webcamVideo.autoplay = true;
        webcamVideo.playsInline = true;

        // Attach to DOM
        document.getElementById("webcam-container").appendChild(webcamVideo);

        // Request back camera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        webcamVideo.srcObject = stream;

        // Setup canvases
        webcamCanvas = document.createElement("canvas");
        webcamCanvas.width = 200;
        webcamCanvas.height = 200;
        webcamContext = webcamCanvas.getContext("2d");

        capturedCanvas = document.createElement("canvas");
        capturedCanvas.width = 200;
        capturedCanvas.height = 200;
        capturedContext = capturedCanvas.getContext("2d");
        document.getElementById("captured-container").appendChild(capturedCanvas);

        // Enable capture button
        const captureBtn = document.getElementById("capture-btn");
        captureBtn.disabled = false;
        captureBtn.addEventListener("click", captureAndPredict);

    } catch (err) {
        console.error("Error accessing camera or loading model:", err);
        alert("Could not access camera or load model. Check console.");
    }
}

// Capture current frame and predict
async function captureAndPredict() {
    // Draw current webcam frame to captured canvas
    capturedContext.drawImage(webcamVideo, 0, 0, 200, 200);

    // Predict using captured image
    const prediction = await model.predict(capturedCanvas);

    // Find top prediction
    let topClass = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > topClass.probability) topClass = prediction[i];
    }

    // Show prediction
    document.getElementById("result").innerText =
        `Prediction: ${topClass.className} (${(topClass.probability * 100).toFixed(2)}%)`;
}
