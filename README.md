# HR A## Features

- **Smart Candidate Search**: Natural language queries with intelligent parsing
- **Shortlist Management**: Save and organize candidate collections  
- **Email Drafting**: Generate person# HR Agent - Candidate Search & Outreach Toollized outreach emails with HTML preview
- **Analytics**: Pipeline insights and skill frequency analysis
- **Scoring System**: Advanced matching algorithm with detailed explanationsFull-Stack Candidate Search & Outreach Tool

> **⚠️ Important**: Use `test_api_fixed.py` and `test_integration_fixed.py` for testing. The original `test_api.py` has syntax errors.

A full-stack HR recruitment tool with Python backend and web frontend that helps recruiters search for candidates, create shortlists, and draft personalized outreach emails. Built with pure Python 3 standard library.

## Features

- 🔍 **Smart Candidate Search**: Natural language queries with intelligent parsing
- 📝 **Shortlist Management**: Save and organize candidate groups  
- ✉️ **Email Drafting**: Generate personalized outreach emails with HTML preview
- 📊 **Analytics**: Pipeline insights and skill frequency analysis
- 🎯 **Scoring System**: Advanced matching algorithm with detailed explanations
- 🌐 **Web Interface**: Modern, responsive web UI
- 🚀 **No Dependencies**: Pure Python standard library only

## Installation & Setup

1. **Clone/Download** the project to your machine
2. **Ensure Python 3.6+** is installed
3. **Navigate** to the project directory

```bash
cd agentRH
```

## Running the Application

### Option 1: Web Interface (Recommended)
```bash
python frontend.py
```
This will start a web server at `http://localhost:8000` and automatically open your browser.

**Windows users can also double-click `start.bat` for one-click startup.**

### Option 2: CLI Interface
First, copy `hr_agent.py` from the original single-file version if you prefer command-line interface.

## Project Structure

```
agentRH/
├── backend.py            # Core Python logic (API functions)
├── frontend.py          # Web server and HTML interface  
├── start.bat            # Windows startup script
├── data/
│   ├── candidates.json   # Sample candidate database (15 candidates)
│   ├── jobs.json        # Sample job postings (3 positions)
│   └── shortlists.json  # Saved shortlists (created automatically)
└── README.md           # This file
```

## How to Use

### Web Interface (frontend.py)

1. **Start the server**: `python frontend.py`
2. **Open browser**: Navigate to `http://localhost:8000` (opens automatically)
3. **Search candidates**: Enter natural language queries in the search tab
4. **Save shortlists**: Select candidates and save them as named groups
5. **Draft emails**: Choose recipients and generate personalized outreach emails
6. **View analytics**: Check pipeline stages and top skills

### CLI Interface (hr_agent.py)

The system understands natural language queries and extracts:
### Query Understanding

Both interfaces understand natural language and extract:
- **Skills**: React, JavaScript, Python, Java, etc.
- **Location**: Casablanca, Rabat, Marrakech, etc.
- **Experience**: "2 years", "0-3 years", "junior", "senior"
- **Availability**: "available this month", "immediately"
- **Results count**: "top 5", "find 10"

**Scoring System:**
- +2 points per required skill match
- +1 point for exact location match  
- +1 point if experience within range (±1 year)
- +1 point if available within next 45 days

### Example Search Queries

```
Find top 5 React developers in Casablanca, 1–3 years, available this month
```
```
Show me 3 senior Python developers in Rabat with Django experience
```
```
Search for JavaScript developers, any location, 2-4 years experience
```

## Architecture Overview

### Backend (`backend.py`)
- **Core Functions**: All business logic and data processing
- **Pure Python**: No external dependencies
- **API-Ready**: Functions can be called directly or via HTTP

### Frontend (`frontend.py`)  
- **Web Server**: Built-in HTTP server using Python's standard library
- **Single Page App**: Modern, responsive web interface
- **Real-time**: Dynamic updates without page reloads
- **Cross-platform**: Works in any modern web browser

### Key Backend Functions
- `parse_query(text)` → Extract filters from natural language
- `search_candidates(filters)` → Find and score matching candidates  
- `save_shortlist(name, indices)` → Persist candidate groups
- `draft_email(recipients, job_title)` → Generate outreach content
- `html_template(email)` → Convert to styled HTML
- `analytics_summary()` → Calculate pipeline metrics

## Web Interface Features

### Search Tab
- Natural language query input
- Real-time candidate results with scoring
- Interactive candidate selection
- One-click shortlist creation

### Shortlists Tab
- View all saved shortlists
- Browse shortlist contents
- Quick access to candidates

### Email Tab
- Choose recipients (individual or shortlist)
- Customize job title and tone
- Live email preview
- Edit subject and closing
- HTML email preview in new window

### Analytics Tab
- Pipeline stage distribution
- Top 3 most common skills
- Total candidate count

## Sample Data

