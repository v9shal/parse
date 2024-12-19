export interface Provider {
  username: string;
  _id?: string;
  status?: string;
}

export interface ProjectDetails {
  _id: string;
  title: string;
  description: string;
  smallDescription?: string;
  status: string;
  deadline?: string;
  skillsRequired?: string[];
  createdBy?: string;
  createdAt?: string;
}

export interface DetailedProjectInfo {
  project: ProjectDetails;
  providers: Provider[];
}