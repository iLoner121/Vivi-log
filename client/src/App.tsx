import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import SnakeManagement from './pages/SnakeManagement';
import SnakeDetail from './pages/SnakeDetail';
import GrowthRecord from './pages/GrowthRecord';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import './index.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<SnakeManagement />} />
          <Route path="/snakes" element={<SnakeManagement />} />
          <Route path="/snakes/:id" element={<SnakeDetail />} />
          <Route path="/snakes/:id/growth" element={<GrowthRecord />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 