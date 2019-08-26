const db = require('./db.json');
const routeJSON = require('./routes.json');
const understandRequest = (req, res, next) => {
  const requiredRoute = req.params.route;
  // Object Keys
  // filter if query is present

  // const result = allRoutes.filter(route => {
  //   if (route === requiredRoute) {
  //     return true;
  //   }
  // });
  const dbRoute = routeJSON[requiredRoute];
  let result = '';
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
  // console.log(dataHolder);

  res.isRoute = true;
  console.log(req.query);
  if (Object.keys(req.query).length === 0) {
    // All the values of that key
    res.data = dataHolder;
  } else {
    const query = req.query.customerId;
    // Filter values on the above query
    // Assuming query is id
    if (dataHolder.length) {
      const dataResult = dataHolder.find(data => {
        if (data.id == query) {
          return data;
        }
      });
      res.data = dataResult;
    } else {
      //TODO: Currently Return all the data
      res.data = dataHolder;
    }

    //console.log(dataResult);
  }

  next();
};

module.exports = {
  understandRequest
};
