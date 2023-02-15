import api from '../api';

export type Task = {
  id: string;
  name: string;
  type: string;
  time: string;
  startDate: string;
  endDate: string;
  projectId: string;
  tags?: string;
  userId: string;
}

class TaskService {
  async fetchTasks(userId: string, projectId: string) {
    return await api({ url: '/task/read', args: [userId, projectId] });
  }

  async createTask(task: Task) {
    try {
      return await api({ url: '/task/create', args: task });
    } catch (e) {
      console.error(e);
    }
  }

  async updateTask(taskId: string, task: Partial<Task>) {
    try {
      return await api({ url: '/task/update', args: [taskId, task] });
    } catch (e) {
      console.error(e);
    }
  }

  async deleteTask(taskId: string) {
    try {
      return await api({ url: '/task/delete', args: taskId });
    } catch (e) {
      console.error(e);
    }
  }
}

export default new TaskService();
