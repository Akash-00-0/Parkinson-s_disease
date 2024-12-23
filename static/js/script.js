document.addEventListener('DOMContentLoaded', () => {
  const inputContainer = document.getElementById('inputFields');

  // Dynamically create 22 input fields for features
  for (let i = 1; i <= 22; i++) {
    const label = document.createElement('label');
    label.textContent = `Feature ${i}:`;
    label.setAttribute('for', `feature${i}`);

    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any'; // Allows floating-point numbers
    input.id = `feature${i}`;
    input.name = `feature${i}`;
    input.required = true;

    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    inputContainer.appendChild(document.createElement('br'));  // To separate inputs for better readability
  }

  // Handle form submission
  document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect input values
    const features = {};
    for (let i = 1; i <= 22; i++) {
      features[`feature${i}`] = parseFloat(document.getElementById(`feature${i}`).value);
    }

    // Send input data to the backend
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      });

      const result = await response.json();
      const resultDiv = document.getElementById('result');

      if (result.prediction) {
        resultDiv.textContent = `Prediction: ${result.prediction}`;
        resultDiv.style.color = result.prediction === "Positive" ? "red" : "green";
      } else {
        resultDiv.textContent = `Error: ${result.error}`;
        resultDiv.style.color = "red";
      }
    } catch (error) {
      document.getElementById('result').textContent = 'Error: Could not connect to backend.';
      console.error(error);
    }
  });
});
