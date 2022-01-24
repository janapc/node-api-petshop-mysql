const express = require('express');

const DAO = require('./DAO');
const Product = require('./Product');
const formatedResponse = require('../../../utils/formatedResponse');

const router = express.Router({ mergeParams: true });

const tags = {
  plural: 'products',
  singular: 'product',
};

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.options('/:id', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'DELETE, HEAD, GET, PUT');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.options('/:id/decrease-stock', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.get('/', async (req, res) => {
  const products = await DAO.findAll(req.provider.id);

  res.send(formatedResponse(res.getHeader('Content-Type'), products, tags));
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const data = { ...body, provider: req.provider.id };

    const product = new Product(data);
    await product.create();
    const timestamp = new Date(product.updatedAt).getTime();

    res
      .set('Last-Modified', timestamp)
      .set('X-Powered-By', 'Gatito Petshop')
      .set(
        'Location',
        `/api/provider/${product.provider}/products/${product.id}`,
      )
      .status(201)
      .send(formatedResponse(res.getHeader('Content-Type'), product, tags));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const data = {
    id: req.params.id,
    provider: req.provider.id,
  };
  const product = new Product(data);
  await product.destroy();

  res.status(204).end();
});

router.head('/:id', async (req, res, next) => {
  try {
    const data = {
      id: req.params.id,
      provider: req.provider.id,
    };
    const product = new Product(data);
    await product.findOne();
    const timestamp = new Date(product.updatedAt).getTime();

    res.set('Last-Modified', timestamp).status(200).end();
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = {
      id: req.params.id,
      provider: req.provider.id,
    };
    const product = new Product(data);
    await product.findOne();
    const timestamp = new Date(product.updatedAt).getTime();

    res
      .set('Last-Modified', timestamp)
      .send(
        formatedResponse(res.getHeader('Content-Type'), product, tags, [
          'price',
          'stock',
          'provider',
          'createdAt',
          'updatedAt',
        ]),
      );
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = {
      id: req.params.id,
      provider: req.provider.id,
      ...req.body,
    };

    const product = new Product(data);
    await product.update();
    await product.findOne();

    const timestamp = new Date(product.updatedAt).getTime();

    res.set('Last-Modified', timestamp).status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/decrease-stock', async (req, res, next) => {
  try {
    const product = new Product({
      id: req.params.id,
      provider: req.provider.id,
    });

    await product.findOne();

    product.stock -= req.body.stock;

    await product.decreaseStock();
    await product.findOne();

    const timestamp = new Date(product.updatedAt).getTime();

    res.set('Last-Modified', timestamp).status(204).end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
