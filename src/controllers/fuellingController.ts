import { Schema, model } from 'mongoose';
import express from 'express';
import asyncHandler from 'utlis/asyncHandler';
import { parseISO } from 'date-fns'

const fuelingLocationSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
})

const companySchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  nipNumber: {
    type: Schema.Types.String,
    required: false,
  },
  vatNumber: {
    type: Schema.Types.String,
    required: false,
  },
  regonNumber: {
    type: Schema.Types.String,
    required: false,
  },
})

const fuelingSchema = new Schema({
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  fuelType: {
    type: Schema.Types.String,
    required: true,
  },
  fuelPrice: {
    type: Schema.Types.String,
    required: true,
  },
  fuelAmount: {
    type: Schema.Types.String,
    required: true,
  },
  location: {
    type: fuelingLocationSchema,
    required: true,
  },
  invoiceNumber: {
    type: Schema.Types.String,
    required: true,
  },
  sellerDetails: {
    type: companySchema,
    required: true,
  },
  buyerDetails: {
    type: companySchema,
    required: true,
  },
})

fuelingSchema.pre('save', function (next) {
  this.date = parseISO(this.date)
  next()
});

fuelingSchema.pre('update', function (next) {
  this.set({
    date: parseISO(this.get('date'))
  })
  next()
});

const Fuelling = model('Fuelling', fuelingSchema);


const fuellingController = express.Router();

fuellingController.get('/', asyncHandler(async (req, res) => {
  const { date, fuelType, location } = req.query;

  const filter: any = {};
  if (date) {
    filter.date = parseISO(date as string);
  }
  if (fuelType) {
    filter.fuelType = fuelType;
  }
  if (location) {
    filter['location.name'] = location;
  }

  const fuellings = await Fuelling.find(filter);
  res.send(fuellings.map(fuelling => fuelling.toJSON()));
}));

fuellingController.get('/:id', asyncHandler(async (req, res) => {
  const fuelling = await Fuelling.findById(req.params.id);
  if (!fuelling) {
    res.sendStatus(404);
    return;
  }
  res.send(fuelling.toJSON());
}));

// create
fuellingController.post('/', asyncHandler(async (req, res) => {
  const fuelling = new Fuelling(req.body);
  console.log(fuelling)
  await fuelling.save();
  res.send(fuelling.toJSON());
}));

// update
fuellingController.put('/:id', asyncHandler(async (req, res) => {
  const fuelling = await Fuelling.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fuelling) {
    res.sendStatus(404);
    return;
  }
  res.send(fuelling.toJSON());
}));

export default fuellingController;
