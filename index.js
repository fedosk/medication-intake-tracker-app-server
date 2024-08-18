require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/user.routes');
const medicationRouter = require('./src/routes/medication.routes');
const protectedRouter = require('./src/routes/protected.routes');
const createTables = require('./src/models/index');
const { errorMiddleware } = require('./src/middlewares/error.middleware');

const corsOptions = {
  origin: 'http://localhost:8090',
};

const PORT = process.env.PORT || 8090;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api', userRouter);
app.use('/api', medicationRouter);
app.use('/protected', protectedRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await createTables();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
