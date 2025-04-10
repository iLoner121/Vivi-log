import React, { useState } from 'react';
import { Card, Button, Upload, message, Modal, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { dataManager } from '../services/dataManager';

const Settings: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // 处理数据清理
  const handleClearData = () => {
    Modal.confirm({
      title: '确认清理数据',
      content: '此操作将删除所有系统数据，且不可恢复。是否继续？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setIsClearing(true);
        try {
          const success = dataManager.clearAllData();
          if (success) {
            message.success('数据清理成功');
            // 刷新页面以重新加载数据
            window.location.reload();
          } else {
            message.error('数据清理失败');
          }
        } finally {
          setIsClearing(false);
        }
      },
    });
  };

  // 处理数据导出
  const handleExportData = () => {
    try {
      const success = dataManager.exportData();
      if (success) {
        message.success('数据导出成功');
      } else {
        message.error('数据导出失败');
      }
    } catch (error) {
      message.error('数据导出失败');
    }
  };

  // 处理数据导入
  const handleImportData = async (file: File) => {
    setIsImporting(true);
    try {
      const success = await dataManager.importFromFile(file);
      if (success) {
        message.success('数据导入成功');
        // 刷新页面以重新加载数据
        window.location.reload();
      } else {
        message.error('数据导入失败');
      }
    } finally {
      setIsImporting(false);
    }
    return false; // 阻止自动上传
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      
      <Card title="数据管理" className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <h3 className="text-lg font-medium mb-2">数据导出</h3>
            <p className="text-gray-500 mb-4">
              导出所有系统数据为 JSON 文件，可用于备份或迁移。
            </p>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportData}
            >
              导出数据
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">数据导入</h3>
            <p className="text-gray-500 mb-4">
              从之前导出的 JSON 文件导入数据。导入前会清理现有数据。
            </p>
            <Upload
              accept=".json"
              beforeUpload={handleImportData}
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                loading={isImporting}
              >
                导入数据
              </Button>
            </Upload>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">数据清理</h3>
            <p className="text-gray-500 mb-4">
              清理所有系统数据。此操作不可恢复，请谨慎使用。
            </p>
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isClearing}
              onClick={handleClearData}
            >
              清理数据
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Settings; 