#!/usr/bin/env python3
"""
HR Agent Backend - Core logic for candidate search, scoring, and email drafting
Pure Python 3 standard library implementation
"""

import json
import os
import re
from collections import Counter
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional


class HRBackend:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.candidates = []
        self.jobs = []
        self.shortlists = {}
        self.load_data()

    def load_data(self):
        """Load candidates, jobs, and existing shortlists from JSON files."""
        try:
            # Load candidates
            candidates_path = os.path.join(self.data_dir, "candidates.json")
            with open(candidates_path, "r", encoding="utf-8") as f:
                self.candidates = json.load(f)

            # Load jobs
            jobs_path = os.path.join(self.data_dir, "jobs.json")
            with open(jobs_path, "r", encoding="utf-8") as f:
                self.jobs = json.load(f)

            # Load existing shortlists (optional)
            shortlists_path = os.path.join(self.data_dir, "shortlists.json")
            if os.path.exists(shortlists_path):
                with open(shortlists_path, "r", encoding="utf-8") as f:
                    self.shortlists = json.load(f)

            print(
                f"Loaded {len(self.candidates)} candidates, {len(self.jobs)} jobs, {len(self.shortlists)} shortlists"
            )

        except FileNotFoundError as e:
            print(f"Error loading data: {e}")
            print(
                "Make sure the data/ folder exists with candidates.json and jobs.json"
            )
            raise
        except json.JSONDecodeError as e:
            print(f"Invalid JSON format: {e}")
            raise

    def _normalize_skill(self, skill):
        """Normalize skill names and handle synonyms."""
        synonyms = {
            'js': 'JavaScript',
            'nodejs': 'Node.js',
            'node.js': 'Node.js',
            'py': 'Python',
            'reactjs': 'React',
            'frontend': 'Frontend',
            'backend': 'Backend',
            'sql': 'SQL',
            'db': 'Database',
            'dbms': 'Database',
            'html5': 'HTML',
            'css3': 'CSS',
        }
        skill = skill.lower().strip()
        return synonyms.get(skill, skill.title())

    def _fuzzy_match(self, a, b):
        """Return True if a and b are similar (basic fuzzy match)."""
        a, b = a.lower(), b.lower()
        if a == b:
            return True
        if a in b or b in a:
            return True
        # Allow 1-char difference for short skills
        if len(a) > 3 and len(b) > 3 and abs(len(a) - len(b)) <= 1:
            mismatches = sum(1 for x, y in zip(a, b) if x != y)
            if mismatches <= 1:
                return True
        return False

    def parse_query(self, text: str) -> Dict[str, Any]:
        """
        Parse natural language query into structured filters.
        Returns: {role?, skills[], location?, minExp?, maxExp?, availabilityWindowDays?}
        """
        filters = {}
        text_lower = text.lower()

        # Enhanced: Recognize 'frontend developer' and variants as both role and skill
        if re.search(r"front\s*-?\s*end\s+dev(eloppe?r)?", text_lower):
            filters["role"] = "Frontend Developer"
            # Add 'Frontend' and common frontend skills to skills list
            filters.setdefault("skills", []).extend([
                "Frontend", "React", "JavaScript", "HTML", "CSS"
            ])

        # Extract role/job title (add 'frontend developer' and variants)
        role_patterns = [
            r"\b(intern|internship)\b",
            r"\b(junior|entry.level|graduate)\b",
            r"\b(senior|lead|principal|architect)\b",
            r"\b(full.?stack|fullstack)\b",
            r"\b(frontend developer|frontend developper|front.?end|frontend)\b",
            r"\b(backend|back.end)\b",
            r"\b(developer|engineer|programmer)\b",
        ]

        for pattern in role_patterns:
            match = re.search(pattern, text_lower, re.IGNORECASE)
            if match:
                filters["role"] = match.group(0).replace(".", " ").title()
                break

        # Extract technical skills (add 'frontend' as a skill)
        skills_pattern = r"\b(react|reactjs|javascript|js|python|py|java|node\.?js|nodejs|angular|vue|css|css3|html|html5|sql|db|dbms|mongodb|postgresql|docker|kubernetes|aws|azure|gcp|typescript|php|c\+\+|c#|ruby|go|rust|swift|kotlin|flutter|django|flask|spring|laravel|express|git|redis|elasticsearch|graphql|rest|api|frontend|backend)\b"
        skills_found = re.findall(skills_pattern, text_lower, re.IGNORECASE)

        if skills_found:
            normalized_skills = []
            for skill in skills_found:
                norm = self._normalize_skill(skill)
                if norm == 'Frontend':
                    normalized_skills.extend(['React', 'JavaScript', 'HTML', 'CSS'])
                elif norm == 'Backend':
                    normalized_skills.extend(['Python', 'Node.js', 'SQL'])
                else:
                    normalized_skills.append(norm)
            # Remove duplicates while preserving order
            seen = set()
            filters.setdefault("skills", [])
            for skill in normalized_skills:
                if skill not in seen:
                    filters["skills"].append(skill)
                    seen.add(skill)

        # Extract location
        location_pattern = r"\b(casablanca|rabat|marrakech|fez|tangier|agadir|meknes|oujda|kenitra|tetouan|sale|temara|mohammedia|el jadida|taza|settat|khouribga|beni mellal|nador|berrechid|khemisset|laayoune|paris|london|madrid|barcelona|amsterdam|berlin|rome|milan|new york|san francisco|toronto|montreal|dubai|cairo|tunis|algiers|lagos|nairobi|cape town|johannesburg|sydney|melbourne|tokyo|singapore|mumbai|bangalore|delhi|beijing|shanghai|hong kong|seoul|taipei|bangkok|jakarta|kuala lumpur|manila|ho chi minh|hanoi|istanbul|athens|vienna|prague|warsaw|stockholm|oslo|helsinki|copenhagen|brussels|geneva|zurich|lisbon)\b"
        location_match = re.search(location_pattern, text_lower, re.IGNORECASE)
        if location_match:
            filters["location"] = location_match.group(0).title()

        # Extract experience range
        exp_range_pattern = r"(\d+)[-–—](\d+)\s*years?"
        exp_range_match = re.search(exp_range_pattern, text_lower)

        if exp_range_match:
            filters["minExp"] = int(exp_range_match.group(1))
            filters["maxExp"] = int(exp_range_match.group(2))
        else:
            # Single number experience
            single_exp_pattern = r"(\d+)\s*years?"
            single_exp_match = re.search(single_exp_pattern, text_lower)
            if single_exp_match:
                exp = int(single_exp_match.group(1))
                filters["minExp"] = max(0, exp - 1)
                filters["maxExp"] = exp + 1

        # Extract availability window
        if re.search(
            r"\b(available|this month|immediately|asap|now|soon)\b", text_lower
        ):
            filters["availabilityWindowDays"] = 45  # Within next 45 days
        elif re.search(r"\bnext\s*(\d+)\s*months?\b", text_lower):
            months_match = re.search(r"\bnext\s*(\d+)\s*months?\b", text_lower)
            if months_match:
                months = int(months_match.group(1))
                filters["availabilityWindowDays"] = months * 30

        # Extract result limit
        limit_pattern = r"top\s*(\d+)|first\s*(\d+)|(\d+)\s*candidates?"
        limit_match = re.search(limit_pattern, text_lower)
        if limit_match:
            limit = int(
                limit_match.group(1) or limit_match.group(2) or limit_match.group(3)
            )
            filters["limit"] = limit
        else:
            filters["limit"] = 5  # Default limit

        return filters

    def search_candidates(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Flexible search: Score all candidates by partial matches and always return top results.
        Returns: [{candidate, score, reason}]
        """
        results = []
        today = datetime.now().date()
        matching_jobs = self._find_matching_jobs(filters)

        for i, candidate in enumerate(self.candidates):
            score = 0
            reasons = []
            candidate_skills = [self._normalize_skill(skill) for skill in candidate.get("skills", [])]
            filter_skills = [self._normalize_skill(skill) for skill in filters.get("skills", [])]
            matched_skills = []
            fuzzy_matched_skills = []
            for filter_skill in filter_skills:
                for candidate_skill in candidate_skills:
                    if self._fuzzy_match(filter_skill, candidate_skill):
                        matched_skills.append(filter_skill)
                        break
                    elif filter_skill[:3] == candidate_skill[:3]:
                        fuzzy_matched_skills.append(filter_skill)
                        break
            if matched_skills:
                skill_score = len(matched_skills) * 2
                score += skill_score
                skills_display = "+".join([s.title() for s in matched_skills])
                reasons.append(f"{skills_display} match (+{skill_score})")
            if fuzzy_matched_skills:
                fuzzy_score = len(fuzzy_matched_skills)
                score += fuzzy_score
                skills_display = "+".join([s.title() for s in fuzzy_matched_skills])
                reasons.append(f"Fuzzy skill match: {skills_display} (+{fuzzy_score})")

            # Job-based skill matching bonus (+1 per job skill match)
            job_skill_matches = 0
            for job in matching_jobs:
                job_skills = [skill.lower() for skill in job.get("skillsRequired", [])]
                for job_skill in job_skills:
                    for candidate_skill in candidate_skills:
                        if job_skill in candidate_skill or candidate_skill in job_skill:
                            job_skill_matches += 1
                            break
            if job_skill_matches > 0:
                score += job_skill_matches
                reasons.append(f"Job skills match (+{job_skill_matches})")

            # Location matching (+1 for exact match, +0.5 for partial match)
            candidate_location = candidate.get("location", "").lower()
            filter_location = filters.get("location", "").lower()
            if filter_location:
                if candidate_location == filter_location:
                    score += 1
                    reasons.append(f"Location: {filters['location']} (exact match, +1)")
                elif filter_location in candidate_location or candidate_location in filter_location:
                    score += 0.5
                    reasons.append(f"Location: partial match (+0.5)")
                else:
                    reasons.append(f"Location: not matched")

            # Experience matching (+1 if within range ±1 year, +0.5 if within ±2 years)
            if "minExp" in filters and "maxExp" in filters:
                candidate_exp = candidate.get("experienceYears", 0)
                if (filters["minExp"] - 1) <= candidate_exp <= (filters["maxExp"] + 1):
                    score += 1
                    reasons.append(f"Experience: {candidate_exp}y (in range, +1)")
                elif (filters["minExp"] - 2) <= candidate_exp <= (filters["maxExp"] + 2):
                    score += 0.5
                    reasons.append(f"Experience: {candidate_exp}y (near range, +0.5)")
                else:
                    reasons.append(f"Experience: {candidate_exp}y (not matched)")

            # Availability matching (+1 if within window, +0.5 if within 90 days)
            if "availabilityWindowDays" in filters:
                avail_date_str = candidate.get("availabilityDate", "")
                if avail_date_str:
                    try:
                        avail_date = datetime.strptime(avail_date_str, "%Y-%m-%d").date()
                        days_until_available = (avail_date - today).days
                        if 0 <= days_until_available <= filters["availabilityWindowDays"]:
                            score += 1
                            if days_until_available <= 7:
                                reasons.append("Available immediately (+1)")
                            elif days_until_available <= 30:
                                reasons.append("Available this month (+1)")
                            else:
                                reasons.append("Available soon (+1)")
                        elif 0 <= days_until_available <= 90:
                            score += 0.5
                            reasons.append("Available within 3 months (+0.5)")
                        else:
                            reasons.append("Availability not matched")
                    except ValueError:
                        pass

            # Always include all candidates, but only show reasons if score > 0
            if not reasons:
                reasons.append("Partial or general match")
            reason_text = ", ".join(reasons) + f" → score {score}"
            job_recommendations = self._get_job_recommendations(candidate)
            results.append({
                "candidate": candidate,
                "score": score,
                "reason": reason_text,
                "index": i,
                "recommendedJobs": job_recommendations,
            })

        # Sort by score descending, then by name
        results.sort(key=lambda x: (-x["score"], x["candidate"].get("firstName", "")))
        limit = filters.get("limit", 5)
        # Always return top candidates, even if score is 0
        return results[:limit]

    def save_shortlist(self, name: str, candidate_indices: List[int]) -> bool:
        """
        Save a named shortlist of candidate indices.
        Returns: success boolean
        """
        try:
            # Validate indices
            valid_indices = [
                i for i in candidate_indices if 0 <= i < len(self.candidates)
            ]

            if not valid_indices:
                print("No valid candidate indices provided")
                return False

            self.shortlists[name] = valid_indices

            # Save to file
            shortlists_path = os.path.join(self.data_dir, "shortlists.json")
            with open(shortlists_path, "w", encoding="utf-8") as f:
                json.dump(self.shortlists, f, indent=2, ensure_ascii=False)

            print(f"Shortlist '{name}' saved with {len(valid_indices)} candidates")
            return True

        except Exception as e:
            print(f"Error saving shortlist: {e}")
            return False

    def draft_email(
        self,
        recipients: List[Dict],
        job_title: str = "exciting opportunity",
        tone: str = "friendly",
    ) -> Dict[str, str]:
        """
        Draft an outreach email for candidates.
        Returns: {subject, text}
        """
        is_multiple = len(recipients) > 1

        # Generate subject line
        if is_multiple:
            if tone == "professional":
                subject = f"Career Opportunity: {job_title} Position"
            else:
                subject = f"Exciting {job_title} Opportunity - Perfect Match!"
        else:
            candidate = recipients[0]
            name = candidate.get("firstName", "there")
            if tone == "professional":
                subject = f"Career Opportunity: {job_title} Role"
            else:
                subject = f"Hi {name}, interested in a {job_title} role?"

        # Generate email body
        if is_multiple:
            greeting = (
                "Dear talented professionals,"
                if tone == "professional"
                else "Hello amazing developers,"
            )
            intro = f"I hope this message finds you well. Your profiles have caught our attention for an exciting {job_title} opportunity at our company."

            body = f"""We believe your combined expertise and experience would be an excellent fit for our growing team.

What we're offering:
• Competitive salary package with performance bonuses
• Flexible remote/hybrid work arrangements
• Cutting-edge technology stack and modern development practices  
• Professional development budget and learning opportunities
• Collaborative team environment with experienced mentors
• Comprehensive health and wellness benefits

The {job_title} role involves working on innovative projects that make a real impact. We value creativity, technical excellence, and continuous learning.

I would love to schedule a brief call to discuss this opportunity in detail and learn more about your career goals. This could be the perfect next step for your professional journey."""

        else:
            candidate = recipients[0]
            name = candidate.get("firstName", "there")
            skills = candidate.get("skills", [])
            experience = candidate.get("experienceYears", "X")
            location = candidate.get("location", "your area")

            if tone == "professional":
                greeting = f"Dear {name},"
                intro = f"I am writing to discuss a {job_title} opportunity that aligns well with your professional background."
            else:
                greeting = f"Hi {name},"
                intro = f"I came across your profile and was impressed by your {experience} years of experience"
                if skills:
                    top_skills = ", ".join(skills[:3])
                    intro += f" and expertise in {top_skills}."
                else:
                    intro += "."

            body = f"""I'm reaching out about an exciting {job_title} position that I believe would be perfect for someone with your background and skills.

Why this role is great for you:
• Your {experience} years of experience make you an ideal candidate
• Work location in {location} or remote flexibility available
• Opportunity to work with modern technologies and frameworks
• Collaborative team environment with senior developers
• Competitive compensation package
• Clear career progression path

The role involves building innovative solutions and working on challenging projects that will expand your technical skills. Our team values quality code, continuous learning, and work-life balance.

Would you be interested in a brief 15-minute conversation to learn more about this opportunity? I'm happy to answer any questions you might have."""

        # Generate closing
        if tone == "professional":
            closing = """Thank you for your time and consideration.

Best regards,
[Your Name]
Senior Technical Recruiter
[Company Name]
[Email] | [Phone]"""
        else:
            closing = """Looking forward to hearing from you! 🚀

Best regards,
[Your Name]
Tech Recruiter @ [Company Name]
[Email] | [Phone]

P.S. Feel free to connect with me on LinkedIn if you'd like to stay in touch about future opportunities."""

        email_text = f"{greeting}\n\n{intro}\n\n{body}\n\n{closing}"

        return {"subject": subject, "text": email_text}

    def html_template(self, email: Dict[str, str]) -> str:
        """
        Convert email to HTML template.
        Returns: formatted HTML string
        """
        subject = email["subject"]
        text_content = email["text"]

        # Split into paragraphs
        paragraphs = text_content.split("\n\n")
        html_paragraphs = []

        for para in paragraphs:
            if not para.strip():
                continue

            lines = para.split("\n")

            # Check if this is a bullet list section
            if any(line.strip().startswith("•") for line in lines):
                # Create bulleted list
                list_items = []
                regular_lines = []

                for line in lines:
                    if line.strip().startswith("•"):
                        list_items.append(f"<li>{line.strip()[1:].strip()}</li>")
                    else:
                        if line.strip():
                            regular_lines.append(f"<p>{line.strip()}</p>")

                if regular_lines:
                    html_paragraphs.extend(regular_lines)
                if list_items:
                    html_paragraphs.append(f"<ul>{''.join(list_items)}</ul>")

            # Check if this is a greeting or closing
            elif any(
                greeting in para.lower()
                for greeting in [
                    "dear",
                    "hi ",
                    "hello",
                    "best regards",
                    "sincerely",
                    "looking forward",
                ]
            ):
                if (
                    "best regards" in para.lower()
                    or "sincerely" in para.lower()
                    or "looking forward" in para.lower()
                ):
                    # This is likely the closing
                    closing_lines = para.split("\n")
                    html_paragraphs.append('<div class="signature">')
                    for line in closing_lines:
                        if line.strip():
                            html_paragraphs.append(f"<p>{line.strip()}</p>")
                    html_paragraphs.append("</div>")
                else:
                    # Regular greeting
                    html_paragraphs.append(f"<p class='greeting'>{para.strip()}</p>")

            # Regular paragraph
            else:
                # Handle multi-line paragraphs
                if "\n" in para and not para.startswith("["):
                    # Multi-line paragraph - join with <br>
                    formatted_para = "<br>".join(
                        [line.strip() for line in para.split("\n") if line.strip()]
                    )
                    html_paragraphs.append(f"<p>{formatted_para}</p>")
                else:
                    html_paragraphs.append(f"<p>{para.strip()}</p>")

        html_content = "\n".join(html_paragraphs)

        # Create full HTML template
        html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{subject}</title>
    <style>
        body {{ 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }}
        .email-container {{
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .subject-line {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-weight: bold;
            font-size: 16px;
        }}
        .greeting {{
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }}
        p {{
            margin-bottom: 15px;
            text-align: justify;
        }}
        ul {{
            background: #f8f9fa;
            padding: 20px 20px 20px 40px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }}
        li {{
            margin-bottom: 8px;
            font-weight: 500;
        }}
        .signature {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 14px;
        }}
        .signature p {{
            margin-bottom: 5px;
        }}
        .highlight {{
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="subject-line">
            Subject: {subject}
        </div>
        <div class="content">
            {html_content}
        </div>
    </div>
</body>
</html>"""

        return html_template

    def analytics_summary(self) -> Dict[str, Any]:
        """
        Generate analytics summary of candidates and jobs.
        Returns: {countByStage, topSkills, jobStats, skillDemand}
        """
        # Count candidates by recruitment stage
        stages = [candidate.get("stage", "Unknown") for candidate in self.candidates]
        count_by_stage = dict(Counter(stages))

        # Count all skills across candidates
        all_candidate_skills = []
        for candidate in self.candidates:
            skills = candidate.get("skills", [])
            all_candidate_skills.extend(skills)

        # Get top skills with counts
        skill_counter = Counter(all_candidate_skills)
        top_skills = skill_counter.most_common(10)

        # Job analytics
        job_locations = [job.get("location", "Unknown") for job in self.jobs]
        job_location_counts = dict(Counter(job_locations))

        # Skills demand from jobs
        job_skills_demand = []
        for job in self.jobs:
            job_skills_demand.extend(job.get("skillsRequired", []))

        skills_demand = dict(Counter(job_skills_demand).most_common(10))

        # Skills gap analysis (skills in demand vs candidate skills)
        candidate_skill_set = set(all_candidate_skills)
        demand_skill_set = set(job_skills_demand)

        skills_gap = list(demand_skill_set - candidate_skill_set)
        skills_surplus = list(candidate_skill_set - demand_skill_set)

        return {
            "countByStage": count_by_stage,
            "topSkills": top_skills,
            "jobStats": {
                "totalJobs": len(self.jobs),
                "locationBreakdown": job_location_counts,
                "skillsDemand": skills_demand,
            },
            "skillsAnalysis": {
                "inDemand": list(skills_demand.keys())[:5],
                "gap": skills_gap[:5],
                "surplus": skills_surplus[:5],
            },
        }

    def get_shortlists(self) -> Dict[str, List[int]]:
        """Return all saved shortlists."""
        return self.shortlists.copy()

    def get_shortlist_candidates(self, shortlist_name: str) -> List[Dict]:
        """Get candidates from a specific shortlist."""
        if shortlist_name not in self.shortlists:
            return []

        indices = self.shortlists[shortlist_name]
        return [self.candidates[i] for i in indices if 0 <= i < len(self.candidates)]

    def _find_matching_jobs(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Find jobs that match the search criteria.
        Returns: list of matching job objects
        """
        matching_jobs = []

        for job in self.jobs:
            job_matches = True

            # Check location match
            if "location" in filters:
                job_location = job.get("location", "").lower()
                filter_location = filters["location"].lower()
                if job_location != filter_location:
                    job_matches = False

            # Check skills overlap
            if "skills" in filters and filters["skills"]:
                job_skills = [skill.lower() for skill in job.get("skillsRequired", [])]
                filter_skills = [skill.lower() for skill in filters["skills"]]

                # At least one skill should match
                skill_overlap = any(
                    any(
                        filter_skill == job_skill
                        or filter_skill in job_skill
                        or job_skill in filter_skill
                        for job_skill in job_skills
                    )
                    for filter_skill in filter_skills
                )

                if not skill_overlap:
                    job_matches = False

            if job_matches:
                matching_jobs.append(job)

        return matching_jobs

    def _get_job_recommendations(
        self, candidate: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Get job recommendations for a specific candidate based on their skills and location.
        Returns: list of recommended jobs with match scores
        """
        recommendations = []
        candidate_skills = [skill.lower() for skill in candidate.get("skills", [])]
        candidate_location = candidate.get("location", "").lower()

        for job in self.jobs:
            job_skills = [skill.lower() for skill in job.get("skillsRequired", [])]
            job_location = job.get("location", "").lower()

            # Calculate match score
            match_score = 0
            matched_skills = []

            # Skill matching
            for job_skill in job_skills:
                for candidate_skill in candidate_skills:
                    if (
                        job_skill == candidate_skill
                        or job_skill in candidate_skill
                        or candidate_skill in job_skill
                    ):
                        match_score += 1
                        matched_skills.append(job_skill)
                        break

            # Location bonus
            if job_location == candidate_location:
                match_score += 1

            # Only recommend jobs with some skill match
            if match_score > 0:
                recommendations.append(
                    {
                        "job": job,
                        "matchScore": match_score,
                        "matchedSkills": matched_skills,
                        "locationMatch": job_location == candidate_location,
                    }
                )

        # Sort by match score descending
        recommendations.sort(key=lambda x: -x["matchScore"])
        return recommendations[:3]  # Top 3 recommendations


# Global backend instance
_backend = None


def get_backend() -> HRBackend:
    """Get singleton backend instance."""
    global _backend
    if _backend is None:
        _backend = HRBackend()
    return _backend


# Convenience functions for external use
def parse_query(text: str) -> Dict[str, Any]:
    return get_backend().parse_query(text)


def search_candidates(filters: Dict[str, Any]) -> List[Dict[str, Any]]:
    return get_backend().search_candidates(filters)


def save_shortlist(name: str, candidate_indices: List[int]) -> bool:
    return get_backend().save_shortlist(name, candidate_indices)


def draft_email(
    recipients: List[Dict],
    job_title: str = "exciting opportunity",
    tone: str = "friendly",
) -> Dict[str, str]:
    return get_backend().draft_email(recipients, job_title, tone)


def html_template(email: Dict[str, str]) -> str:
    return get_backend().html_template(email)


def analytics_summary() -> Dict[str, Any]:
    return get_backend().analytics_summary()


if __name__ == "__main__":
    # Test the backend functions
    print("🧪 Testing HR Backend...")

    backend = HRBackend()

    # Test query parsing
    query = "Find top 5 React developers in Casablanca, 1-3 years, available this month"
    filters = backend.parse_query(query)
    print(f"Query: {query}")
    print(f"Parsed: {filters}")

    # Test search
    results = backend.search_candidates(filters)
    print(f"\nFound {len(results)} candidates:")
    for result in results[:2]:
        candidate = result["candidate"]
        print(
            f"- {candidate['firstName']} {candidate['lastName']} ({result['score']} points)"
        )
        print(f"  {result['reason']}")

    # Test analytics
    analytics = backend.analytics_summary()
    print(f"\nAnalytics:")
    print(f"Stages: {analytics['countByStage']}")
    print(f"Top skills: {analytics['topSkills']}")

    print("\nBackend tests completed!")
