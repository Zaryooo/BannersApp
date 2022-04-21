import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Alert,
  styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import axios from 'axios';

import classes from './Banners.module.css';

const Banners = () => {
  const [addBanner, setAddBanner] = useState(false);
  const [banners, setBanners] = useState([]);

  const [file, setFile] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileSize, setFileSize] = useState(false);
  const [fileIsEmpty, setFileIsEmpty] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const Input = styled('input')({
    display: 'none',
  });

  const loadBanners = async () => {
    const req = await fetch('http://localhost:5000/api/banners', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    });

    const data = await req.json();
    if (data.status === 'ok') {
      setBanners(data.banners);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

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
    if (e.target.files[0].size > 1024 * 1024 * 2) {
      setFileSize(true);
      setFile('');
      return;
    }
    setFile(e.target.files[0]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (title == '') {
      setTitleError(true);
      return;
    }
    if (!edit && file.length == 0) {
      setFileIsEmpty(true);
      return;
    }

    const formData = new FormData();

    let url = 'http://localhost:5000/api/banners';
    if (edit) {
      url = 'http://localhost:5000/api/update';
      formData.append('bannerId', editId);
    }

    formData.append('upload_image', file);
    formData.append('title', title);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.status === 200) {
          setTitle('');
          setFile('');
          setEdit(false);
          loadBanners();
        } else {
          console.log('Error occurred');
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const onDeleteHandler = (bannerId) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/api/delete',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
      data: {
        bannerId,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          loadBanners();
        } else {
          console.log('Error occurred');
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const onEditHandler = (item) => {
    setTitle(item.title);
    setEditId(item.id);
    setAddBanner(true);
    setEdit(true);
  };

  const onCancelHandler = () => {
    setTitle('');
    setFile('');
    setEdit(false);
    setAddBanner(false);
  };

  return (
    <Box>
      {banners == ''  && (
        <Typography component="p" variant="h6" align="center">
          No banners
        </Typography>
      )}
      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3 }}
        columns={{ xs: 2, sm: 2, md: 8 }}
        justifyContent="center"
        className={classes.grid}
      >
        {banners.map((item) => {
          return (
            <Grid item xs={2} sm={2} md={4} key={item.id}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={item.image}
                  title={item.title}
                />
                <Box className={classes.bar}>
                  <CardContent className={classes.content}>
                    <Typography component="h3" variant="h4">
                      {item.title}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.actions} sx={{ p: 2 }}>
                    <Button
                      onClick={() => onEditHandler(item)}
                      size="small"
                      color="primary"
                      variant="contained"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDeleteHandler(item.id, item.title)}
                      size="small"
                      color="primary"
                      variant="contained"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          );
        })}
        {addBanner && (
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
                      Two many images!
                    </Alert>
                  )}
                  {fileSize && (
                    <Alert
                      onClose={() => setFileSize(false)}
                      variant="outlined"
                      severity="error"
                    >
                      Only jpg/png up to 3 MB!
                    </Alert>
                  )}
                </label>

                <CardActions sx={{ mt: 2, px: 0, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    size="large"
                    color="primary"
                    variant="contained"
                    sx={{ mb: 1 }}
                  >
                    {!edit && 'Add'}
                    {edit && 'Edit'}
                  </Button>
                  <Button
                    size="medium"
                    color="primary"
                    onClick={onCancelHandler}
                  >
                    Cancel
                  </Button>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
      {!addBanner && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={() => setAddBanner(true)}
          >
            Add Banner
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Banners;
