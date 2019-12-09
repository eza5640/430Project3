const models = require('../models');

const Tens = models.Tens;

const makerPage = (req, res) => {
  Tens.TensModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), tens: docs });
  });
};

const makeTens = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Names required' });
  }

  if (req.body.name.split(',').length < 10) {
    return res.status(400).json({ error: '10 Names Required' });
  }

  const tensData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  const newTens = new Tens.TensModel(tensData);

  const tensPromise = newTens.save();
  tensPromise.then(() => res.json({ redirect: '/maker' }));
  tensPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tens already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return tensPromise;
};

const getTens = (request, response) => {
  const req = request;
  const res = response;

  return Tens.TensModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ tens: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTens = getTens;
module.exports.make = makeTens;
