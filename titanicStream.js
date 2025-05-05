import fs from 'fs';
import {Titanic} from "./model/Titanic.js";
import  readline from "readline";

const fileStream =  fs.createReadStream('./train.csv', 'utf-8');

fileStream.on('erorr', (err) => {
    console.log(err);
})
const reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
})

const dataRows = [];
let isFirstLine = true;
reader.on('line', (data) => {
    if(isFirstLine){
        isFirstLine = false;
        return;
    }
    dataRows.push(data);
});

reader.on('close', () => {
    const stats = new Titanic(dataRows, /,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log(`Total fares:`, stats.totalFares.toFixed(2));
    console.log(`Average fares by classes:`, stats.avgFaresByClasses)
    console.log(stats.totalSurvived);
    console.log(stats.totalSurvivedByGender);
    console.log(stats.totalSurvivedChildren)
})

