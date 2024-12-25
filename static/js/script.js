document.getElementById('predict-btn').addEventListener('click', function() {
    // Collecting all 22 features from the input fields
    let features = {};
    for (let i = 1; i <= 22; i++) {
        features[`feature${i}`] = document.getElementById(`feature${i}`).value;
    }

    // Sending the data to Flask backend via POST request
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),  // send the data as JSON
    })
    .then(response => response.json())
    .then(data => {
        // Showing the prediction result
        const resultDiv = document.getElementById('result');
        if (data.prediction) {
            resultDiv.innerHTML = `Prediction: ${data.prediction}`;
        } else if (data.error) {
            resultDiv.innerHTML = `Error: ${data.error}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
