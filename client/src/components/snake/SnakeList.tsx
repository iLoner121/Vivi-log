import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Snake } from '../../types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const columns: ColumnsType<Snake> = [
    {
      title: '编号',
      dataIndex: 'code',
      width: '10%',
      render: (code: string) => (
        <Tag color="blue">{code || '-'}</Tag>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '物种',
      dataIndex: 'species',
      key: 'species',
      width: '15%',
    },
    {
      title: '基因',
      dataIndex: 'gene',
      key: 'gene',
      width: '15%',
      render: (gene: string) => gene || '-',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: '8%',
      render: (gender: string) => (
        <Tag color={gender === 'male' ? 'blue' : gender === 'female' ? 'pink' : 'default'}>
          {gender === 'male' ? '雄性' : gender === 'female' ? '雌性' : '未知'}
        </Tag>
      ),
    },
    {
      title: '年龄',
      key: 'age',
      width: '8%',
      render: (_, record) => {
        const birthDate = dayjs(record.birthDate);
        const age = dayjs().diff(birthDate, 'year');
        return `${age}岁`;
      },
    },
    {
      title: '体重(g)',
      dataIndex: 'weight',
      key: 'weight',
      width: '8%',
      align: 'right' as const,
      render: (weight?: number) => (weight ? `${weight}` : '-'),
    },
    {
      title: '体长(cm)',
      dataIndex: 'length',
      key: 'length',
      width: '8%',
      align: 'right' as const,
      render: (length?: number) => (length ? `${length}` : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: '28%',
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onView(record)}>
            查看
          </Button>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => navigate(`/growth/${record.id}`)}>
            成长记录
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
      scroll={{ x: 1300 }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  );
};

export default SnakeList; 