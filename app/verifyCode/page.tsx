/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import AuthCode from 'react-auth-code-input';
require('./index.css');

export default function page() {
  const router = useRouter();
  const AuthInputRef = useRef(null);
  const [result, setResult] = useState();
  const handleOnChange = (res: string) => {
    console.log(res);
    //@ts-ignore
    setResult(res);
  };
  const verifyCode = (values: any) => {
    axios
      .post(
        'https://daily-blog-uz5m.onrender.com/api/user/verify-email',
        values
      )
      .then((response) => {
        console.log(response.data);
        router.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="verification-code-container">
      <Form onFinish={verifyCode}>
        <Form.Item
          name="verificationCode"
          rules={[
            { required: true, message: 'Please input your verificationCode!' },
          ]}
        >
          <AuthCode
            onChange={handleOnChange}
            ref={AuthInputRef}
            inputClassName="code-input"
          />
        </Form.Item>
        <Form.Item>
          <div className="code-button">
            <Button
              danger
              size="large"
              onClick={() => AuthInputRef.current?.clear()}
            >
              Clear
            </Button>
            <Button type="primary" htmlType="submit" size='large'>
              Verify
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
