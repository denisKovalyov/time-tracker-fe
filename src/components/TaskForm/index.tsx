import React, { useContext } from 'react';
import { DatePicker, TimePicker, Button, Form, Input, Select, SelectProps } from 'antd';
import dayjs from 'dayjs';
import UserService from '../../services/user';
import TaskService, { Task } from '../../services/task';
import { ProjectContext } from "../../providers/ProjectProvider";
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

type Props = {
  task: Task | null;
  onOk: Function;
  onCancel: Function;
}

const format = 'HH:mm';
const formatDate = 'DD-MM-YYYY';

const TaskForm = ({ task, onOk, onCancel }: Props) => {
  const [form] = Form.useForm();
  const { projectSelected } = useContext(ProjectContext);

  const onFinish = () => {
    form.validateFields()
      .then(async (values) => {
        const { id: userId } = await UserService.getUser();

        const data = {
          name: values.name,
          type: values.type,
          time: values.time.format('HH:mm'),
          startDate: values.dates[0].format(formatDate),
          endDate: values.dates[1].format(formatDate),
          tags: (values.tags || []).join(','),
          projectId: projectSelected,
          userId,
        } as Partial<Task>;

        let result;
        if (task) {
          delete data.userId;
          delete data.projectId;
          result = await TaskService.updateTask(task.id, data);
        } else {
          result = await TaskService.createTask(data as Task);
        }

        if (result) onOk();
      })
      .catch((error) => {
        console.log('error', error);
      })
  };

  const onCancelClick = () => {
    onCancel();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const options: SelectProps['options'] = [
    { value: 'improvement', label: 'improvement' },
    { value: 'feature', label: 'feature' },
    { value: 'tech debt', label: 'tech debt' },
  ];

  const initialValues = task ? {
    name: task.name,
    type: task.type,
    dates: [dayjs(task.startDate, formatDate), dayjs(task.endDate, formatDate)],
    time: dayjs(task.time, format),
    tags: Array.from(task.tags!).join('') ? task.tags : undefined,
  } : {};

  return (
    <Form
      form={form}
      name="task"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 480 }}
      className="form"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Task name"
        name="name"
        rules={[{ required: true, message: 'Please input task name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="type" label="Task type" rules={[{ required: true, message: 'Please select task type!' }]}>
        <Select
          placeholder="Select task type"
        >
          <Option value="story">Story</Option>
          <Option value="bug">Bug</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Time spent (hh:mm)"
        name="time"
        rules={[{ required: true, message: 'Please input time spent on task!' }]}
      >
        <TimePicker
          format={format}
          showNow={false}
        />
      </Form.Item>

      <Form.Item
        label="Select dates"
        name="dates"
        rules={[{ required: true, message: 'Please select date range!' }]}
      >
        <RangePicker />
      </Form.Item>

      <Form.Item
        label="Select tags"
        name="tags"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select from 0 to 3 tags"
          options={options}
          onChange={(value: string[]) => {
            if (value?.length > 3) {
              value.pop();
            }
          }}
        />
      </Form.Item>

      <Form.Item className="formFooter">
        <Button type="link" htmlType="button" onClick={onCancelClick}>
          Cancel
        </Button>
        <Button type="primary" htmlType="button" onClick={onFinish}>
          {task ? 'Update task' : 'Create task'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
