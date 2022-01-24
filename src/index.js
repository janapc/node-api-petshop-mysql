const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const providers = require('./routes/providers');
const routerv2 = require('./routes/providers/router.v2');
const formatedResponse = require('./utils/formatedResponse');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  let formatedRequest = req.header('Accept');
  const formatedAccept = ['application/json', 'application/xml'];

  if (formatedRequest === '*/*') {
    formatedRequest = 'application/json';
  }

  if (formatedAccept.indexOf(formatedRequest) === -1) {
    res.status(406).end();
    return;
  }

  res.setHeader('Content-Type', formatedRequest);
  next();
});

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');

  next();
});

app.use('/api/providers', providers);
app.use('/api/v2/providers', routerv2);

app.use((error, req, res, next) => {
  res.status(error.code || 500).send(
    formatedResponse(
      res.getHeader('Content-Type'),
      {
        message: error.message,
      },
      { plural: 'errors', singular: 'error' },
    ),
  );
});

const port = process.env.PORT || config.get('api.port');

app.listen(port, () => console.info(`The API it's working on port ${port}`));
