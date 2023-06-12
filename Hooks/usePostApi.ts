import { useState } from 'react';
import axios from 'axios';
//@ts-ignore
const usePostApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null as any);
  const [isLoading, setIsLoading] = useState(false);

  const sendPostRequest = async (url: any, postData: any) => {
    setIsLoading(true);
    try {
      const response = await axios.post(url, postData);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
      setData(null);
    }
    setIsLoading(false);
  };

  return { data, error, isLoading, sendPostRequest };
};

export default usePostApi;
