create table if not exists resume_analysis (
    id uuid primary key default gen_random_uuid(),
    filename text not null,
    job_readiness_score integer,
    recommended_roles jsonb,
    learning_path jsonb,
    created_at timestamptz default now()
);
