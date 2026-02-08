from config.skill_domains import SKILL_DOMAINS

def skill_gap_agent(state):
    resume_skills = set(s.lower() for s in state.get("skills", []))

    matched = 0
    total = 0
    strengths = []
    missing = []

    for domain, domain_skills in SKILL_DOMAINS.items():
        overlap = resume_skills & domain_skills

        if overlap:
            matched += len(overlap)
            total += len(domain_skills)
            strengths.extend(list(overlap))
            missing.extend(list(domain_skills - overlap))

    if total == 0:
        readiness = 0
    else:
        readiness = round((matched / total) * 100)

    return {
        **state,
        "job_readiness_score": readiness,
        "strengths": strengths,
        "missing_skills": missing
    }
