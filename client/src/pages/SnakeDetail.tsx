import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined, LineChartOutlined } from '@ant-design/icons';
import { Snake, SnakeFormData, WeightRecord, SheddingRecord } from '../types';
import { useSnakeStore } from '../stores/snakeStore';
import { useGrowthStore } from '../stores/growthStore';
import dayjs from 'dayjs';
import SnakeForm from '../components/snake/SnakeForm';

const SnakeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSnakeById, fetchSnakes, loading, updateSnake } = useSnakeStore();
  const { 
    getWeightRecordsBySnakeId, 
    getSheddingRecordsBySnakeId, 
    predictNextShedding,
    fetchWeightRecords,
    fetchSheddingRecords
  } = useGrowthStore();
  const [snake, setSnake] = useState<Snake | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadSnake();
    if (id) {
      // 获取最新的体重和蜕皮记录
      fetchWeightRecords();
      fetchSheddingRecords();
    }
  }, [id, fetchWeightRecords, fetchSheddingRecords]);

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

  const weightRecords = getWeightRecordsBySnakeId(snake.id);
  const sheddingRecords = getSheddingRecordsBySnakeId(snake.id);
  const nextShedding = predictNextShedding(snake.id);

  // 按日期降序排序，获取最新记录
  const latestWeight = weightRecords.length > 0 
    ? [...weightRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const latestShedding = sheddingRecords.length > 0
    ? [...sheddingRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/snakes')}
        >
          返回
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          {snake.name} ({snake.code}) 的详细信息
        </h1>
      </div>

      <div className="space-y-4">
        <Card title="基本信息">
          <Descriptions column={2}>
            <Descriptions.Item label="昵称">
              {snake.name}
            </Descriptions.Item>
            <Descriptions.Item label="编号">
              {snake.code}
            </Descriptions.Item>
            <Descriptions.Item label="物种">
              {snake.species}
            </Descriptions.Item>
            <Descriptions.Item label="基因">
              {snake.gene || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="性别">
              {snake.gender}
            </Descriptions.Item>
            <Descriptions.Item label="出生日期">
              {snake.birthDate ? dayjs(snake.birthDate).format('YYYY-MM-DD') : '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="来源">
              {snake.source}
            </Descriptions.Item>
            <Descriptions.Item label="价格">
              {snake.price ? `¥${snake.price}` : '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(snake.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(snake.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title="成长记录"
          extra={
            <Button
              type="primary"
              icon={<LineChartOutlined />}
              onClick={() => navigate(`/growth/${snake.id}`)}
            >
              查看成长记录
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">最近体重记录</h3>
              <p>
                {latestWeight 
                  ? `${dayjs(latestWeight.date).format('YYYY-MM-DD')}: ${latestWeight.weight}g`
                  : '暂无体重记录'}
              </p>
            </div>
            <div>
              <h3 className="font-medium">最近蜕皮记录</h3>
              <p>
                {latestShedding 
                  ? `${dayjs(latestShedding.date).format('YYYY-MM-DD')}: ${latestShedding.isComplete ? '完整' : '不完整'}`
                  : '暂无蜕皮记录'}
              </p>
            </div>
            <div>
              <h3 className="font-medium">预计下次蜕皮</h3>
              <p>
                {nextShedding 
                  ? `${dayjs(nextShedding.predictedDate).format('YYYY-MM-DD')} (置信度: ${(nextShedding.confidence * 100).toFixed(0)}%)`
                  : '暂无预测数据'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Space className="mb-4 mt-4">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          编辑
        </Button>
      </Space>

      <Modal
        title="编辑爬宠信息"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <SnakeForm
          initialValues={snake}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default SnakeDetail; 