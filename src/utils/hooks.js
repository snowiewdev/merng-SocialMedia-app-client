import { useState } from 'react';

//used to manage state update in forms 
export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  }

  return {
    onChange,
    onSubmit,
    values
  };
} 