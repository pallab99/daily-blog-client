/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
//@ts-ignore
'use client';
import { Button, Skeleton } from 'antd';
import axios from 'axios';
//@ts-ignore
import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import CreateBlog from '../../Components/CreateBlog';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
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
  const [width, setWidth] = useState() as any;
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
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

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <div className="button-div">
          <Button type="primary" onClick={showModal} className="create-btn">
            Create Blog
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
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant={width >= 450 ? 'h4' : 'h6'}
                        className="title-style"
                        onClick={() => {
                          router.push(`/blogByUser/${blogs._id}`);
                        }}
                      >
                        {blogs?.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {blogs?.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
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
