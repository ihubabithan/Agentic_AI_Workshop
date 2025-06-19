SAMPLE_SUBMISSIONS = [
    {
        "id": "SUB001",
        "student_id": "STU101",
        "title": "Basic Python Calculator",
        "description": "Implemented a simple calculator with add/subtract functions using Python. All test cases passing.",
        "complexity": "simple",
        "urgency": "low",
        "performance_history": "Consistent performer, completes tasks on time"
    },
    {
        "id": "SUB002",
        "student_id": "STU102",
        "title": "ML Model Deployment",
        "description": "Deployed a complex machine learning model using FastAPI and Docker. Having issues with model versioning and API scaling.",
        "complexity": "complex",
        "urgency": "high",
        "performance_history": "First-time ML deployment attempt"
    },
    {
        "id": "SUB003",
        "student_id": "STU103",
        "title": "React Component Library",
        "description": "Created 5 reusable React components with Storybook documentation. Need review on component best practices.",
        "complexity": "moderate",
        "urgency": "medium",
        "performance_history": "Good with frontend tasks"
    },
    {
        "id": "SUB004",
        "student_id": "STU104",
        "title": "Database Schema Update",
        "description": "Added three new tables and updated existing relationships. Need validation on indexing strategy.",
        "complexity": "moderate",
        "urgency": "high",
        "performance_history": "Previous schema changes required multiple iterations"
    }
]

def get_sample_submission(submission_id: str = None):
    """Get a specific submission by ID or return the first one if no ID provided."""
    if submission_id:
        return next((sub for sub in SAMPLE_SUBMISSIONS if sub["id"] == submission_id), SAMPLE_SUBMISSIONS[0])
    return SAMPLE_SUBMISSIONS[0] 