'use client';

import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';

//@ts-ignore
require('./index.css');
export default function index(props: any) {
    const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  //@ts-ignore
  let accessToken: any;

  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');
  }
  const onFinish = async (values: any) => {
    try {
        props?.setIsLoading(true);
      const response = await axios.post(
        'https://daily-blog-uz5m.onrender.com/api/blog/createSingleBlog',

        values,
        {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
        props?.setIsLoading(false);
      props?.setIsModalOpen(false);
    } catch (error) {}
  };

  const closeModal=()=>{
    props?.setIsModalOpen(false)
  }

  return (
    <>
      <Modal
        title="Create Blog"
        open={props?.open}
        onCancel={closeModal}
        className="create-blog-modal"
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please input your title!' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            name="description"
            rules={[
              { required: true, message: 'Please input your description!' },
            ]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={props?.isLoading}
              className="ant-btn"
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
