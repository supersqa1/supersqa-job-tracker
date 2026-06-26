export type ApplicationStatus =
  | "potential"
  | "applied"
  | "in_progress"
  | "final_stage"
  | "hired"
  | "rejected"
  | "withdrawn";

export type RemoteType = "remote" | "hybrid" | "on_site";

export interface JobApplication {
  id: number;
  company_name: string;
  role_title: string;
  status: ApplicationStatus;
  location: string | null;
  remote_type: RemoteType | null;
  salary_range: string | null;
  job_url: string | null;
  description: string | null;
  notes: string | null;
  next_action: string | null;
  next_action_at: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PipelineSummary {
  potential: number;
  applied: number;
  in_progress: number;
  final_stage: number;
  hired: number;
  rejected: number;
  withdrawn: number;
  total: number;
}

export interface JobApplicationCreate {
  company_name: string;
  role_title: string;
  status?: ApplicationStatus;
  location?: string | null;
  remote_type?: RemoteType | null;
  salary_range?: string | null;
  job_url?: string | null;
  description?: string | null;
  notes?: string | null;
  next_action?: string | null;
  next_action_at?: string | null;
  applied_at?: string | null;
}
