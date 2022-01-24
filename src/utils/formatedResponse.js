const jsontoxml = require('jsontoxml');

const fieldsDefault = {
  provider: ['id', 'category'],
  product: ['id', 'title'],
  error: [],
};

function formatXml(data, tags) {
  let newData;

  if (Array.isArray(data)) {
    newData = data.map((item) => ({
      [tags.singular]: item,
    }));
  }

  return jsontoxml({ [tags.plural]: newData || data });
}

function filterData(data, fields, tag) {
  if (tag === 'error') return data;
  const newData = {};

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      newData[field] = data[field];
    }
  });

  return newData;
}

function formatedResponse(typeContent, data, tags, fields = []) {
  const newData = Array.isArray(data)
    ? data.map((item) => filterData(
      item,
      fieldsDefault[tags.singular].concat(fields),
      tags.singular,
    ))
    : filterData(
      data,
      fieldsDefault[tags.singular].concat(fields),
      tags.singular,
    );

  if (typeContent === 'application/json') {
    return newData;
  }
  if (typeContent === 'application/xml') {
    return formatXml(newData, tags);
  }

  return null;
}

module.exports = formatedResponse;
