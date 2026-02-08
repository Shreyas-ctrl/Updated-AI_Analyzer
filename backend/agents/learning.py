def learning_agent(state):
    recommendations = []

    for skill in state.get("missing_skills", []):
        recommendations.append(f"Build hands-on projects to learn {skill}")

    return {
        **state,
        "learning_recommendations": recommendations
    }
