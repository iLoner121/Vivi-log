import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Snake } from '../../../shared/types/snake';
import dayjs from 'dayjs';

interface SnakeListProps {
  data: Snake[];
  loading?: boolean;
  onEdit: (snake: Snake) => void;
  onDelete: (id: number) => void;
  onView: (snake: Snake) => void;
}

const SnakeList: React.FC<SnakeListProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns: ColumnsType<Snake> = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => code || '-',
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '物种',
      dataIndex: 'species',
      key: 'species',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === 'male' ? 'blue' : gender === 'female' ? 'pink' : 'default'}>
          {gender === 'male' ? '雄性' : gender === 'female' ? '雌性' : '未知'}
        </Tag>
      ),
    },
    {
      title: '年龄',
      key: 'age',
      width: 100,
      render: (_, record) => {
        const birthDate = dayjs(record.birthDate);
        const age = dayjs().diff(birthDate, 'year');
        return `${age}岁`;
      },
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight?: number) => (weight ? `${weight}g` : '-'),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onView(record)}>
            查看
          </Button>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.id!)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 1000 }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  );
};

export default SnakeList; 