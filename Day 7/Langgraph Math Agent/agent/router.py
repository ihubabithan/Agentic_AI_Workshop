import re

def is_math_query(text: str) -> bool:
    math_keywords = ["plus", "add", "minus", "subtract", "times", "multiply", "divided", "divide", "mod", "remainder"]
    return any(keyword in text.lower() for keyword in math_keywords)

def parse_math_query(text: str):
    # Very basic parser — you can extend this with NLP
    pattern = re.compile(r"(\d+)\s*(plus|add|minus|subtract|times|multiply|divided by|divide)\s*(\d+)")
    match = pattern.search(text.lower())
    if match:
        a, op, b = match.groups()
        return float(a), op, float(b)
    return None, None, None
