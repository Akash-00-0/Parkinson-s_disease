document.getElementById("input-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {};

  formData.forEach((value, key) => {
      data[key] = value;
  });

  fetch("/predict", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      const resultDiv = document.getElementById("result");
      resultDiv.textContent = `Prediction: ${result.prediction}`;
      resultDiv.style.display = "block";
  })
  .catch(error => {
      console.error("Error:", error);
  });
});
