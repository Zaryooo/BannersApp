import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { Box, TextField, Button } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [responseError, setResponseError] = useState(false);

  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  }

  const onChangeHandler = (e) => {
    setResponseError(false);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if(email === '') {
      setEmailError(true);
      return;
    }
    if(password === '') {
      setPasswordError(true);
      return;
    }

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    const { status, token, time, name } = data;

    if (status === 'ok') {
      const expirationTime = new Date(new Date().getTime() + +time * 1000);
      authCtx.login(token, expirationTime, name);
      navigate('/dashboard', { replace: true });
    } else {
      setResponseError(true);
    }
  };

  return (
    <Box component="form" noValidate onChange={onChangeHandler} onSubmit={onSubmitHandler} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        onChange={onEmailHandler}
        error={emailError || responseError}
        helperText={(emailError && 'Please specify your email') || (responseError && 'Please check your email')}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={onPasswordHandler}
        error={passwordError || responseError}
        helperText={(passwordError && 'Please specify your password') || (responseError && 'Please type correct password')}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 3 }}>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
