import { Schema, model } from 'mongoose';
import express from 'express';
import asyncHandler from 'utlis/asyncHandler';

const memberSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  role: {
    type: Schema.Types.String,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  address: {
    type: Schema.Types.String,
    required: true,
  },
  phone: {
    type: Schema.Types.String,
    required: true,
  },
  inventory: {
    type: Schema.Types.Array,
    default: [],
  },
  certifications: {
    type: Schema.Types.Array,
    default: [],
  },
  type: {
    type: Schema.Types.String,
    required: false,
  },
  group: {
    type: Schema.Types.String,
    required: false,
  },
  decorations: {
    type: Schema.Types.Array,
    default: [],
  },
  qualifications: {
    type: Schema.Types.Array,
    default: [],
  },
});


const Member = model('Member', memberSchema);


const memberController = express.Router();

memberController.get('/', asyncHandler(async (req, res) => {
  const members = await Member.find({});
  res.send(members.map((member) => member.toJSON()));
}));

// get specific member
memberController.get('/:id', asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.sendStatus(404);
  }
  res.send(member.toJSON());
}));


// create new member
memberController.post('/', asyncHandler(async (req, res) => {
  const member = new Member(req.body);
  await member.save();
  res.send(member);
}));

// update member
memberController.put('/:id', asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.send(member.toJSON());
}));

export default memberController;
