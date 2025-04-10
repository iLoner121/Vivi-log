import React, { useState } from 'react';
import { Form, DatePicker, Switch, Input, Button, message } from 'antd';
import { useGrowthStore } from '../../stores/growthStore';
import { SheddingRecord } from '../../types/growth';
import dayjs from 'dayjs';

interface SheddingRecordFormProps {
  snakeId: number;
  onSuccess?: () => void;
  initialValues?: Partial<SheddingRecord>;
}

const SheddingRecordForm: React.FC<SheddingRecordFormProps> = ({
  snakeId,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addSheddingRecord, updateSheddingRecord } = useGrowthStore();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const recordData = {
        snakeId,
        date: values.date.format('YYYY-MM-DD'),
        isComplete: values.isComplete,
        notes: values.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (initialValues?.id) {
        await updateSheddingRecord(initialValues.id, recordData);
        message.success('蜕皮记录更新成功');
      } else {
        await addSheddingRecord(recordData);
        message.success('蜕皮记录添加成功');
      }

      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        date: initialValues?.date ? dayjs(initialValues.date) : dayjs(),
        isComplete: initialValues?.isComplete ?? true,
      }}
    >
      <Form.Item
        name="date"
        label="蜕皮日期"
        rules={[{ required: true, message: '请选择蜕皮日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="isComplete"
        label="是否完整蜕皮"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item name="notes" label="备注">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues?.id ? '更新' : '添加'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SheddingRecordForm; 