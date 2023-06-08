/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
//@ts-ignore
'use client';
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  message,
} from 'antd';
import axios from 'axios';
//@ts-ignore
import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import { useRouter } from 'next/navigation';
const { Panel } = Collapse;
import { ToTopOutlined } from '@ant-design/icons';
require('./index.css');

export default function page() {
  const router = useRouter();
  const [blogTitle, setBlogTitle] = useState() as any;
  const [blogDescription, setBlogDescription] = useState() as any;
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  //@ts-ignore
  let accessToken: any;

  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');
  }
  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  });
  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogDeleted, seBlogDeleted] = useState(false);
  useEffect(() => {
    getMyProfileDetails();
  }, [accessToken, isLoading, router, blogDeleted]);
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
    } catch (error) {}
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    router.push('/');
  };

  const confirm = (blogId: any) => {
    axios
      .delete(`https://daily-blog-uz5m.onrender.com/api/blog/${blogId}`)
      .then((response) => {
        message.success('Blog deleted successfully');
        seBlogDeleted(true);
      })
      .catch((error) => {
        message.error('SomeThing went wrong');
        seBlogDeleted(false);
      });
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
              <Input
                placeholder="Title"
                value={blogTitle}
                onChange={(value: any) => {
                  setBlogTitle(value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[
                { required: true, message: 'Please input your description!' },
              ]}
            >
              <Input.TextArea
                placeholder="Description"
                value={blogDescription}
                onChange={(value: any) => {
                  setBlogDescription(value);
                }}
              />
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
              <Collapse accordion key={blogs?._id} className="accordion">
                <Panel header={blogs?.title} key={blogs?._id}>
                  <div className="blog-wrapper">
                    <p>{blogs?.description}</p>
                    <div className="blog-actions">
                      <ToTopOutlined  onClick={() => {
                          router.push(`/blogByUser/${blogs?._id}`);
                        }}/>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            );
          })
        )}
      </div>
    </>
  );
}
