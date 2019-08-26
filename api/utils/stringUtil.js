/**
 * Splits a given String from starting upto a given Character.
 * @param {String} string The string in which you want to do the operation
 * @param {String} uptoChar The character upto which you want to get the String
 * @returns {String} The modified String...empty if no given character found
 */
function splitFromStart(string, uptoChar) {
    let index = string.indexOf(uptoChar);

    if (index > 0) return string.slice(0, index);
    else return "";
}

/**
 * Finds difference between two Strings
 * @param {String} bigString The bigger string among both
 * @param {String} smallString The smaller string among both
 * @returns The difference String
 */
function stringDifference(bigString, smallString) {
    return bigString.split(smallString).join("");
}

module.exports = {
    splitFromStart,
    stringDifference
};
