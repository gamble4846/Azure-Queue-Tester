import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { addMessageData, getMessageData, updateMessageData, deleteMessageData } from '../../utils/indexedDB';
import "../common.css";

const Message: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMessageData();
    setData(result);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (editingMessage) {
          updateMessageData({ ...editingMessage, ...values });
        } else {
          addMessageData(values);
        }
        fetchData();
        form.resetFields();
        setVisible(false);
        setEditingMessage(null);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingMessage(null);
    form.resetFields();
  };

  const handleEdit = (message: any) => {
    setEditingMessage(message);
    form.setFieldsValue(message);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMessageData(id);
    fetchData();
  };

  const handleAdd = () => {
    setEditingMessage(null);
    form.resetFields();
    setVisible(true);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Message
      </Button>
      <Modal
        title="Message"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="messageName" label="Message Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="messageObject" label="Message Object" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <div className='cards'>
        {data.map((item, index) => (
          <div className='card' key={index}>
            <Card
              extra={
                <>
                  <Button type="link" onClick={() => handleEdit(item)}>Edit</Button>
                  <Popconfirm
                    title="Are you sure to delete this message?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>Delete</Button>
                  </Popconfirm>
                </>
              }
            >
              <p><b>Message Name: </b>{item.messageName}</p>
              <p><b>Message Object: </b> {item.messageObject}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;
