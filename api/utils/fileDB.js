const fs = require("fs");
const path = require("path");
const HashMap = require("hashmap");
const lowDB = new HashMap();

/**
 * Builds a hashmap to give O(1) lookup
 */
const buildMap = () => {
    const DATA_DIR = "./JSONData";
    const folders = fs.readdirSync(DATA_DIR);
    folders.forEach(folder => {
        const files = fs.readdirSync(path.join(DATA_DIR, folder));
        files.forEach(file => {
            lowDB.set(file, path.join(DATA_DIR, folder, file));
        });
    });
};

const getMap = () => {
    return lowDB;
};

module.exports = {
    buildMap,
    getMap
};
