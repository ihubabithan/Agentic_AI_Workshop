# Project Name: OKR AI Assistant

## Participant Name
Abithan

## Project Flow

### Top-Level Flow:
- Frontend (User submits OKR as JSON)
  ↓
- Backend (Triggers AI and sends data to agents)

### Agent Workflow:
1. OKR Cleaner Agent: Cleans and simplifies JSON text  
   ↓  
2. OKR Interpreter Agent: Converts to structured OKR data  
   ↓  
3. Benchmark Retriever Agent: Fetches industry standards  
   ↓  
4. Evidence Monitor Agent: Collects and verifies user activity  
   ↓  
5. Validation Agent: Validates effort based on relevance, completeness, and quality  
   ↓  
6. Feedback Generator Agent: Generates feedback and action plan  
   ↓  
7. Progress Tracker Agent: Tracks progress over time  
   ↓  
- Save to Database

### Bottom Layer:
- UI: Display progress, feedback, action plan

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
