const URL = "./model/"; // your model folder

let model, maxPredictions;
let webcamVideo;
let capturedCanvas, capturedContext;

document.getElementById("start-btn").addEventListener("click", initCamera);

async function initCamera() {
    try {
        // Load model
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Create video element
        webcamVideo = document.createElement("video");
        webcamVideo.autoplay = true;
        webcamVideo.playsInline = true;

        // Append video to DOM
        document.getElementById("webcam-container").appendChild(webcamVideo);

        // Request back camera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        webcamVideo.srcObject = stream;

        // Wait until video is ready
        webcamVideo.onloadedmetadata = () => {
            webcamVideo.play();
            document.getElementById("capture-btn").disabled = false;
        };

        // Setup captured canvas
        capturedCanvas = document.createElement("canvas");
        capturedCanvas.width = 200;
        capturedCanvas.height = 200;
        capturedContext = capturedCanvas.getContext("2d");
        document.getElementById("captured-container").appendChild(capturedCanvas);

        // Capture button
        document.getElementById("capture-btn").addEventListener("click", captureAndPredict);

    } catch (err) {
        console.error("Error initializing camera or model:", err);
        alert("Could not access camera or load model. Check console.");
    }
}

async function captureAndPredict() {
    // Draw video frame to canvas
    capturedContext.drawImage(webcamVideo, 0, 0, capturedCanvas.width, capturedCanvas.height);

    // Run prediction
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
