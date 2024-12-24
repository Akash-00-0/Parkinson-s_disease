document.getElementById("input-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Log the data to ensure it is being correctly sent to the backend
    console.log("Sending data to the backend:", data);

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Log the result from the backend
        console.log("Received result from backend:", result);

        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Prediction: ${result.prediction}`;
        resultDiv.style.display = "block";
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
