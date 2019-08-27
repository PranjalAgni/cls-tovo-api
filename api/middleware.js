const stringUtil = require("./utils/stringUtil");
const constants = require("./utils/constants");
const { getMap } = require("./utils/fileDB");

const lowDB = getMap();

const understandRequest = (req, res, next) => {
  const pathUptoDo = stringUtil.splitFromStart(req.params.route, ".");
  const jsonFilePath = pathUptoDo + ".json";

  // The magic of dynamic db.json starts from here
  // @PranjalAgni - Hash Map Implementation
  const dbPath = lowDB.get(jsonFilePath).replace(/\\/g, "/");
  const jsonDB = require("./../" + dbPath);

  // Object Keys
  // filter if query is present
  let result = "";
  if (pathUptoDo !== undefined) {
    result = "/" + pathUptoDo;
  }

  // Add in response
  if (result.length === 0) {
    res.isRoute = false;
    next();
  }

  // If query is present
  // const query = req.params.query;

  const dataHolder = jsonDB;

  // console.log(dataHolder);

  res.isRoute = true;

  const requestQuery = req.query;

  const isPageQuery = stringUtil.stringMatch(
    Object.keys(requestQuery),
    constants.paginationString
  );

  if (requestQuery.length === 0) {
    // All the values of that key
    res.data = dataHolder;
  } else {
    // For pagination (sdc224)
    if (isPageQuery) {
      if (dataHolder.workbookItems) {
        const startingValue = requestQuery.pageNumber * requestQuery.pageSize;
        const endingValue =
          (requestQuery.pageNumber + 1) * requestQuery.pageSize;

        const slicedData = dataHolder.workbookItems.slice(
          startingValue,
          endingValue
        );

        res.data = {
          overview: dataHolder.overview,
          workbookItems: slicedData
        };
      } else {
        // For upcoming Card
        res.data = dataHolder;
      }
    } else {
      //@sdPr1me - query string present
      const query = requestQuery.customerId;
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
    }

    //console.log(dataResult);
  }

  next();
};

module.exports = {
  understandRequest
};
