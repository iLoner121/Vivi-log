import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SnakeList from '../components/snake/SnakeList';
import SnakeForm from '../components/snake/SnakeForm';
import { useSnakeStore } from '../stores/snakeStore';
import { snakeApi } from '../services/api';
import { Snake, SnakeFormData } from '../../shared/types/snake';

const SnakeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSnake, setEditingSnake] = useState<Snake | null>(null);
  const { snakes, loading, addSnake, updateSnake, deleteSnake, setLoading, setSnakes } = useSnakeStore();

  useEffect(() => {
    loadSnakes();
  }, []);

  const loadSnakes = async () => {
    try {
      setLoading(true);
      const data = await snakeApi.getAll();
      setSnakes(data);
    } catch (error) {
      message.error('加载爬宠列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSnake(null);
    setIsModalVisible(true);
  };

  const handleEdit = (snake: Snake) => {
    setEditingSnake(snake);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await snakeApi.delete(id);
      deleteSnake(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (snake: Snake) => {
    navigate(`/snakes/${snake.id}`);
  };

  const handleSubmit = async (values: SnakeFormData) => {
    try {
      console.log('正在提交表单, 数据:', values);
      setLoading(true);
      const snakeData: Snake = {
        ...values,
        birthDate: new Date(values.birthDate),
      };

      if (editingSnake?.id) {
        console.log('正在更新爬宠, ID:', editingSnake.id);
        const updated = await snakeApi.update(editingSnake.id, snakeData);
        console.log('更新爬宠成功:', updated);
        updateSnake(updated);
        message.success('更新成功');
      } else {
        console.log('正在创建爬宠');
        const created = await snakeApi.create(snakeData);
        console.log('创建爬宠成功:', created);
        addSnake(created);
        message.success('创建成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">爬宠档案管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加爬宠
        </Button>
      </div>

      <SnakeList
        data={snakes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Modal
        title={editingSnake ? '编辑爬宠' : '添加爬宠'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={720}
      >
        <SnakeForm
          initialValues={editingSnake || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default SnakeManagement; 