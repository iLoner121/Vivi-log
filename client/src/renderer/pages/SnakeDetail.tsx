import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Snake } from '../../shared/types/snake';
import { useSnakeStore } from '../stores/snakeStore';
import dayjs from 'dayjs';

const SnakeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { snakes, loading } = useSnakeStore();
  const [snake, setSnake] = useState<Snake | null>(null);

  useEffect(() => {
    const foundSnake = snakes.find((s) => s.id === Number(id));
    if (foundSnake) {
      setSnake(foundSnake);
    } else {
      message.error('未找到该爬宠信息');
      navigate('/snakes');
    }
  }, [id, snakes, navigate]);

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
          onClick={() => navigate(`/snakes/${id}/edit`)}
        >
          编辑
        </Button>
      </Space>

      <Card title="爬宠详情" className="mb-6">
        <Descriptions column={2}>
          <Descriptions.Item label="编号">{snake.code}</Descriptions.Item>
          <Descriptions.Item label="昵称">{snake.name}</Descriptions.Item>
          <Descriptions.Item label="物种">{snake.species}</Descriptions.Item>
          <Descriptions.Item label="基因">{snake.gene || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">
            {snake.gender === 'male' ? '雄性' : snake.gender === 'female' ? '雌性' : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="出生日期">
            {dayjs(snake.birthDate).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="来源">{snake.source}</Descriptions.Item>
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