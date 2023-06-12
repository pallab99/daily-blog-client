/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
//@ts-ignore
import { Button, Dropdown, message } from 'antd';
import { UserOutlined, WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
require('./index.css');

export default function index() {
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let accessToken;
  let email;
  let name: any;
  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');

    email = localStorage.getItem('email');
    name = localStorage.getItem('name');
  }
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    router.push('/');
  };
  let handleMenuClick = (e: any) => {
    if (e.key === '1') {
      router.push('/userDetails');
    } else if (e.key === '2') {
      handleLogout();
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
      danger: true,
      icon: <WarningOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <>
      <div className="navbar-container">
        <img
          src="/logo.png"
          alt=""
          className="logo"
          onClick={() => {
            router.push('/');
          }}
        />
        <div className="nav-button">
          {accessToken ? (
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
                type="primary"
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
