import React from 'react'
import { Layout as AntLayout } from 'antd'
import Navigation from './Navigation'
import './styles.css'

const { Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div className="logo">Vivi-log</div>
        <Navigation />
      </Sider>
      <AntLayout>
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout 