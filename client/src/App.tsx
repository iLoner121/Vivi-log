import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HomeOutlined, BarChartOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import SnakeManagement from './pages/SnakeManagement';
import SnakeDetail from './pages/SnakeDetail';
import GrowthRecord from './pages/GrowthRecord';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import FeedingManagement from './pages/FeedingManagement';
import './index.css';

const { Content, Sider } = Layout;

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={200} theme="light">
            <div className="h-8 m-4 bg-gray-200" />
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
              items={[
                {
                  key: '1',
                  icon: <HomeOutlined />,
                  label: '爬宠管理',
                  onClick: () => window.location.href = '/snakes'
                },
                {
                  key: '2',
                  icon: <AppstoreOutlined />,
                  label: '喂食记录',
                  onClick: () => window.location.href = '/feedings'
                },
                {
                  key: '3',
                  icon: <BarChartOutlined />,
                  label: '统计分析',
                  onClick: () => window.location.href = '/statistics'
                },
                {
                  key: '4',
                  icon: <SettingOutlined />,
                  label: '系统设置',
                  onClick: () => window.location.href = '/settings'
                },
              ]}
            />
          </Sider>
          <Layout>
            <Content style={{ padding: '24px' }}>
              <Routes>
                <Route path="/" element={<SnakeManagement />} />
                <Route path="/snakes" element={<SnakeManagement />} />
                <Route path="/snakes/:id" element={<SnakeDetail />} />
                <Route path="/growth/:snakeId" element={<GrowthRecord />} />
                <Route path="/feedings" element={<FeedingManagement />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App; 