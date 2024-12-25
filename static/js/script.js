document.getElementById("predictionForm").addEventListener("submit", async (event) => {
    event.preventDefault();  // Prevent form from reloading the page

    const formData = new FormData(event.target);  // Collect form data

    try {
        const response = await fetch("/", {
            method: "POST",
            body: formData,  // Send form data directly to the server
        });

        const result = await response.json();  // Parse the JSON response from the server
        console.log(result);  // Log result to check

        // Display the result of the prediction in the 'result' div
        if (result.prediction) {
            document.getElementById("result").innerText = result.prediction;
        } else if (result.error) {
            document.getElementById("result").innerText = "Error: " + result.error;
        }

    } catch (error) {
        console.error("Error:", error);  // Log any error that occurs
        document.getElementById("result").innerText = "An error occurred. Please try again.";
    }
});
