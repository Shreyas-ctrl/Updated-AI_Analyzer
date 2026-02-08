import os
from supabase import create_client
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def store_analysis(result, filename):
    supabase.table("resume_analysis").insert({
        "filename": filename,
        "job_readiness_score": result["job_readiness_score"],
        "recommended_roles": result["recommended_roles"],
        "learning_path": result["learning_recommendations"],
        "created_at": datetime.utcnow().isoformat()
    }).execute()
