/**
 * This is the middleware file which is used in hope.js
 * All the POST requests are handled in this file only
 */

const stringUtil = require("./Utils/stringUtil");
const constants = require("./Utils/constants");
const { getMap } = require("./Utils/fileDB");

const lowDB = getMap();

const understandRequest = (req, res, next) => {
  // Sourodeep Chatterjee
  // req.params.route is the dynamic route which is coming to us from the cls_tovo_ui
  // For example, if the page is .../getUserOverview.do, then req.params.route will return getUserOverview.do

  /**
   * @constant pathUptoDo for splitting the '.do' part from URL
   */
  const pathUptoDo = stringUtil.splitFromStart(req.params.route, ".");

  /**
   * @constant jsonFilePath for getting the JSON file from that URL
   */
  const jsonFilePath = pathUptoDo + ".json";

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

  const dataHolder = jsonDB;

  res.isRoute = true;

  const requestQuery = req.query;

  /**
   * @constant isPageQuery a bool denoting whether it is a pagination query
   */
  const isPageQuery = stringUtil.stringMatch(
    Object.keys(requestQuery),
    constants.paginationString
  );

  // TODO: Replace it with switch case and move it to other file
  if (requestQuery.length === 0) {
    // All the values of that key
    res.data = dataHolder;
  } else {
    // For pagination (sdc224)
    switch (pathUptoDo) {
        case "getUserCallWorkBook": {
            if (dataHolder.workbookItems) {
                const startingValue =
                    requestQuery.pageNumber * requestQuery.pageSize;
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
            break;
        }
<<<<<<< Updated upstream
        case "fetchCustomer": {
            res.data = dataHolder.find(data => {
                if (data.id == requestQuery.customerId) {
                    return data;
                }
            });
            break;
        }
        case "fetchCommunications": {
            const query = requestQuery.customerId;

            // Filter values on the above query
            // Assuming query is id
            if (dataHolder.length) {
                let dataResult = [];

                if (dataHolder[0].call || dataHolder[0].correspondence) {
                    // passing all data right now to display for all customers
                    dataResult = dataHolder;
                    // implementation for filtering out data from dataHolder for each customer
                    // const communicationArray = [];
                    // dataHolder.filter(data => {
                    //   if (
                    //     (data.call && data.call.customerId == query) ||
                    //     (data.correspondence && data.correspondence.customerId == query)
                    //   )
                    //     communicationArray.push(data);
                    // });

                    // dataResult = communicationArray;
                }
                res.data = dataResult;
            }
            break;
        }
        case "getInvoices": {
            res.data = requestQuery.pageNumber
                ? dataHolder[parseInt(requestQuery.bucketNumber) + 1].slice(
                      requestQuery.pageNumber * 5,
                      requestQuery.pageNumber * 5 + 15
                  )
                : dataHolder[parseInt(requestQuery.bucketNumber) + 1];
            break;
        }
        case "getMappedCountries": {
            res.data = dataHolder.find(data => {
                if (data.customerId == requestQuery.customerId) {
                    return data.MappedCountries;
                }
            }).MappedCountries;
            break;
        }
        default:
            res.data = dataHolder;
=======
        break;
      }
      case "fetchCustomer": {
        res.data = dataHolder.find(data => {
          if (data.id == requestQuery.customerId) {
            return data;
          }
        });
        break;
      }
      case "fetchBrokenP2PDetailsForCustomer": {
        res.data = dataHolder.filter(data => {
          if (data.id == requestQuery.customerId) {
            return data;
          }
        });
        break;
      }
      case "fetchCommunications": {
        const query = requestQuery.customerId;

        // Filter values on the above query
        // Assuming query is id
        if (dataHolder.length) {
          let dataResult = [];

          if (dataHolder[0].call || dataHolder[0].correspondence) {
            // passing all data right now to display for all customers
            dataResult = dataHolder;
            // implementation for filtering out data from dataHolder for each customer
            // const communicationArray = [];
            // dataHolder.filter(data => {
            //   if (
            //     (data.call && data.call.customerId == query) ||
            //     (data.correspondence && data.correspondence.customerId == query)
            //   )
            //     communicationArray.push(data);
            // });

            // dataResult = communicationArray;
          }
          res.data = dataResult;
        }
        break;
      }
      case "getInvoices": {
        res.data = requestQuery.pageNumber
          ? dataHolder[parseInt(requestQuery.bucketNumber) + 1].slice(
              requestQuery.pageNumber * 5,
              requestQuery.pageNumber * 5 + 15
            )
          : dataHolder[parseInt(requestQuery.bucketNumber) + 1];
        break;
      }
      default:
        res.data = dataHolder;
>>>>>>> Stashed changes
    }
  }

  next();
};

module.exports = {
  understandRequest
};
