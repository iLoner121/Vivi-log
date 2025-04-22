import React, { useEffect, useState } from 'react';
import { Table, Tabs, Button, Modal, message } from 'antd';
import { useGrowthStore } from '../../stores/growthStore';
import { WeightRecord, SheddingRecord } from '../../types';
import WeightRecordForm from './WeightRecordForm';
import SheddingRecordForm from './SheddingRecordForm';
import dayjs from 'dayjs';

interface GrowthRecordListProps {
  snakeId: number;
}

const GrowthRecordList: React.FC<GrowthRecordListProps> = ({ snakeId }) => {
  const [activeTab, setActiveTab] = useState('weight');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | SheddingRecord | null>(null);

  const {
    weightRecords,
    sheddingRecords,
    loading,
    fetchWeightRecords,
    fetchSheddingRecords,
    deleteWeightRecord,
    deleteSheddingRecord,
  } = useGrowthStore();

  useEffect(() => {
    fetchWeightRecords();
    fetchSheddingRecords();
  }, [fetchWeightRecords, fetchSheddingRecords]);

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: WeightRecord | SheddingRecord) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: WeightRecord | SheddingRecord) => {
    try {
      if (activeTab === 'weight') {
        await deleteWeightRecord(record.id);
        message.success('体重记录删除成功');
      } else {
        await deleteSheddingRecord(record.id);
        message.success('蜕皮记录删除成功');
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const weightColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '体重（克）',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WeightRecord) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const sheddingColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '是否完整',
      dataIndex: 'isComplete',
      key: 'isComplete',
      render: (isComplete: boolean) => (isComplete ? '是' : '否'),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SheddingRecord) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const filteredWeightRecords = weightRecords.filter(record => record.snakeId === snakeId);
  const filteredSheddingRecords = sheddingRecords.filter(record => record.snakeId === snakeId);

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Button type="primary" onClick={handleAdd}>
            添加记录
          </Button>
        }
      >
        <Tabs.TabPane tab="体重记录" key="weight">
          <Table
            columns={weightColumns}
            dataSource={filteredWeightRecords}
            rowKey="id"
            loading={loading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="蜕皮记录" key="shedding">
          <Table
            columns={sheddingColumns}
            dataSource={filteredSheddingRecords}
            rowKey="id"
            loading={loading}
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingRecord ? '编辑记录' : '添加记录'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {activeTab === 'weight' ? (
          <WeightRecordForm
            snakeId={snakeId}
            initialValues={editingRecord as WeightRecord}
            onSuccess={() => {
              setIsModalVisible(false);
              fetchWeightRecords();
            }}
          />
        ) : (
          <SheddingRecordForm
            snakeId={snakeId}
            initialValues={editingRecord as SheddingRecord}
            onSuccess={() => {
              setIsModalVisible(false);
              fetchSheddingRecords();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default GrowthRecordList; 