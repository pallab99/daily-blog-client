/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Form, Input, Modal, Typography, message } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import AuthCode from 'react-auth-code-input';
require('./index.css');

export default function page() {
  const router = useRouter();
  const AuthInputRef = useRef(null);
  const [result, setResult] = useState();
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const handleOnChange = (res: string) => {
    console.log(res);
    //@ts-ignore
    setResult(res);
  };
  useEffect(() => {}, [isCodeExpired]);
  const verifyCode = (values: any) => {
    axios
      .post(
        'https://daily-blog-uz5m.onrender.com/api/user/verify-email',
        values
      )
      .then((response) => {
        console.log(response.data);
        message.success(response.data.message);
        router.push('/login');
      })
      .catch((err) => {
        const msg = err.response.data.message;
        console.log(err.response.data.message);
        if (msg == 'Verification code is not correct') {
          message.error(msg);
        } else if (msg == 'Verification code is expired') {
          message.error(msg);
          setIsCodeExpired(true);
        }
      });
  };
  const resendCode = (values: any) => {
    axios
      .post(
        'https://daily-blog-uz5m.onrender.com/api/user/resent-verification-code',
        values
      )
      .then((response) => {
        console.log(response.data);
        setIsCodeExpired(false);
        setOpenModal(false);
        message.success(response.data.message);
        //@ts-ignore
        AuthInputRef.current?.clear();
      })
      .catch((err) => {
        const msg = err.response.data.message;
        message.error(msg);
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
              //@ts-ignore
              onClick={() => AuthInputRef.current?.clear()}
            >
              Clear
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              Verify
            </Button>
          </div>
        </Form.Item>
        {isCodeExpired ? (
          <Form.Item>
            <div className="resend-code">
              <Typography.Paragraph>This code is expired</Typography.Paragraph>
              <Button
                type="link"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Resend code
              </Button>
            </div>
          </Form.Item>
        ) : null}
        <Modal
          title="Resend Verification Code"
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
          }}
          className="resend-code-modal"
        >
          <Form onFinish={resendCode}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                Resend code
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Form>
    </div>
  );
}
