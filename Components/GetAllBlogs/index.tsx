/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Button, Spin } from 'antd';
import axios from 'axios';
import { error } from 'console';
import { useEffect, useState } from 'react';

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
        // console.log(response.data);
        setBlogData(response.data);
        setIsBlogloaded(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(blogData);
  return (
    <>
      {!blogData?.blog ? (
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
      )}
    </>
  );
}
