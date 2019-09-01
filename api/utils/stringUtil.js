/**
 * @author Sourodeep Chatterjee
 * This is the helper JS library which is needed in this API
 */

/**
 * @author Sourodeep Chatterjee
 * Splits a given String from starting upto a given Character.
 * @param {String} string The string in which you want to do the operation
 * @param {String} uptoChar The character upto which you want to get the String
 * @returns {String} The modified String...empty if no given character found
 * @exports splitFromStart
 */
function splitFromStart(string, uptoChar) {
    let index = string.indexOf(uptoChar);

    if (index > 0) return string.slice(0, index);
    else return "";
}

/**
 * @author Sourodeep Chatterjee
 * Finds difference between two Strings
 * @param {String} bigString The bigger string among both
 * @param {String} smallString The smaller string among both
 * @returns The difference String
 * @exports stringDifference
 */
function stringDifference(bigString, smallString) {
    bigString.split(smallString).join("");
}

/**
 * @author Sourodeep Chatterjee
 * Detects whether an array contains the matched String or not... True if partially matched
 * @param {Array} stringArray Array of Strings, in which we need to match the word
 * @param {String} matchWord The string for which we find the match
 * @returns True if matched, False if not matched
 * @exports stringMatch
 */
function stringMatch(stringArray, matchWord) {
    for (const string in stringArray) {
        // As it just touches some harcoded keys for hasOwnProperty
        // eslint-disable-next-line no-prototype-builtins
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
    stringMatch,
};
