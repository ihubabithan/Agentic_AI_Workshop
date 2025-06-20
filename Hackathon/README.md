# Project Name: OKR AI Assistant

## Participant Name
Abithan

## Project Flow

![Project Diagram](architecture.png)

---

## How to Run the Project

### AI Service
1. Navigate to the `AI` directory.  
2. Install Python dependencies:  
   ```bash
   pip install -r requirements.txt
   ```  
3. Run the FastAPI server:  
   ```bash
   uvicorn main:app --reload
   ```  
4. The AI service will be available at `http://localhost:8000`.

### Backend Service
1. Navigate to the `Backend` directory.  
2. Install Node.js dependencies:  
   ```bash
   npm install
   ```  
3. Start the backend server:  
   ```bash
   npm start
   ```  
   Or for development with auto-reload:  
   ```bash
   npm run dev
   ```  
4. The backend server will be available at `http://localhost:PORT` (check `index.js` for port).

### Frontend Service
1. Navigate to the `Frontend` directory.  
2. Install Node.js dependencies:  
   ```bash
   npm install
   ```  
3. Start the frontend development server:  
   ```bash
   npm run dev
   ```  
4. The frontend will be available at `http://localhost:3000` (or as indicated by Vite).

---

This README provides an overview of the project architecture and instructions to run each component.
