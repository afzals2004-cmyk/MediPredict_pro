# 🚀 Deployment Guide for Vercel

This repository is configured for seamless deployment on Vercel for both the Frontend and the Backend.

## 1. Prerequisites
*   A [GitHub account](https://github.com) with this repository pushed.
*   A [Vercel account](https://vercel.com).

## 2. Deploying the Frontend (React)

1.  Log in to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **MediPredict_pro** repository.
3.  **Configure Project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** Click `Edit` and select `frontend`.
    *   **Environment Variables:**
        *   `VITE_API_URL`: The URL of your deployed backend (see step 3). *For now, you can leave this blank and update it later.*
4.  Click **Deploy**.

## 3. Deploying the Backend (FastAPI)

1.  Go back to Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **SAME** repository again.
3.  **Configure Project:**
    *   **Framework Preset:** Other
    *   **Root Directory:** Click `Edit` and select `backend`.
    *   **Environment Variables:**
        *   `DATABASE_URL`: Your MySQL Database Connection String.
        *   `SECRET_KEY`: A secure random string.
        *   `FRONTEND_URL`: The URL of your deployed Frontend (from Step 2).
4.  Click **Deploy**.

## 4. Final Connection

1.  Once the Backend is deployed, copy its URL (e.g., `https://medipredict-backend.vercel.app`).
2.  Go to your **Frontend Project Settings** on Vercel.
3.  Go to **Environment Variables**.
4.  Add/Update `VITE_API_URL` with the Backend URL (no trailing slash).
5.  **Redeploy** the Frontend (Go to Deployments -> Redeploy) for the changes to take effect.

## ⚠️ Important Note for Backend
The backend runs as **Serverless Functions** on Vercel.
*   **Cold Starts:** The first request might take a few seconds to load the ML models.
*   **Model Size:** Ensure your `.pkl` files are not too large (< 250MB total bundle size).
