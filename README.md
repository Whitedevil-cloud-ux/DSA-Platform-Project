# Adaptive Interview Readiness Platform

A full-stack intelligent DSA performance optimization system that analyzes mastery, trends, risk signals, and generates adaptive daily practice recommendations.

---

## Live Demo

Frontend: https://your-frontend-url.vercel.app  
Backend API: https://your-backend-url.onrender.com  

---

## Problem Statement

Most DSA trackers only show solved counts and accuracy.

They do NOT:
- Detect declining performance
- Prioritize high-impact topics
- Generate adaptive practice plans
- Measure overall interview readiness

This system solves that.

---

## System Architecture

User Submissions  
→ Pattern Progress Engine  
→ Trend Detection  
→ Risk Classification  
→ Focus Scoring  
→ Adaptive Plan Generator  
→ Interview Readiness Index  
→ Dashboard + Analytics UI  

---

## Core Features

### Trend Detection

Compares recent accuracy vs overall accuracy to classify:

- 📈 Improving  
- 📉 Declining  
- ➖ Stable  

---

### Risk Classification

A pattern becomes **At Risk** if:

- Mastery < 40%
- Trend is Declining

---

### Focus Scoring Algorithm

Focus score determines learning priority.


Used to rank patterns by urgency.

---

### Adaptive Daily Plan

Automatically generates daily workload:

- 3 problems for at-risk pattern
- 2 problems for highest focus score
- 1 revision from improving pattern

---

### Interview Readiness Score

Weighted composite score (0–100) calculated using:

- Weighted mastery average
- Trend penalties
- Risk penalties
- Confidence adjustments

Provides a single high-level readiness metric.

---

## Analytics Dashboard

Includes:

- Pattern breakdown table
- Risk detection indicators
- Focus priority ranking
- Interview readiness index
- Adaptive daily plan generation

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

---

## Installation (Local Setup)

```bash
## Backend
cd backend
npm install
npm start

## Create a .env file
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

## Frontend
cd Frontend
npm install
npm run dev


