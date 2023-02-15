import api from '../api';

type Project = {
  id: string;
  name: string;
}

export type Projects = Project[];

class ProjectService {
  private data: Projects = [];
  private loading = false;
  private subscriptions: Function[] = [];

  private setProjects(data: Projects) {
    this.data = [...data];
  };

  private async fetchProjects(userId: string) {
    this.loading = true;
    const projects = await api({ url: '/project/read', args: [userId] });
    this.loading = false;
    this.setProjects(projects);
    this.subscriptions.forEach((fn) => fn(projects));
    this.subscriptions = [];
    return projects;
  }

  getProjects(userId: string): Promise<Projects> {
    if (Object.keys(this.data).length) return Promise.resolve(this.data);
    if (this.loading) {
      return new Promise((resolve) => {
        this.subscriptions.push(resolve);
      });
    }

    return this.fetchProjects(userId);
  };
}

export default new ProjectService();
