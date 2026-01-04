// import validator from "validator";
import fs from "fs";
import {add} from "./utils.js";
import chalk from "chalk";

console.log(chalk.blue("Welcome to the class"));
// fs.writeFileSync("notes.txt","This is my first file created using Node.js");
fs.appendFileSync("notes.txt","\nThis is an appended line.");

console.log("2 + 3 =", add(2, 3));


