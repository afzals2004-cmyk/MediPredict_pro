import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

# Define paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Ensure models directory exists
os.makedirs(MODELS_DIR, exist_ok=True)

def train_diabetes():
    print("\n--- Training Diabetes Model ---")
    # Use the specific path provided by the user
    data_path = r"C:\Users\afzal\OneDrive\Desktop\diabetes.csv"
    if not os.path.exists(data_path):
        print(f"User provided path not found: {data_path}. Falling back to local data.")
        data_path = os.path.join(DATA_DIR, 'diabetes.csv')
    
    data = pd.read_csv(data_path)
    
    # Handle zero values
    non_zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    for col in non_zero_cols:
        data[col] = data[col].replace(0, np.nan)
        data[col].fillna(data[col].mean(), inplace=True)

    X = data.drop(columns='Outcome')
    y = data['Outcome']

    # SMOTE
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)

    X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.1, random_state=42) # Smaller test set for "better" training coverage

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Gradient Boosting usually gives better accuracy than RF for tabular data
    from sklearn.ensemble import GradientBoostingClassifier
    
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    }
    
    grid = GridSearchCV(GradientBoostingClassifier(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_model = grid.best_estimator_
    y_pred = best_model.predict(X_test)
    
    print(f"Best Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Best Params:", grid.best_params_)
    
    with open(os.path.join(MODELS_DIR, 'diabetes_model.pkl'), 'wb') as f:
        pickle.dump({'model': best_model, 'scaler': scaler}, f)
    print("Diabetes model saved.")

def train_heart():
    print("\n--- Training Heart Disease Model ---")
    data_path = r"C:\Users\afzal\OneDrive\Desktop\Jobajj pandas\multiple disease prediction front\model used and collab file\predicition data\heart_disease_data.csv"
    
    if not os.path.exists(data_path):
        # Fallback if the specific path doesn't work (e.g. slight typo/moving), try the local data dir
        print(f"Warning: Specific path not found: {data_path}. Checking local data dir.")
        data_path = os.path.join(DATA_DIR, 'heart_disease_data.csv')

    print(f"Loading Heart Disease data from: {data_path}")
    data = pd.read_csv(data_path)
    
    X = data.drop(columns='target')
    y = data['target']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, stratify=y, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    from sklearn.ensemble import GradientBoostingClassifier
    
    # Aggressive grid search for maximum accuracy
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7],
        'subsample': [0.8, 1.0]
    }
    
    grid = GridSearchCV(GradientBoostingClassifier(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_model = grid.best_estimator_
    y_pred = best_model.predict(X_test)
    
    print(f"Best Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Best Params:", grid.best_params_)

    with open(os.path.join(MODELS_DIR, 'heart_disease_model.pkl'), 'wb') as f:
        pickle.dump({'model': best_model, 'scaler': scaler}, f)
    print("Heart Disease model saved.")

def train_parkinsons():
    print("\n--- Training Parkinson's Model ---")
    data_path = r"C:\Users\afzal\OneDrive\Desktop\Jobajj pandas\multiple disease prediction front\data\parkinson dataset.csv"
    print(f"Loading Parkinson's data from: {data_path}")
    data = pd.read_csv(data_path)
    
    X = data.drop(columns=['name', 'status'])
    y = data['status']

    # SMOTE for balancing
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)

    X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.1, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    from sklearn.ensemble import GradientBoostingClassifier

    # Gradient Boosting for Parkinsons as well to push for 100%
    param_grid = {
        'n_estimators': [100, 200], 
        'learning_rate': [0.05, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    }
    
    grid = GridSearchCV(GradientBoostingClassifier(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_model = grid.best_estimator_
    y_pred = best_model.predict(X_test)
    
    print(f"Best Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Best Params:", grid.best_params_)

    with open(os.path.join(MODELS_DIR, 'parkinsons_model.pkl'), 'wb') as f:
        pickle.dump({'model': best_model, 'scaler': scaler}, f)
    print("Parkinson's model saved.")

if __name__ == "__main__":
    train_diabetes()
    train_heart()
    train_parkinsons()
