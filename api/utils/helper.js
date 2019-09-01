function isEmptyObject(obj) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function findArrayFromObject(object) {
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if (element instanceof Array) return { element, key };
        }
    }

    return null;
}

function getAccessingPathForProp(
    object,
    propertyName,
    propertyValue,
    propertyOrName = null
) {
    if (!(object instanceof Object))
        throw new TypeError(
            "This function only works with Object as constructor"
        );

    let pathStack = [];
    let propWithValueFound = false;

    function startSearchingForPropRecursive(searchingObject) {
        for (const key in searchingObject) {
            if (Object.prototype.hasOwnProperty.call(searchingObject, key)) {
                pathStack.push(key);

                if (
                    key == propertyName ||
                    (propertyOrName && key == propertyOrName)
                ) {
                    if (searchingObject[key] == propertyValue) {
                        propWithValueFound = true;
                        break;
                    }
                }

                if (searchingObject[key] instanceof Object) {
                    startSearchingForPropRecursive(searchingObject[key]);
                    if (propWithValueFound) break;
                }

                pathStack.pop();
            }
        }
    }

    startSearchingForPropRecursive(object);
    return propWithValueFound ? pathStack : false;
}

function getFirstOrDefaultPropFromObj(object, propertyName, propertyValue) {
    let result = null;

    function getPropRecursive(searchingObject) {
        if (searchingObject instanceof Array) {
            for (let i = 0; i < searchingObject.length; i++) {
                result = getPropRecursive(searchingObject[i]);
                if (result) {
                    break;
                }
            }
        } else {
            for (const prop in searchingObject) {
                if (prop == propertyName) {
                    if (searchingObject[prop] == propertyValue) {
                        result = searchingObject;
                        break;
                    }
                }
                if (
                    searchingObject[prop] instanceof Object ||
                    searchingObject[prop] instanceof Array
                ) {
                    result = getPropRecursive(searchingObject[prop]);
                    if (result) {
                        break;
                    }
                }
            }
        }
    }

    getPropRecursive(object);
    return result;
}

function getFirstOrDefaultFromArray(array, propertyName, propertyValue) {
    for (const item of array) {
        if (getAccessingPathForProp(item, propertyName, propertyValue))
            return item;
    }

    return null;
}

function getAllFromArray(array, propertyName, propertyValue) {
    const arrayContainingValue = [];
    for (const item of array) {
        if (getAccessingPathForProp(item, propertyName, propertyValue))
            arrayContainingValue.push(item);
    }

    return arrayContainingValue;
}

function getPropCount(array, propertyName, propertyValue) {
    if (!(array instanceof Array)) {
        throw new TypeError(
            "This function only works if the array parameter is an array!"
        );
    }

    let count = 0;
    for (const item of array) {
        if (getAccessingPathForProp(item, propertyName, propertyValue)) count++;
    }

    return count;
}

module.exports = {
    isEmptyObject,
    findArrayFromObject,
    getFirstOrDefaultPropFromObj,
    getFirstOrDefaultFromArray,
    getAllFromArray,
    getPropCount,
    getAccessingPathForProp,
};
