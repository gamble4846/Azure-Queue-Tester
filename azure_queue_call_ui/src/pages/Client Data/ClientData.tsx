import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { addClientData, getClientData, updateClientData, deleteClientData } from '../../utils/indexedDB';
import "../common.css";

const ClientData: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [editingClient, setEditingClient] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getClientData();
    setData(result);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (editingClient) {
          updateClientData({ ...editingClient, ...values });
        } else {
          addClientData(values);
        }
        fetchData();
        form.resetFields();
        setVisible(false);
        setEditingClient(null);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingClient(null);
    form.resetFields();
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    form.setFieldsValue(client);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteClientData(id);
    fetchData();
  };

  const handleAdd = () => {
    setEditingClient(null);
    form.resetFields();
    setVisible(true);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Client Data
      </Button>
      <Modal
        title="Client Data"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="grantType" label="Grant Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="clientId" label="Client ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="clientSecret" label="Client Secret" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="resource" label="Resource" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tenantId" label="Tenant ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <div className='cards'>
        {data.map((item, index) => (
          <div className='card' key={index}>
            <Card title={item.companyName} extra={
              <>
                <Button type="link" onClick={() => handleEdit(item)}>Edit</Button>
                <Popconfirm
                  title="Are you sure to delete this client?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>Delete</Button>
                </Popconfirm>
              </>
            }>
              <p><b>Grant Type:</b> {item.grantType}</p>
              <p><b>Client ID:</b> {item.clientId}</p>
              <p><b>Client Secret:</b> {'*'.repeat(item.clientSecret.length)}</p>
              <p><b>Resource:</b> {item.resource}</p>
              <p><b>Tenant ID:</b> {item.tenantId}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientData;