The application comes with:
- **15 diverse candidates** from different Moroccan cities
- **Various skill sets**: React, Python, Java, Node.js, etc.
- **Different experience levels**: From interns to senior developers
- **Multiple pipeline stages**: Applied, Interview, Hired, etc.
- **3 job openings**: Frontend, Full Stack, and Backend positions

## CLI Menu Options

```
🎯 HR Agent - Candidate Search & Outreach Tool
==================================================

What would you like to do?
1. Search candidates
2. View shortlists
3. Draft email
4. View analytics
5. Exit
```

## Example Usage

### Web Interface
1. **Start the server**:
   ```bash
   python frontend.py
   ```

2. **Search for candidates**: 
   - Navigate to Search tab
   - Enter: "Find top 5 React developers in Casablanca, 1-3 years"
   - Review scored results

3. **Create shortlist**:
   - Select desired candidates
   - Click "Save Selected as Shortlist"
   - Enter name: "React Developers Casa"

4. **Draft outreach email**:
   - Go to Email tab
   - Select shortlist as recipients
   - Enter job title: "Frontend React Developer"
   - Click "Draft Email" to preview

5. **Customize email**:
   - Edit subject or closing if needed
   - Click "View HTML" for styled preview
   - Email opens in new browser window

6. **Check analytics**:
   - Switch to Analytics tab
   - View pipeline distribution and top skills

### CLI Interface  
1. **Start the CLI**:
   ```bash
   python hr_agent.py
   ```

2. **Follow the interactive menu**:
   ```
   HR Agent - Candidate Search & Outreach Tool
   
   What would you like to do?
   1. Search candidates
   2. View shortlists
   3. Draft email
   4. View analytics
   5. Exit
   ```

## API Endpoints (Web Interface)

The web frontend communicates with the backend via these HTTP endpoints:

- `GET /api/search?q=<query>` → Search candidates
- `GET /api/analytics` → Get pipeline analytics  
- `GET /api/shortlists` → List all shortlists
- `GET /api/shortlist/<name>` → Get shortlist details
- `POST /api/save-shortlist` → Save new shortlist
- `POST /api/draft-email` → Generate email content
- `POST /api/html-preview` → Get HTML email template

### Data Format

**Candidates** (`data/candidates.json`):
```json
{
  "firstName": "Amina",
  "lastName": "Benali", 
  "email": "amina.benali@email.com",
  "location": "Casablanca",
  "experienceYears": 1,
  "skills": ["React", "JavaScript", "HTML"],
  "availabilityDate": "2025-10-01",
  "stage": "Applied",
  "notes": "Strong React skills"
}
```

**Jobs** (`data/jobs.json`):
```json
{
  "title": "Frontend React Developer",
  "location": "Casablanca", 
  "skillsRequired": ["React", "JavaScript", "CSS"],
  "jdSnippet": "We are looking for a talented Frontend Developer..."
}
```

## Customization & Extension

### Adding More Candidates
Edit `data/candidates.json` to add profiles following the same structure:

```json
{
  "firstName": "Name",
  "lastName": "Lastname", 
  "email": "email@example.com",
  "location": "City",
  "experienceYears": 2,
  "skills": ["React", "JavaScript"],
  "availabilityDate": "2025-10-01",
  "stage": "Applied",
  "notes": "Brief description"
}
```

### Modifying Scoring Rules
In `backend.py`, adjust the `search_candidates()` method:
- Change skill match points (currently +2 per skill)
- Modify location bonus (currently +1)
- Update experience tolerance (currently ±1 year)
- Adjust availability window (currently 45 days)

### Extending Search Parsing
Add keywords in the `parse_query()` method to recognize additional search terms.

### Custom Email Templates
Modify the `draft_email()` function to create role-specific or industry-specific templates.

### Different Port
Start the web server on a different port:
```bash
python frontend.py 8080
```

## Requirements

- **Python 3.6+** or higher
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **No external dependencies** (uses only Python standard library)

## Troubleshooting

**"Error loading data"**: Ensure the `data/` folder exists with valid JSON files

**"No candidates found"**: Try broader search terms or check candidate data

**"Invalid JSON"**: Verify JSON syntax in data files using a JSON validator

**"Port already in use"**: Try a different port: `python frontend.py 8080`

**Browser doesn't open**: Manually navigate to `http://localhost:8000`

**API errors**: Check browser developer console (F12) for detailed error messages

## Development & Testing

### Testing Backend Functions
```bash
python backend.py
```
This runs built-in tests for all core functions.

### Testing Individual Components
```python
from backend import parse_query, search_candidates

# Test query parsing
filters = parse_query("Find React developers in Casablanca")
print(filters)

# Test search
results = search_candidates(filters)
for result in results:
    print(f"{result['candidate']['firstName']}: {result['score']} points")
```

## Future Enhancements

- Email templates for different roles/industries
- Advanced filtering (salary range, remote work)
- Integration with external job boards
- Interview scheduling features
- Automated follow-up sequences

---

**Happy Recruiting!**
#   R H a g e n t  
 