/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
//@ts-ignore
'use client';
import { Button, Collapse, Form, Input, Modal, Skeleton } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

const { Panel } = Collapse;
require('./index.css');

export default function page() {
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  //@ts-ignore
  let accessToken:any;

  if (isLocalStorageAvailable) {
    accessToken = secureLocalStorage.getItem('accessToken');
  }
  useEffect(()=>{

    if (!accessToken) {
      router.push('/');
    }
  })
  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMyProfileDetails();
  }, [accessToken, isLoading,router]);
  const getMyProfileDetails = () => {
    setIsUserDataLoaded(true);
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/blog/getBlogsByUser', {
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setIsUserDataLoaded(false);

        // Handle the response data
      })
      .catch((error) => {
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
    try {
      setIsLoading(true);
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
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (error) {
    }
  };
  const handleLogout = () => {
    secureLocalStorage.removeItem('accessToken');
    secureLocalStorage.removeItem('email');
    secureLocalStorage.removeItem('name');
    router.push('/');
  };
  return (
    <>
      <Navbar></Navbar>

      <div className="profile-container">
        <div className="button-div">
          <Button type="primary" onClick={showModal} className="create-btn">
            Create Blog
          </Button>
          <Button danger onClick={handleLogout} className="create-btn">
            LogOut
          </Button>
        </div>
        <Modal
          title="Create Blog"
          open={isModalOpen}
          onCancel={handleCancel}
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
                loading={isLoading}
                className="ant-btn"
              >
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
          userData?.blogs?.map((blogs: any, index: any) => {
            return (
                <Collapse accordion key={index} className="accordion">
                  <Panel header={blogs.title} key={index}>
                    <p>{blogs.description}</p>
                  </Panel>
                </Collapse>
            );
          })
        )}
      </div>
    </>
  );
}
