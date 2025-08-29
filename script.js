let model, webcam, labelContainer, maxPredictions;

// Initialize the model
async function init() {
    const modelURL = "/my_model/model.json";
    const metadataURL = "/my_model/metadata.json";

    try {
        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        console.log("Model loaded successfully!");

        // Set up webcam
        const flip = true; // flip the camera if needed
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup({ facingMode: "environment" }); // use back camera
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Append elements to page
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (error) {
        console.error("Error loading the model or initializing webcam:", error);
    }
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

// Capture image and predict
async function captureAndPredict() {
    try {
        // Capture the current frame
        const image = webcam.canvas.toDataURL("image/png");
        document.getElementById("status").innerText = "Image Captured! Processing...";

        // Run prediction
        const prediction = await model.predict(webcam.canvas);

        // Display predictions
        let result = "Predictions:\n";
        prediction.forEach(p => {
            result += `${p.className}: ${(p.probability * 100).toFixed(2)}%\n`;
        });

        document.getElementById("status").innerText = result;
    } catch (error) {
        console.error("Prediction error:", error);
        document.getElementById("status").innerText = "Error during prediction!";
    }
}

window.onload = init;
