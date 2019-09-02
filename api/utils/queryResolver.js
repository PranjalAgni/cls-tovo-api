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

function extraParamsForPaginationQuery(query) {
    const extraParams = {};
    for (const key in query) {
        // eslint-disable-next-line no-prototype-builtins
        if (query.hasOwnProperty(key)) {
            if (!key.includes(constants.paginationString))
                extraParams[key] = query[key];
        }
    }

    if (!helper.isEmptyObject(extraParams)) return extraParams;
    return null;
}

function ignorePagination(data) {
    for (const item of constants.ignorePaginationFor) {
        if (stringUtil.stringMatch(Object.keys(data), item)) return true;
    }

    return false;
}

function handlePaginationQuery(
    query,
    dataToPaginate,
    specArrToPaginate = null
) {
    if (specArrToPaginate) {
        // TODO can be reused
        const startingValue = query.pageNumber * query.pageSize;
        const endingValue = (query.pageNumber + 1) * query.pageSize;

        const slicedData = specArrToPaginate.slice(startingValue, endingValue);

        return slicedData;
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

    // Works if other parameter is specified in constants file
    if (Object.keys(query).length === 2) {
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                if (key == constants.paginationArrayIndex) {
                    // TODO -1 as bucketNumber
                    // considering dataToOperate as Array here
                    dataToOperate = dataToOperate[parseInt(query[key])];
                    delete query[key];
                }
            }
        }
    }
    // Now works for only one query object parameter
    if (Object.keys(query).length === 1) {
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                propertyName = key;
                propertyValue = query[key];
            }
        }
    } else return dataToOperate;

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
        const extraQueryParams = extraParamsForPaginationQuery(query);
        let specificArrayForPaginate = null;

        if (extraQueryParams) {
            // TODO
            // I am not searching for the primary key right now!!!
            // Note I am just excluding the primary key for now as I don't need that
            // This line should be removed and add some extra logic, based on dataset
            helper.deletePrimaryKey(extraQueryParams);

            // TODO
            // Now I am assuming that query params now only have array index, in which
            // it needs to do the pagination things
            if (Object.keys(extraQueryParams).length === 1) {
                for (const key in extraQueryParams) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (extraQueryParams.hasOwnProperty(key)) {
                        const element = extraQueryParams[key];
                        if (key == constants.paginationArrayIndex)
                            specificArrayForPaginate =
                                jsonDB[parseInt(element) + 1];
                    }
                }
            }
        }

        if (ignorePagination(jsonDB)) return jsonDB;
        else
            return handlePaginationQuery(
                query,
                jsonDB,
                specificArrayForPaginate
            );
    } else return isFilterOrSearchQuery(query, jsonDB, urlRoute);
}

module.exports = {
    requestResolver,
};
