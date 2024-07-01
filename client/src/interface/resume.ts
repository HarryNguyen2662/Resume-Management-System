interface Education {
  descriptions: string[];
  _id: string;
  school: string;
  degree: string;
  date: string;
  gpa: string;
}

interface WorkExperience {
  descriptions: string[];
  _id: string;
  company: string;
  jobTitle: string;
}

interface Project {
  descriptions: string[];
  project: string[];
  _id: string;
  date: string;
}

interface Skill {
  descriptions: string[];
  _id: string;
}

interface Custom {
  descriptions: string[];
  _id: string;
}
export interface Resume {
  profile: {
    email: string;
    location: string;
    name: string;
    phone: string;
    url: string;
  };
  educations: Education[];
  workExperiences: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  custom: Custom[];
  id: string;
}
