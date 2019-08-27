const express = require('express');
const cors = require('cors');
const middleware = require('./middleware');
const morgan = require('morgan');
const { buildMap } = require('./utils/fileDB');
// For Constants
const constants = require('./utils/constants');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
buildMap();
app.post(
  `${constants.rrdmsUrlPath}:route`,
  middleware.understandRequest,
  (req, res) => {
    const status = res.isRoute ? 200 : 404;
    const data = res.data;
    res
      .json({
        isRoute: res.isRoute,
        ...data
      })
      .status(status);
  }
);

const PORT = process.env.PORT || constants.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
