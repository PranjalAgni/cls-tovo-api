const db = require('./db.json');
const understandRequest = (req, res, next) => {
  const requiredRoute = req.params.route;
  const allRoutes = Object.keys(db);

  // Object Keys
  // filter if query is present

  const result = allRoutes.filter(route => {
    if (route === requiredRoute) {
      return true;
    }
  });
  // console.log(result);
  // Add in response
  if (result.length === 0) {
    res.isRoute = false;
    next();
  }

  // If query is present
  const query = req.params.query;
  const dataHolder = db[requiredRoute];
  // console.log(dataHolder);

  res.isRoute = true;
  if (query === undefined) {
    // All the values of that key
    res.data = dataHolder;
  } else {
    // Check if it array
    if (dataHolder.length) {
      // Filter values on the above query
      // Assuming query is id
      const dataResult = dataHolder.filter(data => {
        if (data.id == query) {
          return true;
        }
      });
      res.data = dataResult;
    }
    // TODO: On specific id return data
    res.data = dataHolder;
  }

  next();
};

module.exports = {
  understandRequest
};
