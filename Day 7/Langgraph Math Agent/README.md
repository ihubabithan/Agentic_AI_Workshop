# Langgraph Math Agent

## Project Description
Langgraph Math Agent is an intelligent agent built using a state graph architecture. It routes user queries to either a math operation node or a language model node based on the query type. The agent can handle basic arithmetic operations such as addition, subtraction, multiplication, and division, and uses the Google Gemini language model for non-math queries.

## Features
- Supports basic math queries: addition, subtraction, multiplication, and division
- Uses Google Gemini LLM for handling general queries
- Interactive command-line interface for user input and responses

## Installation

### Prerequisites
- Python 3.7 or higher
- pip package manager

### Setup
1. Clone the repository or download the project files.
2. Navigate to the project directory:
   ```
   cd "Day 7/Langgraph Math Agent"
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up your Google API key:
   - Create a `.env` file in the project root directory.
   - Add your Google API key in the `.env` file as follows:
     ```
     GOOGLE_API_KEY=your_google_api_key_here
     ```

## Usage
Run the main script to start the interactive agent:
```
python main.py
```
Type your queries at the prompt. To exit, type `exit` or `quit`.

Example:
```
You: 5 plus 3
Agent: 8.0

You: What is the capital of France?
Agent: Paris is the capital of France.

You: exit
```

## Architecture
The agent is built using a state graph with the following nodes:
- **Router Node**: Routes queries to either the math node or the language model node based on the query content.
- **Math Node**: Handles basic arithmetic operations (plus, subtract, multiply, divide) by parsing the query and performing the calculation.
- **LLM Node**: Uses the Google Gemini language model to handle general queries.

The routing decision is made by checking for math-related keywords in the query.

## Testing
The project includes a `tests` directory with test cases for query handling. You can run tests using your preferred test runner.

## License
This project does not currently specify a license.
