import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { addQueueData, getQueueData, updateQueueData, deleteQueueData } from '../../utils/indexedDB';
import "../common.css";

const Queue: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [editingQueue, setEditingQueue] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getQueueData();
    setData(result);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (editingQueue) {
          updateQueueData({ ...editingQueue, ...values });
        } else {
          addQueueData(values);
        }
        fetchData();
        form.resetFields();
        setVisible(false);
        setEditingQueue(null);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingQueue(null);
    form.resetFields();
  };

  const handleEdit = (queue: any) => {
    setEditingQueue(queue);
    form.setFieldsValue(queue);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteQueueData(id);
    fetchData();
  };

  const handleAdd = () => {
    setEditingQueue(null);
    form.resetFields();
    setVisible(true);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Queue
      </Button>
      <Modal
        title="Queue"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="storageAccountName" label="Storage Account Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="queueName" label="Queue Name" rules={[{ required: true }]}>
            <Input />
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
                    title="Are you sure to delete this queue?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>Delete</Button>
                  </Popconfirm>
                </>
              }
            >
              <p><b>Storage Account Name : </b> {item.storageAccountName} </p>
              <p><b>Queue Name : </b>{item.queueName}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
