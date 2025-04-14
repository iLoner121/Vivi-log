import React, { useEffect } from 'react'
import { Form, Input, InputNumber, DatePicker, Select, Button, message } from 'antd'
import { useFeedingStore } from '../../stores/feedingStore'
import { Feeding, FeedingFormData } from '../../types/feeding'
import { useSnakeStore } from '../../stores/snakeStore'
import dayjs from 'dayjs'

const { TextArea } = Input

// 食物类型选项
const FOOD_TYPES = [
  { label: '乳鼠', value: '乳鼠' },
  { label: '成体鼠', value: '成体鼠' },
  { label: '其他', value: '其他' }
]

interface FeedingFormProps {
  snakeId?: number
  initialValues?: Partial<Feeding> | null
  onSuccess?: () => void
  onCancel?: () => void
}

const FeedingForm: React.FC<FeedingFormProps> = ({
  snakeId,
  initialValues,
  onSuccess,
  onCancel
}) => {
  const [form] = Form.useForm()
  const { addFeeding, updateFeeding, loading } = useFeedingStore()
  const { snakes, fetchSnakes } = useSnakeStore()

  // 初始化时获取爬宠列表
  useEffect(() => {
    fetchSnakes()
  }, [fetchSnakes])

  const handleSubmit = async (values: FeedingFormData) => {
    try {
      if (initialValues?.id) {
        await updateFeeding(initialValues.id, values)
        message.success('更新喂食记录成功')
      } else {
        await addFeeding(values)
        message.success('添加喂食记录成功')
      }
      onSuccess?.()
    } catch (error) {
      message.error('操作失败')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        date: initialValues?.date ? dayjs(initialValues.date) : dayjs(),
        snakeId: snakeId || initialValues?.snakeId,
        foodType: initialValues?.foodType || '乳鼠',
        quantity: initialValues?.quantity || 1
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="snakeId"
        label="选择爬宠"
        rules={[{ required: true, message: '请选择爬宠' }]}
      >
        <Select
          placeholder="请选择爬宠"
          disabled={!!snakeId}
        >
          {snakes.map(snake => (
            <Select.Option key={snake.id} value={snake.id}>
              {snake.name} ({snake.species})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="喂食日期"
        rules={[{ required: true, message: '请选择喂食日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="foodType"
        label="食物类型"
        rules={[{ required: true, message: '请选择食物类型' }]}
      >
        <Select
          placeholder="请选择食物类型"
          options={FOOD_TYPES}
        />
      </Form.Item>

      <Form.Item
        name="weight"
        label="食物重量(g)"
        rules={[{ required: true, message: '请输入食物重量' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.1}
          placeholder="请输入食物重量"
        />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="数量"
        rules={[{ required: true, message: '请输入数量' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          placeholder="请输入数量"
        />
      </Form.Item>

      <Form.Item
        name="notes"
        label="备注"
      >
        <TextArea rows={4} placeholder="请输入备注信息" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? '更新' : '添加'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default FeedingForm 