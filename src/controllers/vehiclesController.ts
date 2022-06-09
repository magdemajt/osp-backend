import { Schema, model } from 'mongoose';
import express from 'express';
import asyncHandler from 'utlis/asyncHandler';
import { parseISO } from 'date-fns';

const insuranceSchema = new Schema({
    insuranceCompany: {
        type: Schema.Types.String,
        required: true
    },
    policyNumber: {
        type: Schema.Types.String,
        required: true
    },
    policyExpirationDate: {
        type: Schema.Types.Date,
        required: true
    },
})

// parseISO
insuranceSchema.pre('save', function (next) {
    this.policyExpirationDate = parseISO(this.policyExpirationDate);
    next();
});

insuranceSchema.pre('update', function (next) {
    this.set({
        policyExpirationDate: parseISO(this.get('policyExpirationDate'))
    });
    next();
});

const vehicleSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    model: {
        type: Schema.Types.String,
        required: true
    },
    year: {
        type: Schema.Types.Number,
        required: true
    },
    registrationNumber: {
        type: Schema.Types.String,
        required: true
    },
    insurance: {
        type: insuranceSchema,
        required: true
    },
    technicalReviewExpiry: {
        type: Schema.Types.Date,
        required: true
    },
    fuelConsumptionStandard: {
        type: Schema.Types.String,
        required: true
    },
    oilStandard: {
        type: Schema.Types.String,
        required: true
    },
    fuelType: {
        type: Schema.Types.String,
        required: true
    },
});

vehicleSchema.pre('save', function (next) {
    this.technicalReviewExpiry = parseISO(this.technicalReviewExpiry);
    next();
});

vehicleSchema.pre('update', function (next) {
    this.set({
        technicalReviewExpiry: parseISO(this.get('technicalReviewExpiry'))
    });
    next();
});

const Vehicle = model('Vehicle', vehicleSchema);

const vehiclesController = express.Router();

vehiclesController.get('/', asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find();
    res.send(vehicles.map(vehicle => vehicle.toJSON()));
}));

// get vehicle by id
vehiclesController.get('/:id', asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
        res.sendStatus(404);
        return;
    }
    res.send(vehicle.toJSON());
}));

// create vehicle
vehiclesController.post('/', asyncHandler(async (req, res) => {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.send(vehicle);
}));

// update vehicle
vehiclesController.put('/:id', asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.send(vehicle.toJSON());
}));

export default vehiclesController;
