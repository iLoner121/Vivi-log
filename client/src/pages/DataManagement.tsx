import React, { useState } from 'react';
import { Card, Button, Upload, message, Space, Modal } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSnakeStore } from '../stores/snakeStore';
import { useGrowthStore } from '../stores/growthStore';
import { Snake } from '../types';
import { WeightRecord, SheddingRecord } from '../types/growth';

interface ImportData {
  snakes: Snake[];
  weightRecords: WeightRecord[];
  sheddingRecords: SheddingRecord[];
  exportedAt: string;
}

const DataManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
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

  const handleExport = () => {
    try {
      setLoading(true);
      const data = {
        snakes,
        weightRecords,
        sheddingRecords,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vivi-log-backup-${new Date().toISOString().split('T')[0]}.json`;
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
          if (!data.snakes || !data.weightRecords || !data.sheddingRecords) {
            throw new Error('数据格式错误');
          }

          // 显示确认对话框
          setImportModalVisible(true);
          
          // 保存导入的数据
          const importData = data;
          
          // 确认导入
          const handleConfirmImport = async () => {
            try {
              // 清空现有数据
              for (const snake of snakes) {
                await deleteSnake(snake.id!);
              }
              for (const record of weightRecords) {
                await deleteWeightRecord(record.id);
              }
              for (const record of sheddingRecords) {
                await deleteSheddingRecord(record.id);
              }

              // 导入新数据
              for (const snake of importData.snakes) {
                await addSnake(snake);
              }
              for (const record of importData.weightRecords) {
                await addWeightRecord(record);
              }
              for (const record of importData.sheddingRecords) {
                await addSheddingRecord(record);
              }

              // 刷新数据
              await fetchSnakes();
              await fetchWeightRecords();
              await fetchSheddingRecords();

              message.success('数据导入成功');
              setImportModalVisible(false);
            } catch (error) {
              message.error('数据导入失败');
            }
          };

          return {
            importData,
            handleConfirmImport,
          };
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">数据管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="数据导出">
          <p className="mb-4">导出所有数据为 JSON 格式，包含爬宠信息、体重记录和蜕皮记录。</p>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
          >
            导出数据
          </Button>
        </Card>

        <Card title="数据导入">
          <p className="mb-4">从 JSON 文件导入数据，将覆盖现有数据。</p>
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
              导入数据
            </Button>
          </Upload>
        </Card>
      </div>

      <Modal
        title="确认导入"
        open={importModalVisible}
        onOk={() => {
          const { handleConfirmImport } = handleImport as any;
          handleConfirmImport();
        }}
        onCancel={() => setImportModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>导入数据将覆盖现有数据，此操作不可恢复。是否继续？</p>
      </Modal>
    </div>
  );
};

export default DataManagement; 