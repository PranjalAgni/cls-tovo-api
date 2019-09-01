/**
 * This file is created for Getting more optimization on the file searching
 * It builds a hashmap before starting the express server and uses it for
 * all the subsequent request
 */

const fs = require("fs");
const path = require("path");
const HashMap = require("hashmap");
const constants = require("./constants");

const lowDB = new HashMap();

/**
 * @author Pranjal Agnihotri
 * Builds a hashmap to give O(1) lookup
 */
const buildMap = () => {
    const DATA_DIR = constants.jsonDataPath;
    const folders = fs.readdirSync(DATA_DIR);
    folders.forEach(folder => {
        const files = fs.readdirSync(path.join(DATA_DIR, folder));
        files.forEach(file => {
            lowDB.set(file, path.join(DATA_DIR, folder, file));
        });
    });
};

/**
 * @author Pranjal Agnihotri
 * Returns the lowDB hashMap instance.
 */
const getMap = () => {
    return lowDB;
};

module.exports = {
    buildMap,
    getMap,
};
