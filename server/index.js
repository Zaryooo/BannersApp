const { urlencoded } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const secureToken = 'secret123'; // Have to be much secure

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

app.use(cors());
app.use(router);
app.use('/uploads/', express.static('uploads'));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/banner-app');

app.post('/api/registration', async (req, res) => {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicated email!' });
  }
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        email: user.email,
        password: user.password,
      },
      secureToken
    );
    const expirationTime = '1200';

    return res.json({
      status: 'ok',
      token,
      time: expirationTime,
      name: user.name,
    });
  } else {
    return res.json({
      status: 'error',
      token: false,
      error: 'Wrong email or password!',
    });
  }
});

app.get('/api/banners', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, secureToken);
    const email = decoded.email;
    const user = await User.findOne({ email: email }).exec();

    await res.json({ status: 'ok', banners: user.banners });
  } catch (error) {
    res.json({ status: 'error', error: 'Invalid token!' });
  }
});

router.post('/api/banners', upload.single('upload_image'), async (req, res) => {
  const token = req.headers['x-access-token'];
  const title = req.body.title;
  const image = req.file.filename;

  try {
    const decoded = jwt.verify(token, secureToken);
    const email = decoded.email;
    const id = uuidv4();
    const banner = {
      id,
      title,
      image: `http://localhost:5000/uploads/${image}`,
    };
    await User.updateOne({ email: email }, { $push: { banners: banner } });

    await res.json({ status: 'ok' });
  } catch (error) {
    res.json({ status: 'error', error: 'Invalid token!' });
  }
});

router.post('/api/update', upload.single('upload_image'), async (req, res) => {
  const token = req.headers['x-access-token'];
  const bannerId = req.body.bannerId;
  const title = req.body.title;
  const file = req.file;
  let banner = {
    'banners.$.id': bannerId,
    'banners.$.title': title,
  };
  if (file) {
    const image = file.filename;
    banner = {
      'banners.$.id': bannerId,
      'banners.$.title': title,
      'banners.$.image': `http://localhost:5000/uploads/${image}`,
    };
  }

  try {
    const decoded = jwt.verify(token, secureToken);
    const email = decoded.email;

    await User.updateMany(
      {
        email: email,
        banners: {
          $elemMatch: { id: bannerId },
        },
      },
      {
        $set: banner,
      }
    );

    await res.json({ status: 'ok' });
  } catch (error) {
    res.json({ status: 'error', error: 'Invalid token!' });
  }
});

app.post('/api/delete', async (req, res) => {
  const token = req.headers['x-access-token'];
  const bannerId = req.body.bannerId;

  try {
    const decoded = jwt.verify(token, secureToken);
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $pull: { banners: { id: bannerId } } }
    );

    await res.json({ status: 'ok' });
  } catch (error) {
    res.json({ status: 'error', error: 'Invalid token!' });
  }
});

app.listen(5000, () => {
  console.log('Server started on 5000');
});
