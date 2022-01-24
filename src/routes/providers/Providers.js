const Controller = require('./Controller');
const HandlerErrors = require('../../handlerErrors');

class Providers {
  constructor({
    id, company, email, category, createdAt, updatedAt, version,
  }) {
    Object.assign(this, {
      id,
      company,
      email,
      category,
      createdAt,
      updatedAt,
      version,
    });
  }

  async create() {
    this.validation();

    const response = await Controller.create({
      company: this.company,
      email: this.email,
      category: this.category,
    });

    this.id = response.id;
    this.createdAt = response.createdAt;
    this.updatedAt = response.updatedAt;
    this.version = response.version;
  }

  async findOne() {
    const response = await Controller.findOne(this.id);

    this.company = response.company;
    this.email = response.email;
    this.category = response.category;
    this.createdAt = response.createdAt;
    this.updatedAt = response.updatedAt;
    this.version = response.version;
  }

  async update() {
    await Controller.findOne(this.id);
    const fieldsValids = ['company', 'email', 'category'];
    const data = {};

    fieldsValids.forEach((field) => {
      const value = this[field];
      if (value && value.length > 0 && typeof value === 'string') {
        data[field] = value;
      }
    });

    if (Object.keys(data).length === 0) {
      throw new HandlerErrors(400, 'The data passed invalid');
    }

    await Controller.update(this.id, data);
  }

  async destroy() {
    return Controller.destroy(this.id);
  }

  validation() {
    const fields = ['company', 'email', 'category'];

    fields.forEach((field) => {
      const value = this[field];
      if (typeof value !== 'string' || value.length === 0) {
        throw new HandlerErrors(400, `The field '${field}' is invalid'`);
      }
    });
  }
}

module.exports = Providers;
