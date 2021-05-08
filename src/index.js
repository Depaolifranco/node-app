const app = require('./app');
const { application } = require('../configs/configs')();
const port = application.port;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
