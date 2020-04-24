import { useState } from 'react';

export const useForm = (initialState = {}, callback) => {
  const [values, setValues] = useState(initialState);

  const onChange = e => {
    // const { name, value } = e.target;
    // setValues(prevValues => ({
    //   ...prevValues, [name]: value
    // }));
    setValues({...values, [e.target.name]: e.target.value});
  }

  const onSubmit = e => {
    e.preventDefault();
    
    callback();
  }

  return {
    onChange,
    onSubmit,
    values
  }
}