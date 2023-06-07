/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Avatar, Button, Card, Skeleton, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
const { Meta } = Card;
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

//@ts-ignore
require('./index.css');

export default function index() {
  const [isBlogloaded, setIsBlogloaded] = useState(false);
  const [blogData, setBlogData] = useState([]) as any;
  useEffect(() => {
    getAllBlogs();
  }, []);
  const getAllBlogs = () => {
    setIsBlogloaded(true);
    axios
      .get('https://daily-blog-uz5m.onrender.com/api/blog/getAllBlogs')
      .then((response) => {
        setBlogData(response.data);
        setIsBlogloaded(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {/* {!blogData?.blog ? (
        <Spin className='loader' size='large'/>
      ) : (
        blogData?.blog?.map((blog: any) => {
          return (
            <div className="blog-items" key={blog?._id}>
              <div className="items">
                <h1>{blog?.title}</h1>
                <p>{blog?.description}</p>
                <p>{blog?.userName}</p>
              </div>
            </div>
          );
        })
      )} */}
  {!blogData?.blog ? (
        <Spin className='loader' size='large'/>
      ) : (
        blogData?.blog?.map((blog: any,index:any) => {
          return (
            <Card key={index}
            style={{ width: 300, marginTop: 16 }}
          >
            <Skeleton loading={isBlogloaded} avatar active>
              <Meta
                avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />}
                title={blog.title}
                description={blog.description}
              />
            </Skeleton>
          </Card>
          );
        })
      )}  
     
    </>
  );
}
