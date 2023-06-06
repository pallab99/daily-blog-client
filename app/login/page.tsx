/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
require('./index.css');

export default function index() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const onFinish = async (values: any) => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        'https://daily-blog-uz5m.onrender.com/api/user/login',
        values
      );
      setUserData(response.data);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('name', response.data.user.name);
      localStorage.setItem('email', response.data.user.email);

      setIsLoading(false);
      router.push("/")
    } catch (error) {
      console.log("error message",error);

    }
  };



  return (
    <>
    <div className="form-div">
      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      
      </div>
    </>
  );
}
