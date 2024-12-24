from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
import pickle
import sys

# Import necessary functions or classes from your notebook
from nbformat import read
import nbformat

# Load the Jupyter notebook model directly into the Flask app
def load_model_from_notebook():
    model_notebook = 'Parkinson’s_Disease.ipynb'

    # Open and read the notebook
    with open(model_notebook, 'r') as f:
        notebook_content = nbformat.read(f, as_version=4)

    # Extract the trained model from the notebook
    model = None
    for cell in notebook_content['cells']:
        if cell['cell_type'] == 'code':
            if 'model' in cell['source']:  # Assuming your model is trained in a cell containing 'model'
                exec(cell['source'], globals())
                model = globals().get('model', None)

    if model is None:
        raise ValueError("Model not found in the notebook")

    return model

# Initialize Flask app
app = Flask(__name__)

# Load the model (this will run the notebook and extract the model)
model = load_model_from_notebook()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the input data from the frontend (JSON)
        data = request.get_json()

        # Make sure to receive the correct number of features (22)
        features = np.array([
            [
                data['MDVP:Fo(Hz)'],  # Replace with your actual input names from the form
                data['MDVP:Fhi(Hz)'],
                data['MDVP:Flo(Hz)'],
                data['MDVP:Jitter(%)'],
                data['MDVP:Jitter(Abs)'],  # Replace with your actual input names from the form
                data['MDVP:RAP'],
                data['MDVP:PPQ'],
                data['Jitter:DDP'],
                data['MDVP:Shimmer'],  # Replace with your actual input names from the form
                data['MDVP:Shimmer(dB)'],
                data['Shimmer:APQ3'],
                data['Shimmer:APQ5'],
                data['MDVP:APQ'],  # Replace with your actual input names from the form
                data['Shimmer:DDA'],
                data['NHR'],
                data['HNR'],
                data['RPDE'],  # Replace with your actual input names from the form
                data['DFA'],
                data['spread1'],
                data['spread2'],
                data['D2'],
                data['PPE'],
            ]
        ])

        # Predict using the loaded model
        prediction = model.predict(features)

        # Return the prediction result
        return jsonify({'prediction': prediction[0]})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'prediction': 'Error in prediction'}), 400

if __name__ == '__main__':
    app.run(debug=True)
