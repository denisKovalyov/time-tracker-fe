import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Select, Button, Modal } from 'antd';
import TaskForm from '../TaskForm';
import Table from '../Table';
import UserService from '../../services/user';
import ProjectService, { Projects as ProjectsData } from '../../services/project';
import { ProjectContext } from '../../providers/ProjectProvider';
import TaskService, { Task } from "../../services/task";
import dayjs from "dayjs";

import './index.css';

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [edited, setEdited] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectsData>([] as ProjectsData);
  const [userId, setUserId] = useState('');
  const { projectSelected, setProject } = useContext(ProjectContext);

  const fetchTasks = useCallback(async () => {
    if (!userId || !projectSelected) return;

    const tasks = await TaskService.fetchTasks(userId, projectSelected);

    setTasks(tasks.map(({ id, name, type, time, tags, startDate, endDate }: Partial<Task>) => ({
      id,
      key: id,
      name,
      type,
      time,
      tags: tags?.split(','),
      startDate: dayjs(startDate).format('DD-MM-YYYY'),
      endDate: dayjs(endDate).format('DD-MM-YYYY'),
    })));
  }, [userId, projectSelected]);

  useEffect(() => {
    const getProjects = async () => {
      const { id } = await UserService.getUser();
      const projects = await ProjectService.getProjects(id);
      setUserId(id);
      setProjects(projects);
      if (!projectSelected) setProject(projects[0].id);
    };

    getProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (edited) {
      setIsModalOpen(true);
    }
  }, [edited]);

  const handleChange = (project: any) => {
    setProject(project)
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setEdited(null);
    setIsModalOpen(false);
  };

  const handleTaskCreation = () => {
    setIsModalOpen(false);
    setEdited(null);
    fetchTasks();
  };

  const handleTaskDelete = (taskId: string) => {
    TaskService.deleteTask(taskId)
      .then(() => {
        fetchTasks();
      });
  };

  const handleTaskEdit = (task: Task) => {
    setEdited(task);
  };

  return (
    <div className="projectsContainer">
      <div className="panel">
        <Select
          value={projectSelected}
          style={{ width: 120 }}
          onChange={handleChange}
          options={projects.map(({ name, id }) => ({
            label: name,
            value: id,
          }))}
        />
        <Button type="primary" onClick={showModal}>
          Log time
        </Button>
      </div>
      <div className="tableWrapper">
        <Table
          loading={!projectSelected || !userId}
          tasks={tasks}
          onDelete={handleTaskDelete}
          onEdit={handleTaskEdit}
        />
      </div>
      <Modal destroyOnClose title={edited ? 'Update task' : 'Create task'} open={isModalOpen} footer={[]} onCancel={hideModal}>
        <TaskForm
          task={edited}
          onOk={handleTaskCreation}
          onCancel={hideModal}
        />
      </Modal>
    </div>
  );
};

export default Projects;
