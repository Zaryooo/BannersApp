import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';

const nameReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: true,
    };
  }
  if (action.type === 'USER_BLUR') {
    return {
      value: state.value,
      isValid: state.value !== '',
    };
  }
  return { value: '', isValid: true };
};
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: true,
    };
  }
  if (action.type === 'USER_BLUR') {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (pattern.test(state.value)) {
      return {
        value: state.value,
        isValid: true,
      };
    } else {
      return {
        value: state.value,
        isValid: false,
      };
    }
  }
  return { value: '', isValid: true };
};
const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: true,
    };
  }
  if (action.type === 'USER_BLUR') {
    return {
      value: state.value,
      isValid: state.value.trim().length > 8,
    };
  }
  return { value: '', isValid: true };
};

const RegistrationForm = () => {
  const [formValid, setFormValid] = useState(true);

  const navigate = useNavigate();

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: '',
    isValid: true,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: true,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: true,
  });

  const { isValid: nameIsValid } = nameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  const nameChangeHandler = (event) => {
    dispatchName({ type: 'USER_INPUT', val: event.target.value });
  };
  const nameBlurHandler = () => {
    dispatchName({ type: 'USER_BLUR' });
  };
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
    setFormValid(true);
  };
  const emailBlurHandler = () => {
    dispatchEmail({ type: 'USER_BLUR' });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  };
  const passwordBlurHandler = () => {
    dispatchPassword({ type: 'USER_BLUR' });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if(nameIsValid) {
      dispatchName({ type: 'USER_BLUR' });
    }
    if(emailIsValid) {
      dispatchEmail({ type: 'USER_BLUR' });
    }
    if(passwordIsValid) {
      dispatchPassword({ type: 'USER_BLUR' });
    }

    const response = await fetch('http://localhost:5000/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameState.value,
        email: emailState.value,
        password: passwordState.value
      }),
    });

    const data = await response.json();

    if (data.error) {
      setFormValid(false);
      return;
    }
    navigate('/login', { replace: true });

  };

  return (
    <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        onBlur={nameBlurHandler}
        onChange={nameChangeHandler}
        error={!nameIsValid}
        helperText={!nameIsValid && 'Please specify your name'}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        onBlur={emailBlurHandler}
        onChange={emailChangeHandler}
        error={!emailIsValid || !formValid}
        helperText={(!emailIsValid && 'Please specify valid email') || (!formValid && 'This email is already registered!')}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        name="password"
        onBlur={passwordBlurHandler}
        onChange={passwordChangeHandler}
        error={!passwordIsValid}
        helperText={!passwordIsValid && 'Please specify password more than 8 digits'}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 3 }}>
        Submit
      </Button>
    </Box>
  );
};

export default RegistrationForm;
