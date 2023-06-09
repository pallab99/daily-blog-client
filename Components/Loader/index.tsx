'use client';
import React from 'react';
require('./index.css');
export default function index() {
  return (
    <div className="loader-container">
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
}
