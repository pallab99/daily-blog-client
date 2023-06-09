//@ts-ignore
'use client';

import { Avatar, Popconfirm, Skeleton, Typography, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import dateFormat from 'dateformat';
import Navbar from '../../../Components/Navbar';
import './index.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function Page({ params }: { params: { id: string } }) {
  const [isBlogloaded, setIsBlogloaded] = useState(false);
  const [blogData, setBlogData] = useState([]) as any;
  useEffect(() => {
    getSingleBlog(params.id);
  }, [params.id]);

  const getSingleBlog = (blogId: string) => {
    setIsBlogloaded(true);
    axios
      .get(`https://daily-blog-uz5m.onrender.com/api/blog/${blogId}`)
      .then((response) => {
        setBlogData(response.data);
        setIsBlogloaded(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const confirm = (blogId: any) => {
    axios
      .delete(`https://daily-blog-uz5m.onrender.com/api/blog/${blogId}`)
      .then((response) => {
        message.success('Blog deleted successfully');
        // seBlogDeleted(true);
      })
      .catch((error) => {
        message.error('SomeThing went wrong');
        // seBlogDeleted(false);
      });
  };

  return (
    <>
      <Navbar></Navbar>
      {blogData?.blog ? (
        <div className="single-blog-div">
          <div className="posted-by">
            <div className="user">
              <Avatar
                src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
                size="small"
              />
              <Typography.Paragraph>
                {blogData?.blog?.userName}
              </Typography.Paragraph>
            </div>
            <Typography.Paragraph>
              on {dateFormat(blogData?.blog?.createdAt, 'dddd, mmmm dS')}
            </Typography.Paragraph>
          </div>
            <Typography.Title>{blogData?.blog?.title}</Typography.Title>
          <Typography.Paragraph style={{ textAlign: 'justify' }}>
            {blogData?.blog?.description}
          </Typography.Paragraph>
        </div>
      ) : (
        <Skeleton avatar paragraph={{ rows: 4 }} className="skeleton-center" />
      )}
    </>
  );
}
