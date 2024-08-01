// const fs = require("fs");
// const XLSX = require("xlsx");

// // Read JSON data
// const jsonData = JSON.parse(fs.readFileSync("Extracted_Text.json", "utf8"));

// // Read Excel data
// const workbook = XLSX.readFile("convert.xlsx");
// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];
// const excelData = XLSX.utils.sheet_to_json(worksheet);

// // Read mappings from config.json
// const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
// const mappings = config.mappings;

// // Fetch the first JSON object and the first row of Excel data
// const firstJsonItem = jsonData[0];
// const firstExcelRow = excelData[0];

// // Print the first JSON object and the first row of Excel data
// console.log("First JSON object:");
// console.log(firstJsonItem);

// console.log("First row of Excel data:");
// console.log(firstExcelRow);

const fs = require("fs");
const XLSX = require("xlsx");

// Read JSON data
const jsonData = JSON.parse(fs.readFileSync("Extracted_Text.json", "utf8"));

// Read Excel data
const workbook = XLSX.readFile("convert.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const excelData = XLSX.utils.sheet_to_json(worksheet);

// Read mappings from config.json
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const mappings = config.mappings;

// Create a mapping from Excel headers to JSON keys
const headers = Object.keys(mappings);
const headerIndices = headers.reduce((acc, header) => {
  console.log(acc, " ", header);
  const index = headers.indexOf(header);
  acc[header] = index;
  return acc;
}, {});

// Convert Excel rows to JSON objects based on headers
const excelJsonData = excelData.map((row) => {
  const obj = {};
  for (const [header, jsonKey] of Object.entries(mappings)) {
    const index = headerIndices[header];
    obj[jsonKey] = row[header];
  }
  return obj;
});

// Compare JSON data with Excel data row by row
jsonData.forEach((jsonItem, jsonIndex) => {
  const excelItem = excelJsonData[jsonIndex];

  if (excelItem) {
    const differences = [];

    for (const jsonKey in jsonItem) {
      if (jsonItem.hasOwnProperty(jsonKey)) {
        const jsonValue = jsonItem[jsonKey];
        const excelValue = excelItem[jsonKey];

        if (excelValue !== jsonValue) {
          differences.push({
            key: jsonKey,
            excelValue,
            jsonValue,
          });
        }
      }
    }

    if (differences.length > 0) {
      console.log(`Differences in row ${jsonIndex + 1}:`);
      console.log(differences);
    } else {
      console.log(`Row ${jsonIndex + 1} matches.`);
    }
  } else {
    console.log(`No corresponding Excel data for JSON row ${jsonIndex + 1}.`);
  }
});
