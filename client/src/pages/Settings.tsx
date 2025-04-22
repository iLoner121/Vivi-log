import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, message, Modal, Space, Tabs } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSnakeStore } from '../stores/snakeStore';
import { useGrowthStore } from '../stores/growthStore';
import { useFeedingStore } from '../stores/feedingStore';
import { Snake, WeightRecord, SheddingRecord, Feeding } from '../types';

interface ImportData {
  snakes?: Snake[];
  weightRecords?: WeightRecord[];
  sheddingRecords?: SheddingRecord[];
  feedings?: Feeding[];
  exportedAt: string;
}

const Settings: React.FC = () => {
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

  // 初始化时获取所有数据
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchSnakes(),
          fetchWeightRecords(),
          fetchSheddingRecords(),
          fetchFeedings()
        ]);
      } catch (error) {
        message.error('获取数据失败');
      }
    };
    fetchAllData();
  }, [fetchSnakes, fetchWeightRecords, fetchSheddingRecords, fetchFeedings]);

  const handleExport = async (type: 'all' | 'snakes' | 'growth' | 'feeding') => {
    try {
      setLoading(true);
      
      // 在导出前重新获取最新数据
      await Promise.all([
        fetchSnakes(),
        fetchWeightRecords(),
        fetchSheddingRecords(),
        fetchFeedings()
      ]);

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

      switch (activeTab) {
        case 'all':
          // 清理所有现有数据
          for (const snake of snakes) {
            await deleteSnake(snake.id!);
          }
          for (const record of weightRecords) {
            await deleteWeightRecord(record.id);
          }
          for (const record of sheddingRecords) {
            await deleteSheddingRecord(record.id);
          }
          for (const feeding of feedings) {
            await deleteFeeding(feeding.id);
          }

          // 导入新数据
          if (importData.snakes) {
            for (const snake of importData.snakes) {
              await addSnake(snake);
            }
          }
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
          if (importData.feedings) {
            for (const feeding of importData.feedings) {
              await addFeeding(feeding);
            }
          }
          break;
        case 'snakes':
          if (importData.snakes) {
            // 清理现有数据
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
            // 清理现有数据
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
            // 清理现有数据
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

      // 刷新所有数据
      await Promise.all([
        fetchSnakes(),
        fetchWeightRecords(),
        fetchSheddingRecords(),
        fetchFeedings()
      ]);

      message.success('数据导入成功');
      setImportModalVisible(false);
      setImportData(null);
    } catch (error) {
      console.error('导入失败:', error);
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
          setLoading(true);
          switch (type) {
            case 'snakes':
              // 获取最新数据
              await fetchSnakes();
              // 清理数据
              for (const snake of snakes) {
                await deleteSnake(snake.id!);
              }
              break;
            case 'growth':
              // 获取最新数据
              await Promise.all([fetchWeightRecords(), fetchSheddingRecords()]);
              // 清理数据
              for (const record of weightRecords) {
                await deleteWeightRecord(record.id);
              }
              for (const record of sheddingRecords) {
                await deleteSheddingRecord(record.id);
              }
              break;
            case 'feeding':
              // 获取最新数据
              await fetchFeedings();
              // 清理数据
              for (const feeding of feedings) {
                await deleteFeeding(feeding.id);
              }
              break;
          }

          // 刷新所有数据
          await Promise.all([
            fetchSnakes(),
            fetchWeightRecords(),
            fetchSheddingRecords(),
            fetchFeedings()
          ]);

          message.success('数据清理成功');
        } catch (error) {
          console.error('清理失败:', error);
          message.error('数据清理失败');
        } finally {
          setLoading(false);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      
      <Card title="数据管理" className="mb-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
        />
      </Card>

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

export default Settings; 