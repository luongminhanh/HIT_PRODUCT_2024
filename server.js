require('dotenv').config();
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io'); // Thêm dòng này để yêu cầu socket.io
const subjectRoute = require('./routes/subject.route');
const userRoute = require('./routes/user.route');
const questionRoute = require('./routes/question.route');
const authRoute = require('./routes/auth.route');
const testRoute = require('./routes/test.route');
const postRoute = require('./routes/post.route');
const likeRoute = require('./routes/like.route');
const commentRoute = require('./routes/comment.route');

const upload = require('./middlewares/multer.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hit-nodejs-2024';

app.use(cors());
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.set('socketio', io);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/subjects', subjectRoute);
app.use('/api/v1/questions', questionRoute);
app.use('/api/v1/tests', testRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/likes', likeRoute);
app.use('/api/v1/comments', commentRoute);
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.post('/uploads', upload.single('file'), (req, res) => {
  const urlPublic = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.send({
    message: 'File uploaded successfully',
    urlPublic,
  });
});

app.all('*', (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({
    message: 'Not found',
    code: httpStatus.NOT_FOUND,
  });
});

app.use(errorHandler);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .then(() => {
    server.listen(port, () => { 
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
