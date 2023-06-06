/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Collapse, Form, Input, Modal, Skeleton, Spin } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
const { Panel } = Collapse;
require('./index.css');

export default function index() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
  );
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [name, setName] = useState(localStorage.getItem('name'));
  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMyProfileDetails();
  }, [accessToken, isLoading]);
  const getMyProfileDetails = () => {
    setIsUserDataLoaded(true);
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/blog/getBlogsByUser', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log('Response:', response.data);
        setUserData(response.data);
        setIsUserDataLoaded(false);

        // Handle the response data
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsUserDataLoaded(false);

        // Handle errors
      });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values: any) => {
    console.log(values);
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://daily-blog-uz5m.onrender.com/api/blog/createSingleBlog',

        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar></Navbar>

      <div className="profile-container">
        <Button type="primary" onClick={showModal} className="create-btn">
          Create Blog
        </Button>
        <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel}>
          <Form onFinish={onFinish}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Input.TextArea placeholder="Title" />
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
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {!userData?.blogs ? (
          <Skeleton
            paragraph={{
              rows: 2,
            }}
          />
        ) : (
          userData?.blogs?.map((blogs: any) => {
            return (
              <div className="blog-items">
                <Collapse accordion>
                  <Panel header={blogs.title} key="1">
                    <p>{blogs.description}</p>
                  </Panel>
                </Collapse>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
