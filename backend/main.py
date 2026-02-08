from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from graph import resume_graph
from utils.pdf_parser import extract_text_from_pdf
from db.supabase_client import store_analysis

app = FastAPI(title="AI Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-resume")
async def analyze_resume(resume: UploadFile = File(...)):
    pdf_bytes = await resume.read()
    resume_text = extract_text_from_pdf(pdf_bytes)
    print("========== RESUME TEXT START ==========")
    print(resume_text[:500])
    print("=========== RESUME TEXT END ===========")
    initial_state = {
    "resume_text": resume_text,
    "filename": resume.filename,
    "skills": [],
    "education": [],
    "experience": [],
    "projects": [],
    "certifications": []
}


    result = resume_graph.invoke({
        "resume_text": resume_text,
        "filename": resume.filename
    })

    store_analysis(result, resume.filename)

    return {
        "job_readiness_score": result.get("job_readiness_score"),
        "recommended_roles": result.get("recommended_roles"),
        "skill_gaps": result.get("missing_skills"),
        "learning_path": result.get("learning_recommendations")
    }
