# MediPredict Pro - Advanced Multiple Disease Prediction System

MediPredict Pro is a sophisticated web application designed to assist in the early detection and risk assessment of multiple diseases, including **Diabetes**, **Heart Disease**, and **Parkinson's Disease**. It leverages Machine Learning models to analyze patient data and provide instant, accurate predictions along with detailed PDF reports.

![MediPredict Pro Dashboard](https://your-screenshot-url-here.com)

## 🚀 Key Features

*   **Multi-Disease Prediction:** Specialized models for Diabetes (PIMA Indians Dataset), Heart Disease (Cleveland Dataset), and Parkinson's Disease.
*   **Interactive Analytics Dashboard:** Real-time visualization of prediction trends, disease distribution, and confidence scores using **Nivo Charts**.
*   **Smart PDF Reports:** Generates comprehensive PDF reports with prediction results, input parameters, and actionable health insights.
*   **User Authentication:** Secure JWT-based authentication for patient history tracking.
*   **Responsive Design:** Fully responsive modern UI built with **React** and **Tailwind CSS**.
*   **Production Ready:** Configured for deployment with Docker/Procfile support and environment variable management.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: For a blazing fast and modern UI.
*   **Tailwind CSS**: For utility-first, responsive styling.
*   **Nivo Charts**: For premium, interactive data visualization.
*   **Axios**: For API communication.
*   **React Hook Form**: For efficient form handling.

### Backend
*   **FastAPI (Python)**: High-performance web framework for building APIs.
*   **Scikit-Learn**: For training and serving Machine Learning models.
*   **SQLAlchemy & MySQL**: ORM and database management.
*   **ReportLab**: For generating PDF reports.
*   **Uvicorn**: ASGI server for production.

## 📦 Installation & Setup

### Prerequisites
*   Node.js & npm
*   Python 3.9+
*   MySQL Database

### 1. Clone the Repository
```bash
git clone https://github.com/afzals2004-cmyk/MediPredict_pro.git
cd MediPredict_Pro
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Configure Environment Variables:
Rename `.env.example` to `.env` and update your database credentials:
```env
DATABASE_URL=mysql+mysqlconnector://user:password@host/db_name
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Run the Server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure Environment Variables:
Rename `.env.example` to `.env` and set the backend URL:
```env
VITE_API_URL=http://localhost:8000
```

Run the Client:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🚀 Deployment

The project is structured for easy deployment.

*   **Backend:** Includes a `Procfile` for platforms like **Heroku** or **Render**. Ensure you set the environment variables in your deployment dashboard.
*   **Frontend:** Includes a `vercel.json` for seamless deployment on **Vercel** or **Netlify**.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---
*Built with ❤️ by Afzal*
