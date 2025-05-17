import { useState, useCallback, useEffect } from 'react';


const customFetchFunction = async (url, options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) => {
  const res = await fetch(url, options);
  
  const resData = await res.json();
  
  if (!res.ok) {
    // Handle error messages from the server
    const errorMessage = typeof resData === 'object' 
      ? Object.entries(resData).map(([key, value]) => `${key}: ${value}`).join('\n')
      : resData.toString();
    throw new Error(errorMessage);
  }

  return resData;
};

const useHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorMessage: ""
  });
  const [data, setData] = useState([]);
  

  const sendRequest = useCallback(async (requestData = null) => {
    setIsLoading(true);
    
    try {
      let responseData;
      if (requestData) {
        responseData = await customFetchFunction(url, {...options, body: JSON.stringify(requestData)});
        
      } else {
        responseData = await customFetchFunction(url);
      }
      setData(responseData);
    } catch (error) {
      setError({
        isError: true,
        errorMessage: error.message
      });
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }

  }, [url, options]);

  useEffect(()=>{

    if ((options && options.method === 'GET') || (!options)) {
      sendRequest();
    } 
    
  }, [url, options]);

  return {
    isLoading,
    data,
    sendRequest,
    isError: error.isError,
    errorMessage: error.errorMessage
  };
};

export default useHttp;