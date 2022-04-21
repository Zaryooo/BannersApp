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
  styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';

import classes from './Banners.module.css';
import BannerForm from './BannerForm';

const Banners = (props) => {
  const [addBanner, setAddBanner] = useState(false);
  const [banners, setBanners] = useState([]);
  const [edit, setEdit] = useState(false);

  const loadBanners = async () => {
    const response = await axios({
      url: 'http://localhost:5000/api/banners',
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    }).then(response => response).catch(error => console.log(error));

    if (response.data.status === 'ok') {
      setBanners(response.data.banners);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

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
    setAddBanner(true);
    setEdit(item);
  };

  const onCancelHandler = () => {
    setAddBanner(false);
  };

  return (
    <Box>
      {banners == '' && (
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
          <BannerForm onAdd={loadBanners} onCancel={onCancelHandler} onEdit={edit}/>
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
