/**
 * @author Sourodeep Chatterjee
 * This is the constants file where all the necessary constants are writen
 * If you want, you can change this constants as per different conditions
 * @exports all the necessary constants
 */

/**
 * @constant {String} rrdmsUrlPath conatins the path which we need to prefix so that our API will work
 * @author Sourodeep Chatterjee
 */
const rrdmsUrlPath = "/cms/tovo/v1/";

/**
 * @constant {String} jsonDataPath contains the JSON Data path which is reused by some JS files
 * @author Sourodeep Chatterjee
 */
const jsonDataPath = "data/JSONData";

/**
 * @constant {String} imagesUrlPath
 */
const imagesUrlPath = "/static/tovo/images";

/**
 * @constant {String} paginationString contains the Pagination String which is needed for getting the Pagination Details from Client POST request
 * @author Sourodeep Chatterjee
 */
const paginationString = "page";

/**
 * @constant {Number} PORT conatins the default PORT for this API
 * @author Sourodeep Chatterjee
 */
const PORT = 4000;

module.exports = {
    rrdmsUrlPath,
    jsonDataPath,
    imagesUrlPath,
    paginationString,
    PORT
};
