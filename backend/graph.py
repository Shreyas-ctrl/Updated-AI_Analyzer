from langgraph.graph import StateGraph
from agents.resume_parser import resume_parser_agent
from agents.skill_gap import skill_gap_agent
from agents.job_match import job_match_agent
from agents.learning import learning_agent

graph = StateGraph(dict)

graph.add_node("parse_resume", resume_parser_agent)
graph.add_node("skill_gap", skill_gap_agent)
graph.add_node("job_match", job_match_agent)
graph.add_node("learning", learning_agent)

graph.set_entry_point("parse_resume")
graph.add_edge("parse_resume", "skill_gap")
graph.add_edge("skill_gap", "job_match")
graph.add_edge("job_match", "learning")

resume_graph = graph.compile()
