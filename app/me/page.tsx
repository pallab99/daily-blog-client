/* eslint-disable react-hooks/rules-of-hooks */
'use client';

require('./index.css');

import Loader from '@/Components/Loader';
import Navbar from '@/Components/Navbar';
import { decodeJWT } from '@/helper/jwt';
import {
  Button,
  FloatButton,
  Form,
  Input,
  Popconfirm,
  Tooltip,
  message,
} from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DeleteFilled } from '@ant-design/icons';
export default function page() {
  const router = useRouter();
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
  const jwtInfo: any = decodeJWT(accessToken);
  const [updateDetailsLoader, setUpdateDetailsLoader] = useState(false);
  useEffect(() => {
    getUserDetails(accessToken);
  }, [accessToken, updateDetailsLoader]);

  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableField, setDisableField] = useState(true);

  const getUserDetails = (accessToken: any) => {
    setIsUserDataLoaded(true);
    axios
      .get(`https://daily-blog-uz5m.onrender.com/api/user/me/${jwtInfo?.id}`, {
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setIsUserDataLoaded(false);
      })
      .catch((error) => {
        setIsUserDataLoaded(false);
      });
  };
  const updateUserDetails = async (values: any) => {
    setUpdateDetailsLoader(true);
    axios
      .put(
        `https://daily-blog-uz5m.onrender.com/api/user/update-user-details/${userData?.user?._id}`,
        values
      )
      .then((response) => {
        message.success('Updated user details');
        setIsUserDataLoaded(false);
        window.location.reload();
      })
      .catch((error) => {
        message.error('Error updating user details');
        setIsUserDataLoaded(false);
      });
  };
  const logOut = () => {
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/user/logout')
      .then((response) => {
        localStorage.removeItem('accessToken');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteAccount = () => {
    axios
      .delete(
        `https://daily-blog-uz5m.onrender.com/api/user/delete-user-account/${userData?.user?._id}`
      )
      .then((response) => {
        message.error('Account deleted successfully');
        router.push('/');
        logOut();
      })
      .catch((error) => {
        message.warning('Error deleting');
      });
  };
  return (
    <>
      <Navbar />
      {userData?.user ? (
        <>
          <div className="me-div">
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                setDisableField(!disableField);
              }}
            >
              {disableField ? 'Enable Field' : 'Disable Field'}
            </Button>
            <Form
              initialValues={{
                name: userData?.user?.name,
                email: userData?.user?.email,
              }}
              onFinish={updateUserDetails}
              style={{ width: '100%' }}
              disabled={disableField}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input you email!',
                  },
                ]}
              >
                <Input placeholder="Email" disabled />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  htmlType="submit"
                  loading={updateDetailsLoader}
                >
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      ) : (
        <Loader />
      )}

      {userData?.user ? (
        <Popconfirm
          title="Delete this blog"
          description="Are you sure to delete this blog?"
          onConfirm={deleteAccount}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <Tooltip title="Delete Account" placement="top" arrow>
            <FloatButton icon={<DeleteFilled />} />
          </Tooltip>
        </Popconfirm>
      ) : null}
    </>
  );
}
