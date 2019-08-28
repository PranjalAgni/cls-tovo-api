/**
 * @author Sourodeep Chatterjee
 * This is the helper library for searching Files in Directory
 */

const fs = require("fs");
const path = require("path");

/**
 * @author Sourodeep Chatterjee
 * Find List of All files in a given Directory
 * @param {String} directoryPath The initial Directory Path. Note: The path is the starting path of this project Directory
 * @exports findAllFilesList
 */
function findAllFilesList(directoryPath) {
    fs.readdir(directoryPath, function(err, files) {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        //listing all files using forEach
        files.forEach(function(file) {
            // Right now I am just console.logging the files, but you may extend this functionality
            console.log(file);
        });
    });
}

/**
 * @author Sourodeep Chatterjee
 * Find File of a particular name with its extension
 * Note.. It is a recursive function
 * @param {String} startPath The Initial Directory Path
 * @param {String} fileName The File name you want to search for
 * @returns The Directory in which the file is present
 * @exports findFile
 */
function findFile(startPath, fileName) {
    if (!fs.existsSync(startPath)) {
        console.debug("no dir ", startPath);
        return null;
    }

    let filePath = "";
    function traverseDirectories(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (let i in files) {
            var curFile = path.join(currentPath, files[i]);
            if (
                fs.statSync(curFile).isFile() &&
                curFile.indexOf(fileName) != -1
            ) {
                filePath = path.dirname(curFile);
            } else if (fs.statSync(curFile).isDirectory()) {
                traverseDirectories(curFile);
            }
        }
    }
    traverseDirectories(startPath);
    return filePath;
}

module.exports = {
    findAllFilesList,
    findFile
};
