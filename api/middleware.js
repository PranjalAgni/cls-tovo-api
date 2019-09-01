/**
 * This is the middleware file which is used in hope.js
 * All the POST requests are handled in this file only
 */

const stringUtil = require("./Utils/stringUtil");
const { requestResolver } = require("./Utils/queryResolver");

const understandRequest = (req, res, next) => {
    // Sourodeep Chatterjee
    // req.params.route is the dynamic route which is coming to us from the cls_tovo_ui
    // For example, if the page is .../getUserOverview.do, then req.params.route will return getUserOverview.do

    /**
     * @constant pathUptoDo for splitting the '.do' part from URL
     */
    const pathUptoDo = stringUtil.splitFromStart(req.params.route, ".");

    let result = "";
    if (pathUptoDo !== undefined) {
        result = "/" + pathUptoDo;
    }

    // Add in response
    if (result.length === 0) {
        res.isRoute = false;
        next();
    }

    res.isRoute = true;
    const requestQuery = req.query;

    res.data = requestResolver(pathUptoDo, requestQuery);
    next();
};

module.exports = {
    understandRequest,
};
