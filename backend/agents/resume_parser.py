def resume_parser_agent(state):
    text = state["resume_text"].lower()

    skills = []
    for skill in ["python", "sql", "excel", "machine learning", "statistics"]:
        if skill in text:
            skills.append(skill.title())
    

    return {
        **state,
        "skills": skills,
        "education": ["Not Provided"],
        "experience": ["Not Provided"],
        "projects": ["Not Provided"],
        "certifications": ["Not Provided"]
    }
