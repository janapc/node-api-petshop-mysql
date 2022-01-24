const Model = require('./Model');
const HandlerErrors = require('../../handlerErrors');

module.exports = {
  findAll() {
    return Model.findAll({ raw: true });
  },

  create(provider) {
    return Model.create(provider);
  },

  async findOne(id) {
    const response = await Model.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new HandlerErrors(404, 'The Provider is not find');
    }

    return response;
  },

  async update(id, data) {
    return Model.update(data, {
      where: {
        id,
      },
    });
  },

  async destroy(id) {
    return Model.destroy({
      where: {
        id,
      },
    });
  },
};
