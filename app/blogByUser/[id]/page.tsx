//@ts-ignore
'use client';
import { Avatar, Popconfirm, Skeleton, Typography, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dateFormat from 'dateformat';
import Navbar from '../../../Components/Navbar';
require('./index.css');
import EditBlog from '../../../Components/EditBlog';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';

export default function Page({ params }: { params: { id: string } }) {
  const [isBlogloaded, setIsBlogloaded] = useState(false);
  const [blogData, setBlogData] = useState([]) as any;
  const [openEditBlogMOdal, setOpenEditBlogMOdal] = useState(false);
  const router = useRouter();
  const isLocalStorageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let accessToken: any;

  if (isLocalStorageAvailable) {
    accessToken = localStorage.getItem('accessToken');
  }
  if (!accessToken) {
    router.push('/');
  }
  useEffect(() => {
    getSingleBlog(params.id);
  }, [params.id, openEditBlogMOdal]);

  const getSingleBlog = (blogId: string) => {
    setIsBlogloaded(true);
    axios
      .get(`https://daily-blog-uz5m.onrender.com/api/blog/${blogId}`)
      .then((response) => {
        setBlogData(response.data);
        setIsBlogloaded(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const confirm = () => {
    axios
      .delete(`https://daily-blog-uz5m.onrender.com/api/blog/${params.id}`)
      .then((response) => {
        message.success('Blog deleted successfully');
        // seBlogDeleted(true);
        router.push('/userDetails');
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
        <div className="single-blog-div" style={{ maxWidth: '960px' }}>
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
          <div className="title-div">
            <Typography.Title>{blogData?.blog?.title}</Typography.Title>
            {accessToken ? (
              <div className="del-edit-icon">
                <Tooltip title="Edit Blog" placement="top" arrow>
                  <EditOutlined
                    onClick={() => setOpenEditBlogMOdal(true)}
                  ></EditOutlined>
                </Tooltip>
                <Popconfirm
                  title="Delete this blog"
                  description="Are you sure to delete this blog?"
                  onConfirm={confirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Delete Blog" placement="top" arrow>
                    <DeleteOutlined />
                  </Tooltip>
                </Popconfirm>
              </div>
            ) : null}
          </div>
          <Typography.Paragraph style={{ textAlign: 'justify' }}>
            {blogData?.blog?.description}
          </Typography.Paragraph>
        </div>
      ) : (
        <Skeleton avatar paragraph={{ rows: 4 }} className="skeleton-center" />
      )}
      <EditBlog
        open={openEditBlogMOdal}
        closeModal={setOpenEditBlogMOdal}
        blogId={params.id}
        key={params.id}
      ></EditBlog>
    </>
  );
}
