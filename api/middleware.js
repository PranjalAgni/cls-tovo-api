const stringUtil = require("./utils/stringUtil");
const fileUtil = require("./utils/fileUtil");

const understandRequest = (req, res, next) => {
    const pathUptoDo = stringUtil.splitFromStart(req.params.route, ".");
    const jsonFilePath = pathUptoDo + ".json";

    // The magic of dynamic db.json starts from here
    const dbPath = fileUtil
        .findFile("./JSONData", jsonFilePath)
        .replace(/\\/g, "/");

    const jsonDB = require("./../" + dbPath + "/" + jsonFilePath);

    // Object Keys
    // filter if query is present

    // const result = allRoutes.filter(route => {
    //   if (route === requiredRoute) {
    //     return true;
    //   }
    // });

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
    // const dataHolder = db[requiredRoute];

    // I(sdc224) have commented this line as it is not required in dynamic JSON
    // const dataHolder = db[result];

    const dataHolder = jsonDB;

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
