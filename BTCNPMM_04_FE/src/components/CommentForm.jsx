import { Form, Input, Button } from "antd";
import { useState } from "react";

const { TextArea } = Input;

const CommentForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values.comment);
    form.resetFields();
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical" style={{ marginTop: 20 }}>
      <Form.Item
        name="comment"
        label="Viết bình luận"
        rules={[{ required: true, message: "Vui lòng nhập nội dung bình luận!" }]}
      >
        <TextArea rows={3} placeholder="Chia sẻ ý kiến của bạn..." />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Gửi bình luận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
