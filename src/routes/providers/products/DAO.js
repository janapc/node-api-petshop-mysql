const Model = require('./Model');
const instance = require('../../../database');
const HandlerErrors = require('../../../handlerErrors');

module.exports = {
  findAll(idProviders) {
    return Model.findAll({
      where: {
        provider: idProviders,
      },
      raw: true,
    });
  },

  create(data) {
    return Model.create(data);
  },

  destroy(id, idProvider) {
    return Model.destroy({
      where: {
        id,
        provider: idProvider,
      },
    });
  },

  async findOne(id, idProvider) {
    const result = await Model.findOne({
      where: {
        id,
        provider: idProvider,
      },
      raw: true,
    });

    if (!result) {
      throw new HandlerErrors(404, 'Product is not find');
    }

    return result;
  },

  update(product, data) {
    return Model.update(data, {
      where: product,
    });
  },

  decreaseStock(id, idProvider, field, stock) {
    return instance.transaction(async (transaction) => {
      const product = await Model.findOne({
        where: {
          id,
          provider: idProvider,
        },
      });
      product[field] = stock;

      await product.save();

      return product;
    });
  },
};
