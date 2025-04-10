import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import GrowthRecordList from '../components/growth/GrowthRecordList';
import { useSnakeStore } from '../stores/snakeStore';
import { useGrowthStore } from '../stores/growthStore';

const GrowthRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const snakeId = Number(id);

  const { getSnakeById } = useSnakeStore();
  const { calculateGrowthRate, predictNextShedding, getGrowthChartData } = useGrowthStore();

  const snake = getSnakeById(snakeId);

  useEffect(() => {
    if (!snake) {
      message.error('未找到该蛇的信息');
      navigate('/snakes');
    }
  }, [snake, navigate]);

  if (!snake) return null;

  const chartData = getGrowthChartData(snakeId);
  const growthRate = calculateGrowthRate(chartData.weights, chartData.dates);
  const nextShedding = predictNextShedding();

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
          {snake.name} ({snake.code}) 的成长记录
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card title="生长速度">
          <p className="text-lg">
            平均生长速度：{growthRate.toFixed(2)} 克/天
          </p>
        </Card>
        <Card title="蜕皮预测">
          <p className="text-lg">
            预计下次蜕皮时间：{nextShedding ? nextShedding.predictedDate.toLocaleDateString() : '暂无数据'}
          </p>
        </Card>
      </div>

      <Card>
        <GrowthRecordList snakeId={snakeId} />
      </Card>
    </div>
  );
};

export default GrowthRecord; 