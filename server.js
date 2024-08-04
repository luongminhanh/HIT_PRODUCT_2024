require('dotenv').config();
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
var cors = require('cors');
const xlsx = require('xlsx');

const subjectRoute = require('./routes/subject.route');
const userRoute = require('./routes/user.route');
const questionRoute = require('./routes/question.route');
const authRoute = require('./routes/auth.route');
const testRoute = require('./routes/test.route');
const postRoute = require('./routes/post.route');

const upload = require('./middlewares/multer.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const port = process.env.PORT || 3002;
console.log(process.env.PORT);
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hit-nodejs-2024';
app.use(cors());
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/subjects', subjectRoute);
app.use('/api/v1/questions', questionRoute);
app.use('/api/v1/tests', testRoute);
app.use('/api/v1/posts', postRoute);

app.post('/uploads', upload.single('file'), (req, res) => {
  const urlPublic = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.send({
    message: 'File uploaded successfully',
    urlPublic,
  });
});

var excelStorage = multer.diskStorage({  
  destination:(req,file,cb)=>{  
       cb(null,'./public/excelUploads'); 
  },
       filename:(req,file,cb)=>{  
        cb(null,file.originalname);  
  }  
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
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
