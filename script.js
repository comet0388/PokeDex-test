const URL = "./model/"; // your model folder

let model, maxPredictions;
let webcam;
let capturedCanvas, capturedContext;

// Initialize model and webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Setup webcam (back camera preferred)
        webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
        await webcam.setup({ facingMode: "environment" }); // request back camera
        await webcam.play();

        // Append webcam canvas
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        // Setup captured image canvas
        capturedCanvas = document.createElement("canvas");
        capturedCanvas.width = 200;
        capturedCanvas.height = 200;
        capturedContext = capturedCanvas.getContext("2d");
        document.getElementById("captured-container").appendChild(capturedCanvas);

        // Enable capture button
        document.getElementById("capture-btn").addEventListener("click", captureAndPredict);

    } catch (err) {
        console.error("Error initializing camera or model:", err);
        alert("Could not access camera or load model. Check console.");
    }
}

// Capture current webcam frame and run prediction
async function captureAndPredict() {
    // Draw current frame to captured canvas
    capturedContext.drawImage(webcam.canvas, 0, 0, 200, 200);

    // Predict using captured image
    const prediction = await model.predict(capturedCanvas);

    // Find top prediction
    let topClass = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > topClass.probability) topClass = prediction[i];
    }

    // Show result
    document.getElementById("result").innerText =
        `Prediction: ${topClass.className} (${(topClass.probability * 100).toFixed(2)}%)`;
}

// Initialize when page loads
window.onload = init;
