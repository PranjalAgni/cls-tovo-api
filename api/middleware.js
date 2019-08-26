const db = require("./db.json");
const routeJSON = require("./routes.json");
const understandRequest = (req, res, next) => {
  const requiredRoute = req.params.route;
  // const allRoutes = Object.keys(db);

  // Object Keys
  // filter if query is present

  // const result = allRoutes.filter(route => {
  //   if (route === requiredRoute) {
  //     return true;
  //   }
  // });
  const dbRoute = routeJSON[requiredRoute];
  let result = "";
  if (dbRoute !== undefined) {
    result = dbRoute.substring(1);
  }
  // Add in response
  if (result.length === 0) {
    res.isRoute = false;
    next();
  }

  // If query is present
  // const query = req.params.query;
  // const dataHolder = db[requiredRoute];
  const dataHolder = db[result];
  console.log(dataHolder);

  res.isRoute = true;
  if (Object.keys(req.query).length === 0) {
    // All the values of that key
    res.data = dataHolder;
  } else {
    // Check if it array
    if (dataHolder.length) {
      const query = req.query.customerId;
      // Filter values on the above query
      // Assuming query is id
      const dataResult = dataHolder.find(data => {
        if (data.id == query) {
          return data;
        }
      });
      res.data = dataResult;
    }
    // TODO: On specific id return data
    else {
      res.data = dataHolder;
    }
  }

  next();
};

module.exports = {
  understandRequest
};
