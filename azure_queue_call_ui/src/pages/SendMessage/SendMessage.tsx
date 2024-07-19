import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, Popconfirm, Spin } from 'antd';
import { addSendMessageData, getSendMessageData, getClientData, getMessageData, getQueueData, updateSendMessageData, deleteSendMessageData } from '../../utils/indexedDB';
import axios from 'axios';

const url = "https://login.microsoftonline.com/:AzureAppTenantId/oauth2/token";

const SendMessage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // State for loading spinner

  useEffect(() => {
    fetchData();
    fetchDependencies();
  }, []);

  const fetchData = async () => {
    const result = await getSendMessageData();
    setData(result);
  };

  const fetchDependencies = async () => {
    const clients = await getClientData();
    const messages = await getMessageData();
    const queues = await getQueueData();
    setClients(clients);
    setMessages(messages);
    setQueues(queues);
  };

  const handleOk = async () => {
    form
      .validateFields()
      .then(values => {
        setLoading(true); // Show loading spinner
        if (editingMessage) {
          updateSendMessageData({ ...editingMessage, ...values }).then(() => {
            fetchData();
            form.resetFields();
            setVisible(false);
            setEditingMessage(null);
            
            const tenantId = getTenantId(values.companyName);
            const tokenURL = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
            try {
              let getToken = axios.get(tokenURL);
            } catch (e) {
              console.log("Something went wrong");
            }

            setLoading(false); // Hide loading spinner on success
          }).catch(err => {
            console.error('Update Error:', err);
            setLoading(false); // Hide loading spinner on error
          });
        } else {
          addSendMessageData(values).then(() => {
            fetchData();
            form.resetFields();
            setVisible(false);
            setLoading(false); // Hide loading spinner on success
          }).catch(err => {
            console.error('Add Error:', err);
            setLoading(false); // Hide loading spinner on error
          });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const getTenantId = (companyName : string) => {
    const getCurrentClient : any = clients.filter((client)=>(client.companyName == companyName));
    return getCurrentClient[0].tenantId;
  }

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
    deleteSendMessageData(id).then(() => {
      fetchData();
    }).catch(err => {
      console.error('Delete Error:', err);
    });
  };

  const handleAdd = () => {
    setEditingMessage(null);
    form.resetFields();
    setVisible(true);
  };

  const handleMessageChange = (value: any) => {
    const selectedMessage = messages.find(msg => msg.messageName === value);
    if (selectedMessage) {
      form.setFieldsValue({ messageObject: selectedMessage.messageObject });
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Send Message
      </Button>
      <Modal
        title="Send Message"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
            <Select>
              {clients.map((client, index) => (
                <Select.Option key={index} value={client.companyName}>
                  {client.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="queueName" label="Queue Name" rules={[{ required: true }]}>
            <Select>
              {queues.map((queue, index) => (
                <Select.Option key={index} value={queue.queueName}>
                  {queue.queueName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="messageName" label="Message Name" rules={[{ required: true }]}>
            <Select onChange={handleMessageChange}>
              {messages.map((message, index) => (
                <Select.Option key={index} value={message.messageName}>
                  {message.messageName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="messageObject" label="Message Object" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={loading} tip="Loading...">
        <div className="cards">
          {data.map((item, index) => (
            <div className="card" key={index}>
              <Card
                title={"Company Name : " + item.companyName}
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
                <p><b> Queue Name :</b> {item.queueName}</p>
                <p><b>Message Name : </b> {item.messageName}</p>
                <p><b> Message Object : </b> {item.messageObject}</p>
              </Card>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default SendMessage;
