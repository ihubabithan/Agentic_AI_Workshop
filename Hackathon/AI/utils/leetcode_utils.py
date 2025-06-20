import requests
from datetime import datetime
import pytz

def fetch_leetcode_activity(username: str):
    API_BASE = f"https://leetcode-api-l1u8.onrender.com"

    # Validate user
    response = requests.get(f"{API_BASE}/{username}/submission")
    data = response.json()

    if data.get("errors"):
        return {"error": "Invalid LeetCode ID", "details": data}

    submissions = data.get("submission", [])
    current_month = datetime.now().month
    current_year = datetime.now().year

    easy = medium = hard = 0
    problems = []

    for sub in submissions:
        ts = datetime.fromtimestamp(sub["timestamp"], pytz.UTC)
        if ts.month != current_month or ts.year != current_year:
            continue

        slug = sub["titleSlug"]
        diff_response = requests.get(f"{API_BASE}/select?titleSlug={slug}")
        difficulty = diff_response.json().get("difficulty", "Unknown")

        if difficulty == "Easy":
            easy += 1
        elif difficulty == "Medium":
            medium += 1
        elif difficulty == "Hard":
            hard += 1

        problems.append({
            "title": sub["title"],
            "difficulty": difficulty,
            "date": ts.astimezone(pytz.timezone("Asia/Kolkata")).strftime("%d-%m-%Y"),
            "time": ts.astimezone(pytz.timezone("Asia/Kolkata")).strftime("%H:%M:%S")
        })

    return {
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "total": easy + medium + hard,
        "problems": problems
    }
