from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)

# Train the model on startup
def train_model():
    # Load dataset (replace with correct path if needed)
    data = pd.read_csv("parkinsons.csv")  # Make sure 'parkinsons.csv' is in the same directory as app.py
    
    # Feature selection
    X = data.drop(columns=['status', 'name'])
    y = data['status']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest Classifier
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"Model trained with accuracy: {accuracy}")
    
    return model

# Initialize the model
model = train_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the frontend
        data = request.get_json()
        
        # Extract 22 features from the input data
        features = [float(data[f'feature{i}']) for i in range(1, 23)]
        
        # Convert features to DataFrame for prediction
        input_data = pd.DataFrame([features])
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        prediction_label = "Positive" if prediction == 1 else "Negative"
        
        # Return prediction as JSON
        return jsonify({'prediction': prediction_label})
    except Exception as e:
        # Handle errors (e.g., missing or incorrect input)
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
