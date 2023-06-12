/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
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
          'https://daily-blog-uz5m.onrender.com/api/user/login',
          values
        );
        setUserData(response.data);
        console.log(response.data);
        if (!response.data.user.isVerified) {
          message.error('Please verify your code');
          router.push('/verifyCode');
        } else {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('name', response.data.user.name);
          localStorage.setItem('email', response.data.user.email);
          message.success('Login successful');
          setIsLoading(false);
          router.push('/');
        }
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
        <div className="form-div-login">
          <Form onFinish={onFinish}>
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
            <Form.Item className="forget-pass-btn">
              <Button
                type="link"
                onClick={() => {
                  router.push('/forget-password');
                }}
              >
                Forget Password?
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Sign In
              </Button>
            </Form.Item>
            <Button
              onClick={() => {
                router.push('/register');
              }}
            >
              Sign Up
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}
