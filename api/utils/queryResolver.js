const constants = require("./constants");
const stringUtil = require("./stringUtil");
const helper = require("./helper");
const { getMap } = require("./fileDB");

const lowDB = getMap();

function isPaginationQuery(query) {
    return stringUtil.stringMatch(
        Object.keys(query),
        constants.paginationString
    );
}

function ignorePagination(data) {
    for (const item of constants.ignorePaginationFor) {
        if (stringUtil.stringMatch(Object.keys(data), item)) return true;
    }
}

function handlePaginationQuery(
    query,
    dataToPaginate,
    specArrToPaginate = null
) {
    if (!dataToPaginate && specArrToPaginate) {
        return data;
    } else {
        // TODO more logic can be added
        const arrayToPaginate = helper.findArrayFromObject(dataToPaginate);

        const startingValue = query.pageNumber * query.pageSize;
        const endingValue = (query.pageNumber + 1) * query.pageSize;

        const slicedData = arrayToPaginate.element.slice(
            startingValue,
            endingValue
        );

        const data = {
            ...dataToPaginate,
        };
        data[arrayToPaginate.key] = slicedData;

        return data;
    }
}

function extractQueryObject(query) {
    let propertyName = "",
        propertyValue = null;

    // Now works for only one query object parameter
    if (Object.keys(query).length == 1) {
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                propertyName = key;
                propertyValue = query[key];
            }
        }
    }

    return { propertyName, propertyValue };
}

function isFilterOrSearchQuery(query, dataToOperate, urlRoute = "") {
    let propertyName = "",
        propertyValue = null;

    // Now works for only one query object parameter
    if (Object.keys(query).length == 1) {
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                propertyName = key;
                propertyValue = query[key];
            }
        }
    }

    propertyName = checkForPrimaryKey(propertyName, urlRoute);
    const newQuery = newQueryObject(query, propertyName);

    if (propertyName && propertyValue) {
        const propertyCount = helper.getPropCount(
            dataToOperate,
            propertyName,
            propertyValue
        );

        if (dataToOperate instanceof Array && propertyCount > 1) {
            // filter query
            return handleFilterQuery(newQuery, dataToOperate);
        } else {
            // search query
            return handleSearchQuery(newQuery, dataToOperate);
        }
    }
}

function checkForPrimaryKey(propertyName, urlRoute) {
    const urlRouteWords = stringUtil.camelToTitle(urlRoute).split(" "),
        keyWords = stringUtil.camelToTitle(propertyName).split(" ");

    let newKeyWords = "";

    newKeyWords = keyWords.filter(value => {
        return urlRouteWords.includes(value) != true;
    });

    newKeyWords = newKeyWords.join(""); // For seperator as blank(no seperator)
    newKeyWords = stringUtil.convertFirstLetterToLower(newKeyWords);

    return newKeyWords;
}

function newQueryObject(query, newPropertyName = null) {
    let propertyName = "",
        propertyValue = null;

    // Only for 1 object
    if (Object.keys(query).length == 1) {
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                if (newPropertyName) propertyName = newPropertyName;
                else propertyName = key;
                propertyValue = query[key];
            }
        }

        const newQuery = {};
        newQuery[propertyName] = propertyValue;

        return newQuery;
    }

    return null;
}

function handleFilterQuery(query, dataToFilter) {
    const modifiedQueryObject = extractQueryObject(query);
    return helper.getAllFromArray(
        dataToFilter,
        modifiedQueryObject.propertyName,
        modifiedQueryObject.propertyValue
    );
}

function handleSearchQuery(query, dataToSearch) {
    const modifiedQueryObject = extractQueryObject(query);
    return helper.getFirstOrDefaultFromArray(
        dataToSearch,
        modifiedQueryObject.propertyName,
        modifiedQueryObject.propertyValue
    );
}

function isSortQuery(query) {}

function isSliceQuery(query) {}

function requestResolver(urlRoute, query) {
    /**
     * @constant jsonFilePath for getting the JSON file from that URL
     */
    const jsonFilePath = urlRoute + ".json";

    // @PranjalAgni - Hash Map Implementation
    const dbPath = lowDB.get(jsonFilePath).replace(/\\/g, "/");
    const jsonDB = require("./../../" + dbPath);

    if (!query || helper.isEmptyObject(query)) return jsonDB;

    if (isPaginationQuery(query)) {
        if (ignorePagination(jsonDB)) return jsonDB;
        else return handlePaginationQuery(query, jsonDB);
    } else return isFilterOrSearchQuery(query, jsonDB, urlRoute);
}

module.exports = {
    requestResolver,
};
