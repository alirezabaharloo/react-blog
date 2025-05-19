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
    let errorMessage;
    if (typeof resData === 'object') {
      // If the error is an object, create key-value pairs
      errorMessage = Object.entries(resData).reduce((acc, [key, value]) => {
        // If value is an array, take the first element
        const errorValue = Array.isArray(value) ? value[0] : value;
        acc[key] = errorValue;
        return acc;
      }, {});
    } else {
      // If it's a simple string/number, keep it as is
      errorMessage = resData;
    }
    setError({
      isError: true,
      errorMessage: errorMessage
    })
  }

  return resData;
};

const useHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorMessage: null
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
      setError({ isError: false, errorMessage: null });
    } catch (error) {
      throw new error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
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