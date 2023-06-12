/* eslint-disable react-hooks/rules-of-hooks */
'use client';
//@ts-ignore
import { useRouter } from 'next/navigation';
require('./index.css');

import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React from 'react';

export default function page() {
    const router=useRouter()
  const sendCode = (values: any) => {
    axios
      .post(
        'https://daily-blog-uz5m.onrender.com/api/user/emailForForgetPassword',
        values
      )
      .then((response) => {
        console.log(response.data);
        message.success(response.data.message);
        //@ts-ignore
        router.push('/verify-code-forget-password')
      })
      .catch((err) => {
        const msg = err.response.data.message;
        message.error(msg);
      });
  };
  return (
    <div className="forget-pass-container">
      <Form onFinish={sendCode} style={{width:'100%'}}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Resend code
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
