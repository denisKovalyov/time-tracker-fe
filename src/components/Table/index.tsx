import React, { useState } from 'react';
import { Button, Tag, Table, Space, TableProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Task } from '../../services/task';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';

type Props = {
  loading: boolean;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TableComponent = ({ loading, tasks, onDelete, onEdit }: Props) => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Task>>({});

  const handleChange: TableProps<Task>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Task>);
  };

  const handleDelete = (taskId: string) => {
    onDelete(taskId);
  };

  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: Object.values(tasks).map(({ name }) => ({
        value: name,
        text: name,
      })),
      filteredValue: filteredInfo.name || null,
      // @ts-ignore
      onFilter: (value: string, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [{
        value: 'story',
        text: 'Story',
      }, {
        value: 'bug',
        text: 'Bug',
      }],
      filteredValue: filteredInfo.type || null,
      // @ts-ignore
      onFilter: (value: string, record) => record.type === value,
      sorter: (a, b) => a.type.length - b.type.length,
      sortOrder: sortedInfo.columnKey === 'type' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <span>
          {tags.map((tag) => {
            let color = '';
            if (tag === 'tech debt') {
              color = 'volcano';
            } else if (tag === 'improvement') {
              color = 'green'
            } else {
              color = 'geekblue';
            }

            return (
              <Tag color={color} key={tag} style={{ fontSize: '10px'}}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
      filters: [
        { value: 'improvement', text: 'improvement' },
        { value: 'feature', text: 'feature' },
        { value: 'tech debt', text: 'tech debt' },
      ],
      filteredValue: filteredInfo.tags || null,
      // @ts-ignore
      onFilter: (value: string, record) => record.tags.includes(value),
      ellipsis: true,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => {
        const first = a.time.split(':');
        const second = b.time.split(':');

        return parseInt(first[0]) * 60 + parseInt(first[1]) - parseInt(second[0]) * 60 + parseInt(second[1]);
      },
      sortOrder: sortedInfo.columnKey === 'time' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Date start',
      dataIndex: 'startDate',
      key: 'startDate',
      filters: Object.values(tasks).map(({ startDate }) => ({
        value: startDate,
        text: startDate,
      })),
      filteredValue: filteredInfo.startDate || null,
      // @ts-ignore
      onFilter: (value: string, record) => record.startDate === value,
      sorter: (a, b) => Number(new Date(a.startDate)) - Number(new Date(b.startDate)),
      sortOrder: sortedInfo.columnKey === 'startDate' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Date end',
      dataIndex: 'endDate',
      key: 'endDate',
      filters: Object.values(tasks).map(({ endDate }) => ({
        value: endDate,
        text: endDate,
      })),
      filteredValue: filteredInfo.endDate || null,
      // @ts-ignore
      onFilter: (value: string, record) => record.endDate === value,
      sorter: (a, b) => Number(new Date(a.endDate)) - Number(new Date(b.endDate)),
      sortOrder: sortedInfo.columnKey === 'endDate' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, task) => (
        <Space size="small">
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(task)} />
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(task.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={tasks}
      onChange={handleChange}
    />
  );
};

export default TableComponent;
