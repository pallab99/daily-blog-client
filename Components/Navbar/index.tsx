/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
//@ts-ignore
import { Button, Dropdown, message } from 'antd';
import { UserOutlined, WarningOutlined, BookOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decodeJWT } from '@/helper/jwt';
import axios from 'axios';
require('./index.css');

export default function index() {
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let accessToken: any;
  let email;
  let name: any;
  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');

    // email = localStorage.getItem('email');
    // name = localStorage.getItem('name');
  }
  const jwtInfo: any = decodeJWT(accessToken);
  useEffect(() => {
    if (accessToken) getUserDetails(accessToken);
  }, [accessToken]);
  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

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
  const handleLogout = () => {
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/user/logout')
      .then((response) => {
        message.error(response?.data?.message);
        localStorage.removeItem('accessToken');
        router.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let handleMenuClick = (e: any) => {
    if (e.key === '1') {
      router.push('/blogsCreatedByUser');
    } else if (e.key === '2') {
      handleLogout();
    } else if (e.key === '3') {
      router.push('/me');
    }
  };

  const items = [
    {
      label: 'Blogs',
      key: '1',
      icon: <BookOutlined />,
    },
    {
      label: 'Profile',
      key: '3',
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
              {userData?.user?.name}
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
