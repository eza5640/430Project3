const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TensModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TensSchema = new mongoose.Schema({
  name: {
    type: [String],
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TensSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

TensSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TensModel.find(search).select('name').exec(callback);
};

TensModel = mongoose.model('Tens', TensSchema);

module.exports.TensModel = TensModel;
module.exports.TensSchema = TensSchema;
