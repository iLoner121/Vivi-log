import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import FeedingList from '../components/feeding/FeedingList'
import FeedingForm from '../components/feeding/FeedingForm'
import { useFeedingStore } from '../stores/feedingStore'
import { Feeding } from '../types'

const FeedingManagement: React.FC = () => {
  const { fetchFeedings } = useFeedingStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingFeeding, setEditingFeeding] = useState<Feeding | null>(null)

  useEffect(() => {
    fetchFeedings()
  }, [fetchFeedings])

  const handleAdd = () => {
    setEditingFeeding(null)
    setIsModalVisible(true)
  }

  const handleEdit = (feeding: Feeding) => {
    setEditingFeeding(feeding)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setEditingFeeding(null)
  }

  const handleSuccess = () => {
    handleModalClose()
    fetchFeedings()
    message.success(editingFeeding ? '更新成功' : '添加成功')
  }

  return (
    <div className="p-4">
      <Card
        title="喂食记录管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加记录
          </Button>
        }
      >
        <FeedingList onEdit={handleEdit} />
      </Card>

      <Modal
        title={editingFeeding ? '编辑喂食记录' : '添加喂食记录'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <FeedingForm
          initialValues={editingFeeding}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}

export default FeedingManagement 