import React, { useState } from 'react';
import { Card, Button, Upload, message, Modal, Space, Tabs } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSnakeStore } from '../stores/snakeStore';
import { useGrowthStore } from '../stores/growthStore';
import { useFeedingStore } from '../stores/feedingStore';
import { Snake } from '../types';
import { WeightRecord, SheddingRecord } from '../types/growth';
import { Feeding } from '../types/feeding';

interface ImportData {
  snakes?: Snake[];
  weightRecords?: WeightRecord[];
  sheddingRecords?: SheddingRecord[];
  feedings?: Feeding[];
  exportedAt: string;
}

const DataManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [activeTab, setActiveTab] = useState('snakes');

  const { snakes, fetchSnakes, addSnake, updateSnake, deleteSnake } = useSnakeStore();
  const { 
    weightRecords, 
    sheddingRecords, 
    fetchWeightRecords, 
    fetchSheddingRecords,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    addSheddingRecord,
    updateSheddingRecord,
    deleteSheddingRecord
  } = useGrowthStore();
  const {
    feedings,
    fetchFeedings,
    addFeeding,
    updateFeeding,
    deleteFeeding
  } = useFeedingStore();

  const handleExport = (type: 'all' | 'snakes' | 'growth' | 'feeding') => {
    try {
      setLoading(true);
      let data: ImportData = {
        exportedAt: new Date().toISOString(),
      };

      switch (type) {
        case 'all':
          data = {
            snakes,
            weightRecords,
            sheddingRecords,
            feedings,
            exportedAt: new Date().toISOString(),
          };
          break;
        case 'snakes':
          data = {
            snakes,
            exportedAt: new Date().toISOString(),
          };
          break;
        case 'growth':
          data = {
            weightRecords,
            sheddingRecords,
            exportedAt: new Date().toISOString(),
          };
          break;
        case 'feeding':
          data = {
            feedings,
            exportedAt: new Date().toISOString(),
          };
          break;
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vivi-log-${type}-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('数据导出成功');
    } catch (error) {
      message.error('数据导出失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ImportData;
          
          // 验证数据格式
          if (!data.snakes && !data.weightRecords && !data.sheddingRecords && !data.feedings) {
            throw new Error('数据格式错误');
          }

          setImportData(data);
          setImportModalVisible(true);
        } catch (error) {
          message.error('数据导入失败：文件格式错误');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      message.error('数据导入失败');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleConfirmImport = async () => {
    try {
      if (!importData) return;

      // 根据当前选中的标签页决定导入哪些数据
      switch (activeTab) {
        case 'snakes':
          if (importData.snakes) {
            // 清空现有数据
            for (const snake of snakes) {
              await deleteSnake(snake.id!);
            }
            // 导入新数据
            for (const snake of importData.snakes) {
              await addSnake(snake);
            }
          }
          break;
        case 'growth':
          if (importData.weightRecords || importData.sheddingRecords) {
            // 清空现有数据
            for (const record of weightRecords) {
              await deleteWeightRecord(record.id);
            }
            for (const record of sheddingRecords) {
              await deleteSheddingRecord(record.id);
            }
            // 导入新数据
            if (importData.weightRecords) {
              for (const record of importData.weightRecords) {
                await addWeightRecord(record);
              }
            }
            if (importData.sheddingRecords) {
              for (const record of importData.sheddingRecords) {
                await addSheddingRecord(record);
              }
            }
          }
          break;
        case 'feeding':
          if (importData.feedings) {
            // 清空现有数据
            for (const feeding of feedings) {
              await deleteFeeding(feeding.id);
            }
            // 导入新数据
            for (const feeding of importData.feedings) {
              await addFeeding(feeding);
            }
          }
          break;
      }

      // 刷新数据
      await fetchSnakes();
      await fetchWeightRecords();
      await fetchSheddingRecords();
      await fetchFeedings();

      message.success('数据导入成功');
      setImportModalVisible(false);
      setImportData(null);
    } catch (error) {
      message.error('数据导入失败');
    }
  };

  const handleClearData = (type: 'snakes' | 'growth' | 'feeding') => {
    Modal.confirm({
      title: '确认清理数据',
      content: '此操作将删除所有数据，且不可恢复。是否继续？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          switch (type) {
            case 'snakes':
              for (const snake of snakes) {
                await deleteSnake(snake.id!);
              }
              break;
            case 'growth':
              for (const record of weightRecords) {
                await deleteWeightRecord(record.id);
              }
              for (const record of sheddingRecords) {
                await deleteSheddingRecord(record.id);
              }
              break;
            case 'feeding':
              for (const feeding of feedings) {
                await deleteFeeding(feeding.id);
              }
              break;
          }
          message.success('数据清理成功');
          // 刷新数据
          await fetchSnakes();
          await fetchWeightRecords();
          await fetchSheddingRecords();
          await fetchFeedings();
        } catch (error) {
          message.error('数据清理失败');
        }
      },
    });
  };

  const items = [
    {
      key: 'snakes',
      label: '爬宠档案',
      children: (
        <div className="space-y-4">
          <Card title="数据导出">
            <p className="mb-4">导出所有爬宠档案数据为 JSON 格式。</p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleExport('snakes')}
              loading={loading}
            >
              导出爬宠档案
            </Button>
          </Card>

          <Card title="数据导入">
            <p className="mb-4">从 JSON 文件导入爬宠档案数据，将覆盖现有数据。</p>
            <Upload
              beforeUpload={handleImport}
              showUploadList={false}
              accept=".json"
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
              >
                导入爬宠档案
              </Button>
            </Upload>
          </Card>

          <Card title="数据清理">
            <p className="mb-4">清理所有爬宠档案数据。此操作不可恢复，请谨慎使用。</p>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleClearData('snakes')}
            >
              清理爬宠档案
            </Button>
          </Card>
        </div>
      ),
    },
    {
      key: 'growth',
      label: '成长记录',
      children: (
        <div className="space-y-4">
          <Card title="数据导出">
            <p className="mb-4">导出所有成长记录数据为 JSON 格式。</p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleExport('growth')}
              loading={loading}
            >
              导出成长记录
            </Button>
          </Card>

          <Card title="数据导入">
            <p className="mb-4">从 JSON 文件导入成长记录数据，将覆盖现有数据。</p>
            <Upload
              beforeUpload={handleImport}
              showUploadList={false}
              accept=".json"
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
              >
                导入成长记录
              </Button>
            </Upload>
          </Card>

          <Card title="数据清理">
            <p className="mb-4">清理所有成长记录数据。此操作不可恢复，请谨慎使用。</p>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleClearData('growth')}
            >
              清理成长记录
            </Button>
          </Card>
        </div>
      ),
    },
    {
      key: 'feeding',
      label: '喂食记录',
      children: (
        <div className="space-y-4">
          <Card title="数据导出">
            <p className="mb-4">导出所有喂食记录数据为 JSON 格式。</p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleExport('feeding')}
              loading={loading}
            >
              导出喂食记录
            </Button>
          </Card>

          <Card title="数据导入">
            <p className="mb-4">从 JSON 文件导入喂食记录数据，将覆盖现有数据。</p>
            <Upload
              beforeUpload={handleImport}
              showUploadList={false}
              accept=".json"
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
              >
                导入喂食记录
              </Button>
            </Upload>
          </Card>

          <Card title="数据清理">
            <p className="mb-4">清理所有喂食记录数据。此操作不可恢复，请谨慎使用。</p>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleClearData('feeding')}
            >
              清理喂食记录
            </Button>
          </Card>
        </div>
      ),
    },
    {
      key: 'all',
      label: '全部数据',
      children: (
        <div className="space-y-4">
          <Card title="数据导出">
            <p className="mb-4">导出所有系统数据为 JSON 格式。</p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleExport('all')}
              loading={loading}
            >
              导出全部数据
            </Button>
          </Card>

          <Card title="数据导入">
            <p className="mb-4">从 JSON 文件导入所有系统数据，将覆盖现有数据。</p>
            <Upload
              beforeUpload={handleImport}
              showUploadList={false}
              accept=".json"
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
              >
                导入全部数据
              </Button>
            </Upload>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">数据管理</h1>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />

      <Modal
        title="确认导入"
        open={importModalVisible}
        onOk={handleConfirmImport}
        onCancel={() => {
          setImportModalVisible(false);
          setImportData(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>导入数据将覆盖现有数据，此操作不可恢复。是否继续？</p>
      </Modal>
    </div>
  );
};

export default DataManagement; 