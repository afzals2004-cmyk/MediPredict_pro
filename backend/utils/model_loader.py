import pickle
import os
import sys
from functools import lru_cache

# Get the absolute path to the directory where this script is located
current_dir = os.path.dirname(os.path.abspath(__file__))
# Get the parent directory (backend)
backend_dir = os.path.dirname(current_dir)
# Define MODELS_DIR relative to backend
MODELS_DIR = os.path.join(backend_dir, 'models')

@lru_cache(maxsize=None)
def load_model(disease_name):
    """
    Loads the trained model and scaler for the specified disease.
    """
    try:
        model_name = f'{disease_name}_model.pkl'
        model_path = os.path.join(MODELS_DIR, model_name)
        
        if not os.path.exists(model_path):
            print(f"Model file not found: {model_path}")
            return None, None

        with open(model_path, 'rb') as f:
            data = pickle.load(f)
            
        return data['model'], data['scaler']
    except Exception as e:
        print(f"Error loading model {disease_name}: {e}")
        return None, None
