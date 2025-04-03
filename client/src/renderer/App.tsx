import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import SnakeManagement from './pages/SnakeManagement';
import SnakeDetail from './pages/SnakeDetail';
import Settings from './pages/Settings';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} theme="light">
          <div className="p-4 text-xl font-bold">Vivi-log</div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['snakes']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="snakes" icon={<DatabaseOutlined />}>
              <Link to="/snakes">爬宠管理</Link>
            </Menu.Item>
            <Menu.Item key="statistics" icon={<LineChartOutlined />}>
              <Link to="/statistics">统计分析</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              <Link to="/settings">设置</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            <Routes>
              <Route path="/" element={<div>首页</div>} />
              <Route path="/snakes" element={<SnakeManagement />} />
              <Route path="/snakes/:id" element={<SnakeDetail />} />
              <Route path="/statistics" element={<div>统计分析</div>} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App; 