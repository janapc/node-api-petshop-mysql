const express = require('express');

const Providers = require('./Providers');
const Controller = require('./Controller');
const routerProducts = require('./products');
const formatedResponse = require('../../utils/formatedResponse');

const router = express.Router();

const tags = {
  plural: 'providers',
  singular: 'provider',
};

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.options('/:id', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.get('/', async (req, res) => {
  const response = await Controller.findAll();

  res.send(formatedResponse(res.getHeader('Content-Type'), response, tags, ['company']));
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const provider = new Providers(data);

    await provider.create();
    res
      .status(201)
      .send(formatedResponse(res.getHeader('Content-Type'), provider, tags, ['company']));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = new Providers({ id });
    await provider.findOne();

    res.send(
      formatedResponse(res.getHeader('Content-Type'), provider, tags, [
        'company',
        'createdAt',
        'updatedAt',
        'email',
      ]),
    );
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const provider = new Providers({ ...data, id });
    await provider.update();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = new Providers({ id });
    await provider.findOne();
    await provider.destroy();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

const verifyProvider = async (req, res, next) => {
  try {
    const { idProvider } = req.params;
    const provider = new Providers({ id: idProvider });
    await provider.findOne();

    req.provider = provider;

    next();
  } catch (error) {
    next(error);
  }
};

router.use('/:idProvider/products', verifyProvider, routerProducts);

module.exports = router;
