import {Titanic} from "./model/Titanic.js";

const stats = new Titanic('./train.csv', /,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
stats.showStats()