'use client';
import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

require('./index.css');

export default function index() {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 45,
      }}
      spin
    />
  );
  return (
    <div className="spin-container">
      <Spin size="large" indicator={antIcon}></Spin>
    </div>
  );
}
