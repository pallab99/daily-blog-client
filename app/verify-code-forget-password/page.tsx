/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Button, Form, Input, Modal, Typography, message } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loader from '../../Components/Preloader';
require('./index.css');

export default function page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const router = useRouter();
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {}, [isCodeExpired]);
  const verifyCode = (values: any) => {
    axios
      .post(
        'https://daily-blog-uz5m.onrender.com/api/user/forget-password',
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
        if (msg == 'Wrong verification code') {
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
        'https://daily-blog-uz5m.onrender.com/api/user/resend-verification-code-for-forget-password',
        values
      )
      .then((response) => {
        console.log(response.data);
        setIsCodeExpired(false);
        setOpenModal(false);
        message.success(response.data.message);
        //@ts-ignore
      })
      .catch((err) => {
        const msg = err.response.data.message;
        message.error(msg);
      });
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="verification-code-container-forget-pass">
          <Form
            onFinish={verifyCode}
            style={{ width: '100%' }}
            className="resend-code-forget-pass-form"
          >
            <Form.Item
              name="verificationCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your verificationCode!',
                },
              ]}
            >
              <Input placeholder="verification code" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input placeholder="password" />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your confirm password !',
                  },
                ]}
              >
                <Input placeholder="confirm password" />
              </Form.Item>
           
            <Form.Item>
              <div className="code-button">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: '100%' }}
                >
                  Change Password
                </Button>
              </div>
            </Form.Item>
            {isCodeExpired ? (
              <Form.Item>
                <div className="resend-code">
                  <Typography.Paragraph>
                    This code is expired
                  </Typography.Paragraph>
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
                  rules={[
                    { required: true, message: 'Please input your email!' },
                  ]}
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
      )}
    </>
  );
}
