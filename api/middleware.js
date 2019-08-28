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

    if (requestQuery.length === 0) {
        // All the values of that key
        res.data = dataHolder;
    } else {
        // For pagination (sdc224)
        if (isPageQuery) {
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
    }

    next();
};

module.exports = {
    understandRequest
};
