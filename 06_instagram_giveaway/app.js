import fs from "fs";

const pathToData = "./data/";
const benchmark = true;

const readFiles = (pathToData) => {
    const fileContent = [];
    fs.readdirSync(pathToData).forEach((filename) => {
        fileContent.push(fs.readFileSync(pathToData + filename, "utf-8").split("\n"));
    });
    return fileContent;
};

const uniqueValues = () => {
    if (benchmark) console.time("uniqueValues");
    const unique = new Set(readFiles(pathToData).reduce((a, b) => a.concat(b), []));
    if (benchmark) console.timeEnd("uniqueValues");
    return unique;
};

const existInNArrays = (arrays, n) => {
    const set = new Map();
    for (let i = 0; i < arrays.length; i++) {
        const setArray = new Set(arrays[i]);
        for (const elem of setArray) {
            const count = set.get(elem) || 0;
            set.set(elem, count + 1);
        }
    }
    return arrays[0].filter((e) => {
        return set.get(e) >= n;
    });
};

const existsInAllFiles = () => {
    if (benchmark) console.time("existsInAllFiles");
    const res = existInNArrays(readFiles(pathToData), 20);
    if (benchmark) console.timeEnd("existsInAllFiles");
    return res;
};

const existInAtLeastTen = () => {
    if (benchmark) console.time("existInAtLeastTen");
    const res = existInNArrays(readFiles(pathToData), 10);
    if (benchmark) console.timeEnd("existInAtLeastTen");
    return res;
};

console.log("Unique values: ", uniqueValues().size);
console.log("Exist in all files: ", existsInAllFiles().length);
console.log("Exist in at least 10 files: ", existInAtLeastTen().length);
