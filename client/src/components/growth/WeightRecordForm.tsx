import React, { useState } from 'react';
import { Form, DatePicker, InputNumber, Input, Button, message } from 'antd';
import { useGrowthStore } from '../../stores/growthStore';
import { WeightRecord } from '../../types/growth';
import dayjs from 'dayjs';

interface WeightRecordFormProps {
  snakeId: number;
  onSuccess?: () => void;
  initialValues?: Partial<WeightRecord>;
}

const WeightRecordForm: React.FC<WeightRecordFormProps> = ({
  snakeId,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addWeightRecord, updateWeightRecord } = useGrowthStore();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const recordData = {
        snakeId,
        date: values.date.format('YYYY-MM-DD'),
        weight: values.weight,
        notes: values.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (initialValues?.id) {
        await updateWeightRecord(initialValues.id, recordData);
        message.success('体重记录更新成功');
      } else {
        await addWeightRecord(recordData);
        message.success('体重记录添加成功');
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
        weight: initialValues?.weight ?? 0,
      }}
    >
      <Form.Item
        name="date"
        label="记录日期"
        rules={[{ required: true, message: '请选择记录日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="weight"
        label="体重（克）"
        rules={[{ required: true, message: '请输入体重' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
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

export default WeightRecordForm; 