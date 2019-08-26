const express = require('express');
const cors = require('cors');
const middleware = require('./middleware');
const app = express();

app.use(cors());

app.post('/cms/tovo/v1/:route', middleware.understandRequest, (req, res) => {
  const status = res.isRoute ? 200 : 404;
  const data = res.data;
  res
    .json({
      isRoute: res.isRoute,
      ...data
    })
    .status(status);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
