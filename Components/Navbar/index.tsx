/* eslint-disable react-hooks/rules-of-hooks */
'use client';
//@ts-ignore
import { Button, Dropdown, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
require('./index.css');
export default function index() {
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let accessToken;
  let email;
  let name;
  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');

    email = localStorage.getItem('email');
    name = localStorage.getItem('name');
  }
  let handleMenuClick = (e: any) => {
    if (e.key === '2') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
    } else if (e.key === '1') {
      router.push('/userDetails');
    }
  };

  const items = [
    {
      label: 'profile',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Logout',
      key: '2',
      icon: <UserOutlined />,
      danger: true,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <>
      <div className="navbar-container">
        <div className="nav-button">
          {accessToken && name && email ? (
            <Dropdown.Button
              menu={menuProps}
              placement="bottom"
              icon={<UserOutlined />}
            >
              {name}
            </Dropdown.Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  router.push('/login');
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  router.push('/register');
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
