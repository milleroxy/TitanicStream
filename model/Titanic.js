import readline from "readline";
import fs from "fs";

export class Titanic {
    constructor(src, separator) {
        this.src = src;
        this.separator = separator;
    }

    async _processLines(process) {
        const reader = readline.createInterface({
            input: fs.createReadStream('./train.csv', 'utf8'),
            crlfDelay: Infinity
        });
        let isFirstLine = true;
        for await (const line of reader) {
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }
            const cells = line.split(this.separator);
            process(cells);
        }
    }

    async totalFares() {
        let res = 0;
        await this._processLines(cells => {
            res += cells[9] && +cells[9];
        })
        console.log(`Total Fares : ${res.toFixed(2)}`);
    }

    async avgFaresByClasses() {
        let res = {};
        await this._processLines(cells => {
            if (cells[9]) {
                const info = {pClass: cells[2], fare: +cells[9]}
                const key = info.pClass;
                if (!res[key]) {
                    res[key] = [];
                }
                res[key].push(info.fare);
            }
        })
        for (const key in res) {
            res[key] = +(res[key].reduce((a, b) => a + b) / res[key].length).toFixed(2);
        }
        console.log(`Average fares by classes:`, res);
    }

    async totalSurvived() {
        let res = {};
        await this._processLines(cells => {
            const key = +cells[1] ? 'Survived' : 'Non survived';
            if (!res[key]) {
                res[key] = 0;
            }
            res[key]++;
        });
        console.log(res);
    }

    async totalSurvivedByGender() {
        let res = {};
        await this._processLines(cells => {
            const key = this._survivedGender(cells[4], cells[1]);
            if (!res[key]) {
                res[key] = 0;
            }
            res[key]++;
        })
        console.log(res);
    }

    async totalSurvivedChildren() {
        let res = {};
        await this._processLines(cells => {
            if (cells[5] && cells[5] < 18) {
                const key = +cells[1] ? 'Children survived' : 'Children non survived';
                if (!res[key]) {
                    res[key] = 0;
                }
                res[key]++;
            }
        })
        console.log(res);
    }

    async showStats() {
        await this.totalFares();
        await this.avgFaresByClasses();
        await this.totalSurvived();
        await this.totalSurvivedByGender();
        await this.totalSurvivedChildren();
    }

    _survivedGender(gender, survived) {
        survived = +survived ? 'survived' : 'non survived';
        return gender + " " + survived;
    }
}