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

/**
 * Detects whether an array contains the matched String or not... True if partially matched
 * @param {Array} stringArray Array of Strings, in which we need to match the word
 * @param {String} matchWord The string for which we find the match
 * @returns True if matched, False if not matched
 */
function stringMatch(stringArray, matchWord) {
    for (const string in stringArray) {
        if (stringArray.hasOwnProperty(string)) {
            const element = stringArray[string];
            if (element.indexOf(matchWord) !== -1) return true;
        }
    }

    return false;
}

module.exports = {
    splitFromStart,
    stringDifference,
    stringMatch
};
