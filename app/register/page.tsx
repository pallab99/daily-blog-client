/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { emailRegex } from '@/helper/regex';
import Loader from '../../Components/Preloader';
require('./index.css');

export default function index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const onFinish = async (values: any) => {
    const { email } = values;
    if (!emailRegex.test(email)) {
      message.error('This is not a valid email');
    } else {
      setIsLoading(true);
      try {
        const response = await axios.post(
          'https://daily-blog-uz5m.onrender.com/api/user/register',
          values
        );
        setUserData(response.data);
        setIsLoading(false);
        // router.push('/login');
        router.push('/verifyCode');
      } catch (error: any) {
        if (!error.response.data.success) {
          message.error(error.response.data.message);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="form-div-register">
          <Form onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Sign Up
              </Button>
            </Form.Item>
            <Button
              onClick={() => {
                router.push('/login');
              }}
            >
              Sign In
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}
