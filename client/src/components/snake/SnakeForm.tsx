import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import { Snake, SnakeFormData } from '../../types';
import dayjs from 'dayjs';

interface SnakeFormProps {
  initialValues?: Snake;
  onSubmit: (values: SnakeFormData) => void;
  onCancel: () => void;
}

const SnakeForm: React.FC<SnakeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: SnakeFormData) => {
    onSubmit(values);
  };

  React.useEffect(() => {
    if (initialValues) {
      try {
        const { code, ...restValues } = initialValues;
        const formattedValues = {
          ...restValues,
          birthDate: initialValues.birthDate ? dayjs(initialValues.birthDate) : null,
        };
        form.setFieldsValue(formattedValues);
      } catch (error) {
        console.error('设置表单值失败:', error);
      }
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="昵称"
        rules={[{ required: true, message: '请输入昵称' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="species"
        label="物种"
        rules={[{ required: true, message: '请输入物种' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="gene" label="基因">
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: '请选择性别' }]}
      >
        <Select>
          <Select.Option value="male">雄性</Select.Option>
          <Select.Option value="female">雌性</Select.Option>
          <Select.Option value="unknown">未知</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="birthDate"
        label="出生年份"
        rules={[{ required: true, message: '请选择出生年份' }]}
      >
        <DatePicker picker="year" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="source" label="来源">
        <Input />
      </Form.Item>

      <Form.Item name="price" label="价格">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="length" label="体长">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="weight" label="体重">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="color" label="颜色">
        <Input />
      </Form.Item>

      <Form.Item name="pattern" label="花纹特征">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SnakeForm; 