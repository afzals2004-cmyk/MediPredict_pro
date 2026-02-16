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
    *   **Root Directory:** Click `Edit` and select `frontend`. **(CRITICAL STEP)**
    *   **Environment Variables:**
        *   `VITE_API_URL`: The URL of your deployed backend (see step 3). *For now, you can leave this blank and update it later.*
4.  Click **Deploy**.

## 3. Deploying the Backend (Recommended: Render)

**Why Render?**
Vercel has a strict 250MB size limit for serverless functions, which is too small for Machine Learning applications using `pandas` and `scikit-learn`. Render supports Docker containers, which is perfect for this app.

1.  **Sign Up:** Go to [Render.com](https://render.com) and create an account.
2.  **New Web Service:** Click **"New +"** and select **"Web Service"**.
3.  **Connect GitHub:** Connect your GitHub account and select the **MediPredict_pro** repository.
4.  **Configure Service:**
    *   **Name:** `medipredict-backend`
    *   **Root Directory:** `backend` (Important!)
    *   **Runtime:** Docker
    *   **Instance Type:** Free (or Starter if you want faster speeds)
    *   **Environment Variables:** (Add these below)
        *   `DATABASE_URL`: Your MySQL Database Connection String.
        *   `SECRET_KEY`: A secure random string.
        *   `FRONTEND_URL`: The URL of your Vercel Frontend (from Step 2).
5.  Click **Create Web Service**.

## 4. Final Connection

1.  Once the Render Backend is live, copy its URL (e.g., `https://medipredict-backend.onrender.com`).
2.  Go to your **Frontend Project Settings** on Vercel.
3.  Go to **Environment Variables**.
4.  Add/Update `VITE_API_URL` with the Backend URL (no trailing slash).
5.  **Redeploy** the Frontend (Go to Deployments -> Redeploy) for the changes to take effect.

## ⚠️ Important Note for Backend
The backend runs as **Serverless Functions** on Vercel.
*   **Cold Starts:** The first request might take a few seconds to load the ML models.
*   **Model Size:** Ensure your `.pkl` files are not too large (< 250MB total bundle size).
