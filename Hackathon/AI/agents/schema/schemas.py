# agents/schemas.py

from pydantic import BaseModel
from typing import Literal

class ProgressReport(BaseModel):
    summary: str
    completionTrend: str
    evidenceTrend: str
    feedbackIncorporation: str
    status: Literal["on_track", "at_risk", "off_track"]
