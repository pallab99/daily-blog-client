/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Avatar, Card, Skeleton, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
const { Meta } = Card;
import { useRouter } from 'next/navigation';

//@ts-ignore
require('./index.css');

export default function index() {
  const router = useRouter();
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

      {!blogData?.blog ? (
        <Spin className="loader" size="large" />
      ) : (
        blogData?.blog?.map((blog: any, index: any) => {
          return (
            <Card
              key={index}
              style={{marginTop: 16 }}
              onClick={() => {
                router.push(`/blog/${blog._id}`);
              }}
            >
              <Skeleton loading={isBlogloaded} avatar active>
                <Meta
                  avatar={
                    <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
                  }
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
