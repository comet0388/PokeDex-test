// Path to your model folder
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Initialize the webcam and load the model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Set up the webcam
        const flip = true; // flip the webcam for mirror effect
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup(); // request camera permission
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Add webcam canvas to DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        // Add prediction labels to DOM
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (err) {
        console.error("Error initializing model or webcam:", err);
        alert("Could not load model or access webcam. Check console for details.");
    }
}

// Loop for real-time predictions
async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the model
async function predict() {
    if (!model || !webcam) return;

    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
