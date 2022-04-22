import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Alert,
  styled,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import axios from 'axios';

const BannerForm = (props) => {
  const Input = styled('input')({
    display: 'none',
  });

  const [file, setFile] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileIsEmpty, setFileIsEmpty] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  const [edit, setEdit] = useState(false);

  const item = props.onEdit;
  useEffect(() => {
    if (item.id) {
      setTitle(item.title);
      setFile(item.image);
      setEdit(true);
    } else {
      setTitle('');
      setFile('');
      setEdit(false);
    }
  }, [item]);

  const onTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleError(false);
  };

  const onFileUpload = (e) => {
    if (e.target.files.length > 1) {
      setFileError(true);
      setFile('');
      return;
    }
    if (e.target.files[0].size > 1024 * 1024 * 3) {
      setFileError(true);
      setFile('');
      return;
    }
    console.log(e.target.files[0].type);
    if(e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/png') {
      setFileError(true);
      setFile('');
      return;
    }
    setFile(e.target.files[0]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (title === '') {
      setTitleError(true);
      return;
    }
    if (!edit && file.length === 0) {
      setFileIsEmpty(true);
      return;
    }

    const formData = new FormData();

    let url = 'http://localhost:5000/api/banners';
    if (edit) {
      url = 'http://localhost:5000/api/update';
      formData.append('bannerId', item.id);
    }

    formData.append('upload_image', file);
    formData.append('title', title);

    axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': localStorage.getItem('token'),
      },
      data: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          setTitle('');
          setFile('');
          setEdit(false);
          props.onAdd();
        } else {
          console.log('Error occurred');
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const onCancelHandler = () => {
    setTitle('');
    setFile('');
    props.onCancel();
  };

  return (
    <Grid item xs={2} sm={2} md={4}>
      <Card sx={{ px: 3, py: 2 }}>
        <CardContent sx={{ p: 1 }}>
          <Typography component="h3" variant="h4" align="center">
            {!edit && 'New Banner'}
            {edit && 'Edit Banner'}
          </Typography>
        </CardContent>
        <Box component="form" noValidate onSubmit={onSubmitHandler}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus={true}
            value={title}
            onChange={onTitleChange}
            error={titleError}
            helperText={titleError && 'Please specify your title'}
          />
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={onFileUpload}
              required
            />
            <Button
              sx={{ mt: 1, mb: 2 }}
              fullWidth
              variant="contained"
              component="span"
              size="large"
              startIcon={<PhotoCameraIcon />}
            >
              {!edit && 'Upload Image'}
              {edit && 'Change Image'}
            </Button>

            {fileIsEmpty && (
              <Alert
                onClose={() => setFileIsEmpty(false)}
                variant="outlined"
                severity="error"
              >
                Please select image!
              </Alert>
            )}
            
            {fileError && (
              <Alert
                onClose={() => setFileError(false)}
                variant="outlined"
                severity="error"
              >
                Only 1 image jpg/png up to 3 MB!
              </Alert>
            )}
          </label>

          <CardActions sx={{ mt: 1, px: 0, justifyContent: 'center' }}>
            <Button
              type="submit"
              size="large"
              color="primary"
              variant="contained"
            >
              {!edit && 'Add'}
              {edit && 'Edit'}
            </Button>
            <Button size="medium" color="primary" sx={{ my: 1 }} onClick={onCancelHandler}>
              Cancel
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
};

export default BannerForm;
