import React from 'react'
import { Button } from 'antd'

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Hello World!</h1>
        <Button type="primary">Welcome to Vivi-log</Button>
      </div>
    </div>
  )
}

export default App 