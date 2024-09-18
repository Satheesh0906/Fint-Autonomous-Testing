const XLSX = require('xlsx');

/**
 * Parses an Excel file and converts the data into a structured array of objects.
 * Each object represents a row in the Excel sheet with headers as keys.
 *
 * @param {string} filePath - The file path of the Excel file to parse.
 * @returns {Array} - Returns an array of objects, where each object corresponds to a row of data.
 */
function parseExcelFile(filePath) {
	const workbook = XLSX.readFile(filePath);
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];

	const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

	// If the sheet is empty, log an error and return an empty array
	if (rows.length === 0) {
		console.error('No data found in the sheet.');
		return [];
	}

	const [headers, ...dataRows] = rows;

	// Map over the data rows and create an array of objects, using headers as keys
	return dataRows.map((row) => {
		return headers.reduce((acc, header, index) => {
			// Assign the row data to the corresponding header, or an empty string if data is missing
			acc[header] = row[index] || '';
			return acc;
		}, {});
	});
}

/**
 * Extracts test data from an Excel file and returns it as an array of objects.
 * Each object represents a row of data where the headers from the first row are used as keys.
 *
 * @param {string} filePath - The file path of the Excel file to extract data from.
 * @returns {Array<Object>} - An array of objects where each object corresponds to a row of data from the Excel sheet.
 */
function extractTestData(filePath) {
	// Read the Excel file into a workbook object
	const workbook = XLSX.readFile(filePath);

	// Get the first worksheet (assuming the data is in the first sheet)
	const sheet = workbook.Sheets[workbook.SheetNames[0]];

	// Convert the worksheet data into an array of arrays (header row + data rows)
	const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

	// Check if the sheet contains any data
	if (rows.length === 0) {
		console.error('No data found in the sheet.');
		return [];
	}

	// Separate the first row as headers and the rest as data rows
	const [headers, ...dataRows] = rows;

	// Format the data rows into an array of objects using the headers as keys
	const formattedArray = dataRows.map((row) => {
		return headers.reduce((acc, header, index) => {
			// Assign the row data to the corresponding header, or an empty string if the value is undefined
			acc[header] = row[index] || '';
			return acc;
		}, {});
	});

	return formattedArray;
}

module.exports = { extractTestData };

module.exports = { parseExcelFile, extractTestData };
