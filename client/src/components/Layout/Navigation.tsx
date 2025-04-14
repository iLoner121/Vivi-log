import React from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/snakes',
      icon: <TeamOutlined />,
      label: '爬宠管理'
    },
    {
      key: '/feedings',
      icon: <AppstoreOutlined />,
      label: '喂食记录'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置'
    }
  ]

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  )
}

export default Navigation 