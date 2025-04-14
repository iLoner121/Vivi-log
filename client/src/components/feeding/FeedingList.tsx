import React, { useEffect } from 'react'
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd'
import { useFeedingStore } from '../../stores/feedingStore'
import { useSnakeStore } from '../../stores/snakeStore'
import { Feeding } from '../../types/feeding'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface FeedingListProps {
  snakeId?: number
  onEdit?: (feeding: Feeding) => void
}

const FeedingList: React.FC<FeedingListProps> = ({
  snakeId,
  onEdit
}) => {
  const { feedings, loading: feedingLoading, deleteFeeding, getFeedingsBySnakeId } = useFeedingStore()
  const { snakes, loading: snakeLoading, fetchSnakes } = useSnakeStore()
  
  // 初始化时获取爬宠数据
  useEffect(() => {
    fetchSnakes()
  }, [fetchSnakes])
  
  const dataSource = snakeId ? getFeedingsBySnakeId(snakeId) : feedings
  
  // 获取爬宠信息
  const getSnakeInfo = (snakeId: number) => {
    const snake = snakes.find(s => s.id === snakeId)
    return snake ? `${snake.name} (${snake.species})` : '未知爬宠'
  }
  
  const columns = [
    {
      title: '爬宠',
      dataIndex: 'snakeId',
      key: 'snakeId',
      width: '15%',
      render: (snakeId: number) => (
        <Tag color="blue">{getSnakeInfo(snakeId)}</Tag>
      )
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: '10%',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '食物类型',
      dataIndex: 'foodType',
      key: 'foodType',
      width: '10%',
      render: (foodType: string) => (
        <Tag color="green">{foodType}</Tag>
      )
    },
    {
      title: '重量(g)',
      dataIndex: 'weight',
      key: 'weight',
      width: '10%',
      align: 'right' as const
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
      align: 'right' as const
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      width: '25%',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      fixed: 'right' as const,
      render: (_: any, record: Feeding) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={async () => {
              try {
                await deleteFeeding(record.id)
                message.success('删除成功')
              } catch (error) {
                message.error('删除失败')
              }
            }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      loading={feedingLoading || snakeLoading}
      scroll={{ x: 1000 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      }}
    />
  )
}

export default FeedingList 