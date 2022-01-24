const DAO = require('./DAO');
const HandlerErrors = require('../../../handlerErrors');

class Product {
  constructor({
    id, title, price, stock, provider, createdAt, updatedAt,
  }) {
    Object.assign(this, {
      id,
      title,
      price,
      stock,
      provider,
      createdAt,
      updatedAt,
    });
  }

  async create() {
    this.validation();

    const result = await DAO.create({
      title: this.title,
      price: this.price,
      stock: this.stock,
      provider: this.provider,
    });

    this.id = result.id;
    this.createdAt = result.createdAt;
    this.updatedAt = result.updatedAt;
  }

  destroy() {
    return DAO.destroy(this.id, this.provider);
  }

  async findOne() {
    const result = await DAO.findOne(this.id, this.provider);

    this.title = result.title;
    this.price = result.price;
    this.stock = result.stock;
    this.createdAt = result.createdAt;
    this.updatedAt = result.createdAt;
  }

  async update() {
    const data = {};

    if (
      typeof this.title === 'string'
      || (this.title && this.title.length > 0)
    ) {
      data.title = this.title;
    }

    if (typeof this.price === 'number' || this.price > 0) {
      data.price = this.price;
    }

    if (typeof this.stock === 'number') {
      data.stock = this.stock;
    }

    if (Object.keys(data).length === 0) {
      throw new HandlerErrors(400, 'Not found data to update the product');
    }

    return DAO.update(
      {
        id: this.id,
        provider: this.provider,
      },
      data,
    );
  }

  decreaseStock() {
    return DAO.decreaseStock(this.id, this.provider, 'stock', this.stock);
  }

  validation() {
    if (typeof this.title !== 'string' || this.title.length === 0) {
      throw new HandlerErrors(400, 'The field title is invalid');
    }

    if (typeof this.price !== 'number' || this.price === 0) {
      throw new HandlerErrors(400, 'The field price is invalid');
    }
  }
}

module.exports = Product;
