from config.skill_domains import SKILL_DOMAINS
from config.domain_roles import DOMAIN_ROLES

def job_match_agent(state):
    skills = set(s.lower() for s in state.get("skills", []))

    domain_scores = {}
    for domain, domain_skills in SKILL_DOMAINS.items():
        overlap = len(skills & domain_skills)
        if overlap > 0:
            domain_scores[domain] = overlap / len(domain_skills)

    recommended_roles = []
    for domain, score in domain_scores.items():
        for role in DOMAIN_ROLES.get(domain, []):
            recommended_roles.append({
                "role": role,
                "match_score": round(score, 2)
            })

    return {
        **state,
        "recommended_roles": recommended_roles,
        "domain_strengths": domain_scores
    }
