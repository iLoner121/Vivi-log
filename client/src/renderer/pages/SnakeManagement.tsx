import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SnakeList from '../components/snake/SnakeList';
import SnakeForm from '../components/snake/SnakeForm';
import { useSnakeStore } from '../../stores/snakeStore';
import { Snake, SnakeFormData } from '../../shared/types/snake';
import dayjs from 'dayjs';

const SnakeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSnake, setEditingSnake] = useState<Snake | null>(null);
  const { snakes, loading, fetchSnakes, addSnake, updateSnake, deleteSnake } = useSnakeStore();

  useEffect(() => {
    fetchSnakes();
  }, []);

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
      await deleteSnake(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleView = (snake: Snake) => {
    navigate(`/snakes/${snake.id}`);
  };

  const handleSubmit = async (values: SnakeFormData) => {
    try {
      console.log('正在提交表单, 数据:', values);
      
      let birthDate = '';
      if (values.birthDate) {
        try {
          birthDate = dayjs(values.birthDate).format('YYYY-01-01');
        } catch (error) {
          console.error('日期格式化失败:', error);
          message.error('日期格式错误');
          return;
        }
      }

      const snakeData = {
        ...values,
        birthDate,
      };

      if (editingSnake?.id) {
        console.log('正在更新爬宠, ID:', editingSnake.id);
        await updateSnake(editingSnake.id, snakeData);
        message.success('更新成功');
      } else {
        console.log('正在创建爬宠');
        await addSnake(snakeData);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      // 重新获取列表以刷新数据
      fetchSnakes();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
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