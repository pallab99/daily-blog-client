'use client';
import Navbar from '../Components/Navbar';
import GetAllBlogs from '../Components/GetAllBlogs';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <GetAllBlogs />
      </div>
    </div>
  );
}
