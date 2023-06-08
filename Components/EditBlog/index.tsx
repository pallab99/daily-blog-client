/* eslint-disable react-hooks/rules-of-hooks */
'use client';
//@ts-ignore
import { Button, Drawer, Form, Input, Modal, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
require('./index.css');

export default function index(props: any) {
  console.log(props);
  const [title, setTitle] = useState(props?.blogTitle);
  const [description, setDescription] = useState(props?.blogDescription);
  const [isBlogUpdated, setIsBlogUpdated] = useState(false);
  const [isBlogloaded, setIsBlogloaded] = useState(false);
  const [blogData, setBlogData] = useState([]) as any;

  useEffect(() => {
    getBlogById(props?.blogId);
  }, [props.open, props?.blogId]);

  const getBlogById = (blogId: any) => {
    setIsBlogloaded(true);
    axios
      .get(`https://daily-blog-uz5m.onrender.com/api/blog/${blogId}`)
      .then((response) => {
        setBlogData(response.data);
        setIsBlogloaded(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const closeModal = () => {
    props.closeModal(false);
  };
  const onFinish = (values: any) => {
    setIsBlogUpdated(true);
    axios
      .put(`https://daily-blog-uz5m.onrender.com/api/blog/${props?.blogId}`, values)
      .then((response) => {
        message.success('Blog updated successfully');
        closeModal();
        setIsBlogUpdated(false);
      })
      .catch((error) => {
        message.error('Something went wrong');
        setIsBlogUpdated(false);
      });
  };
  return (
    <div className="edit-blog-container">
      <Modal
        open={props.open}
        onCancel={closeModal}
        className="edit-blog-modal"
        title="update blog"
      >
        <Form
          onFinish={onFinish}
          initialValues={{
            title: blogData?.blog?.title,
            description: blogData?.blog?.description,
          }}
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: title ? false : true,
                message: 'Please input your title!',
              },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            name="description"
            rules={[
              {
                required: description ? false : true,
                message: 'Please input your description!',
              },
            ]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="ant-btn"
              style={{ width: '100%' }}
              loading={isBlogUpdated}
            >
              update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
