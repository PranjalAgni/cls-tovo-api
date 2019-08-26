const express = require('express');
const cors = require('cors');
const middleware = require('./middleware');
const app = express();

app.use(cors());

app.post(
  '/fetchData/:route/:query?',
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
