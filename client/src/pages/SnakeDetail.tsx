import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Snake, SnakeFormData } from '../types';
import { useSnakeStore } from '../stores/snakeStore';
import dayjs from 'dayjs';
import SnakeForm from '../components/snake/SnakeForm';

const SnakeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSnakeById, fetchSnakes, loading, updateSnake } = useSnakeStore();
  const [snake, setSnake] = useState<Snake | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadSnake();
  }, [id]);

  const loadSnake = () => {
    if (id) {
      const foundSnake = getSnakeById(Number(id));
      if (foundSnake) {
        setSnake(foundSnake);
      } else {
        message.error('未找到该爬宠信息');
        navigate('/snakes');
      }
    }
  };

  const handleSubmit = async (values: SnakeFormData) => {
    try {
      if (!snake?.id) return;
      
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
      
      const updatedSnake = await updateSnake(snake.id, {
        ...values,
        birthDate,
      });
      
      if (updatedSnake) {
        message.success('更新成功');
        setIsModalVisible(false);
        // 刷新数据
        fetchSnakes();
        loadSnake();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  if (loading || !snake) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/snakes')}>
          返回列表
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          编辑
        </Button>
      </Space>

      <Card title="爬宠详情" className="mb-6">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="编号">
            {(() => {
              console.log('Snake detail code:', snake.code);
              return snake.code || '-';
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="昵称">{snake.name}</Descriptions.Item>
          <Descriptions.Item label="物种">{snake.species}</Descriptions.Item>
          <Descriptions.Item label="基因">{snake.gene || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">
            {snake.gender === 'male' ? '雄性' : snake.gender === 'female' ? '雌性' : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="出生年份">
            {dayjs(snake.birthDate).format('YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="来源">{snake.source || '-'}</Descriptions.Item>
          <Descriptions.Item label="价格">{snake.price ? `¥${snake.price}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="体长">{snake.length ? `${snake.length}cm` : '-'}</Descriptions.Item>
          <Descriptions.Item label="体重">{snake.weight ? `${snake.weight}g` : '-'}</Descriptions.Item>
          <Descriptions.Item label="颜色">{snake.color || '-'}</Descriptions.Item>
          <Descriptions.Item label="花纹特征">{snake.pattern || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(snake.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {dayjs(snake.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="编辑爬宠"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={720}
      >
        <SnakeForm
          initialValues={snake}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>

      <Card title="喂食记录" className="mb-6">
        {/* TODO: 添加喂食记录列表 */}
        <div>暂无喂食记录</div>
      </Card>

      <Card title="体重记录" className="mb-6">
        {/* TODO: 添加体重记录图表 */}
        <div>暂无体重记录</div>
      </Card>

      <Card title="蜕皮记录">
        {/* TODO: 添加蜕皮记录列表 */}
        <div>暂无蜕皮记录</div>
      </Card>
    </div>
  );
};

export default SnakeDetail; 