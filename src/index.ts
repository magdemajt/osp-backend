import express from 'express';
import connectToMongo from './database';
import membersController from 'controllers/membersController';
import vehiclesController from 'controllers/vehiclesController';
import fuellingController from 'controllers/fuellingController';
import cors from 'cors';
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
}));
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/members', membersController);
app.use('/vehicles', vehiclesController);
app.use('/fuelings', fuellingController);

app.get('/health_check', (req, res) => {
  res.send('OK');
});

app.listen(8000, () => {
  connectToMongo().then(() => {
    console.log('Server is running on port 8000');
  });
});
