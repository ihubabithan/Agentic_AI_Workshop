import requests
from datetime import datetime
import pytz

class EvidenceMonitorAgent:
    def __init__(self):
        self.leetcode_base_url = "https://leetcode-api-l1u8.onrender.com"
        self.github_api_url = "https://api.github.com"

    def fetch_leetcode_activity(self, username: str) -> dict:
        try:
            response = requests.get(f"{self.leetcode_base_url}/{username}/submission")
            data = response.json()

            if data.get("errors"):
                return {
                    "error": "Invalid LeetCode ID",
                    "details": data.get("errors", [])
                }

            submissions = data.get("submission", [])
            current_month = datetime.now().month
            current_year = datetime.now().year

            easy = medium = hard = 0
            problems = []

            for sub in submissions:
                try:
                    timestamp = datetime.fromtimestamp(int(sub["timestamp"]), pytz.UTC)
                except (ValueError, TypeError) as conv_err:
                    continue  # Skip if timestamp is invalid

                if timestamp.month != current_month or timestamp.year != current_year:
                    continue

                slug = sub.get("titleSlug")
                title = sub.get("title")
                difficulty = "Unknown"

                try:
                    diff_response = requests.get(f"{self.leetcode_base_url}/select?titleSlug={slug}")
                    difficulty = diff_response.json().get("difficulty", "Unknown")
                except Exception:
                    pass

                if difficulty == "Easy":
                    easy += 1
                elif difficulty == "Medium":
                    medium += 1
                elif difficulty == "Hard":
                    hard += 1

                local_time = timestamp.astimezone(pytz.timezone("Asia/Kolkata"))
                problems.append({
                    "title": title,
                    "difficulty": difficulty,
                    "date": local_time.strftime("%d-%m-%Y"),
                    "time": local_time.strftime("%H:%M:%S")
                })

            total = easy + medium + hard
            return {
                "easy": easy,
                "medium": medium,
                "hard": hard,
                "total": total,
                "problems": problems
            }

        except Exception as e:
            return {"error": "Failed to fetch LeetCode data", "details": str(e)}
    
    def fetch_github_repos(self, username: str) -> dict:
            try:
                repo_url = f"{self.github_api_url}/users/{username}/repos"
                response = requests.get(repo_url)
    
                if response.status_code != 200:
                    return {
                        "error": "Failed to fetch GitHub repos",
                        "details": f"Status code: {response.status_code}"
                    }
    
                repos = response.json()
                repo_summaries = []
    
                for repo in repos:
                    name = repo.get("name")
                    commits_url = f"{self.github_api_url}/repos/{username}/{name}/commits"
    
                    try:
                        commits_resp = requests.get(commits_url)
                        if commits_resp.status_code != 200:
                            last_commit_time = "Unavailable"
                        else:
                            last_commit = commits_resp.json()[0]
                            commit_time = last_commit["commit"]["committer"]["date"]
                            last_commit_time = datetime.strptime(commit_time, "%Y-%m-%dT%H:%M:%SZ")
                            last_commit_time = last_commit_time.replace(tzinfo=pytz.UTC).astimezone(pytz.timezone("Asia/Kolkata"))
                            last_commit_time = last_commit_time.strftime("%d-%m-%Y %H:%M:%S")
                    except Exception:
                        last_commit_time = "Unavailable"
    
                    repo_summaries.append({
                        "repo_name": name,
                        "last_commit_time": last_commit_time
                    })
    
                return {
                    "github": {
                        "username": username,
                        "repositories": repo_summaries
                    }
                }
    
            except Exception as e:
                return {
                    "github": {
                        "error": "Unexpected error while fetching GitHub data",
                        "details": str(e)
                    }
                }
        
        


    def validate(self, okr_data: dict) -> dict:
        leetcode_id = okr_data.get("leetcodeId")
        github_id = okr_data.get("githubId")
        evidence_summary = {}

        # --- LeetCode Section ---
        if leetcode_id:
            # Extract username if full URL is provided
            if "leetcode.com/u/" in leetcode_id:
                leetcode_id = leetcode_id.split("/u/")[1].strip("/")

            leetcode_data = self.fetch_leetcode_activity(leetcode_id)
            evidence_summary["leetcode"] = leetcode_data
        else:
            evidence_summary["leetcode"] = {
                "error": "LeetCode ID not provided"
            }

        # --- GitHub Section ---
        if github_id:
            # Extract username if full GitHub URL is provided
            if "github.com/" in github_id:
                github_id = github_id.split("github.com/")[1].strip("/")

            github_data = self.fetch_github_repos(github_id)
            evidence_summary["github"] = github_data
        else:
            evidence_summary["github"] = {
                "error": "GitHub ID not provided"
            }

        return evidence_summary

