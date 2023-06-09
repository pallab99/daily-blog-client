/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
//@ts-ignore
'use client';
import { Button, Collapse, Skeleton, message } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import CreateBlog from '../../Components/CreateBlog';
import { useRouter } from 'next/navigation';
const { Panel } = Collapse;
import { ToTopOutlined } from '@ant-design/icons';
require('./index.css');

export default function page() {
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  //@ts-ignore
  let accessToken: any;

  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');
  }
  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  });
  const [userData, setUserData] = useState([]) as any[];
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogDeleted, seBlogDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      getMyProfileDetails();
    }
  }, [accessToken, isLoading, router, blogDeleted, isModalOpen]);
  const getMyProfileDetails = () => {
    setIsUserDataLoaded(true);
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/blog/getBlogsByUser', {
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
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    router.push('/');
  };

  return (
    <>
      <Navbar></Navbar>

      <div className="profile-container">
        <div className="button-div">
          <Button type="primary" onClick={showModal} className="create-btn">
            Create Blog
          </Button>
          <Button danger onClick={handleLogout} className="create-btn">
            LogOut
          </Button>
        </div>
        {!userData?.blogs ? (
          <Skeleton
            paragraph={{
              rows: 2,
            }}
          />
        ) : (
          userData?.blogs?.map((blogs: any, index: any) => {
            return (
              <Collapse accordion key={blogs?._id} className="accordion">
                <Panel header={blogs?.title} key={blogs?._id}>
                  <div className="blog-wrapper">
                    <p>{blogs?.description}</p>
                    <div className="blog-actions">
                      <ToTopOutlined
                        onClick={() => {
                          router.push(`/blogByUser/${blogs?._id}`);
                        }}
                      />
                    </div>
                  </div>
                </Panel>
              </Collapse>
            );
          })
        )}
        <CreateBlog
          open={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        ></CreateBlog>
      </div>
    </>
  );
}
