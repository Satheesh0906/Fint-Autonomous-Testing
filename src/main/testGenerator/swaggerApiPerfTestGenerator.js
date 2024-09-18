const fs = require('fs');
const path = require('path');
const axios = require('axios');
const SwaggerParser = require('swagger-parser');
const logger = require('../../../logger');
const { codeConfig } = require('../../../codecept.conf.api');

// Initialize the project root directory
global.projectRoot = path.resolve(__dirname, '../../..').toString();
const apiDir = path.join(global.projectRoot, 'src', 'test', 'api');
const baseUrl = 'https://petstore.swagger.io/v2';

// Function to fetch Swagger JSON
async function fetchSwaggerJson(url) {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		logger.error('Error fetching Swagger JSON file:', error);
		throw error;
	}
}

// Function to parse Swagger JSON and extract endpoints
async function parseSwagger(json) {
	try {
		const api = await SwaggerParser.validate(json);
		const endpoints = Object.entries(api.paths).flatMap(([path, methods]) =>
			Object.entries(methods).map(([method, details]) => ({
				path,
				method,
				details,
			}))
		);
		return endpoints;
	} catch (error) {
		logger.error('Error parsing Swagger file:', error);
		throw error;
	}
}

// Function to create performance test directories
function createPerformanceDirectories(baseDir) {
	const testDir = path.join(baseDir, 'perfTests');
	if (!fs.existsSync(testDir)) {
		fs.mkdirSync(testDir, { recursive: true });
	}
	return { testDir };
}

// Function to TestGenerator random name
function generateRandomName() {
	return 'User' + Math.floor(Math.random() * 10000); // Generates random name like "User1234"
}

// Initialize k6 script file for a specific method
function initializeK6ScriptFile(testDir, method) {
	const filePath = path.join(testDir, `${method}_perf_api_test.js`);

	// Script template with session management and login logic
	const initialContent = `const http = require('k6/http');
const { check, sleep } = require('k6');
const testData = JSON.parse(open('../../../test/api/testData/api_test_data.json')); 

const options = {
    vus: 10, // Virtual users
    duration: '1m', // Test duration
};

// Function to perform login and return the session token or cookie
// function login() {
//     const url = config.swaggerUrl;  // Login endpoint
//     const payload = JSON.stringify({
//         username: config.username,
//         password: config.password,
//     });
//     const params = {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     };
//     const response = http.post(url, payload, params);
//
//     check(response, {
//         'login was successful': (r) => r.status === 200,
//     });
//
//     // Extract token from response body
//     const authToken = JSON.parse(response.body).token; // Example: Extract token from response body
//     return authToken;  // Return the token to be used in subsequent requests
// }

function defaultFunction() {
  
    //const token = login();
    const headers = {
      //  'Authorization': \`Bearer \${token}\`,  // Pass the token as a Bearer token
        'Content-Type': 'application/json',
    };
`;
	fs.writeFileSync(filePath, initialContent);
	return filePath;
}

function formatApiPath(apiPath) {
	// Remove leading and trailing slashes, split by '/', and filter out empty parts
	const parts = apiPath.replace(/^\//, '').split('/').filter(Boolean);

	// Convert parts into camelCase and remove curly brackets
	const formatted =
		parts
			.map((part, index) => {
				// Remove curly braces from placeholders like {petId}
				if (part.startsWith('{') && part.endsWith('}')) {
					part = part.slice(1, -1); // Remove curly brackets
				}

				// For the first part, keep it lowercase; capitalize subsequent parts correctly
				return index === 0
					? part.toLowerCase() // Keep the first word lowercase
					: part.charAt(0).toUpperCase() +
							part.slice(1).toLowerCase(); // Capitalize first letter of subsequent words
			})
			.join('') + 'Response'; // Join parts and append 'Response'

	return formatted;
}

// Append all API requests of the same type into one default function
function appendK6Scenario(testFile, method, apiPath) {
	const cleanPath = formatApiPath(apiPath);
	let randomName = generateRandomName();

	const k6Scenario = {
		get: `
    let ${cleanPath} = http.get('${baseUrl}${apiPath}', { headers });
    check(${cleanPath}, {
        'GET ${apiPath} status is 200': (r) => r.status === 200,
    });
    sleep(1); 
`,
		post: `
    const ${cleanPath}payload = JSON.stringify({ id: 12345, name: '${randomName}', status: 'available' });
    let ${cleanPath} = http.post('${baseUrl}${apiPath}', ${cleanPath}payload, { headers });
    check(${cleanPath}, {
        'POST ${apiPath} status is 200': (r) => r.status === 200,
    });
    sleep(1); 
`,
		put: `
    const ${cleanPath}payload = JSON.stringify({ id: 12345, name: '${randomName}', status: 'available' });
    let ${cleanPath} = http.put('${baseUrl}${apiPath}', ${cleanPath}payload, { headers });
    check(${cleanPath}, {
        'PUT ${apiPath} status is 200': (r) => r.status === 200,
    });
    sleep(1); 
`,
		delete: `
    let ${cleanPath} = http.del('${baseUrl}${apiPath}', { headers });
    check(${cleanPath}, {
        'DELETE ${apiPath} status is 200': (r) => r.status === 200,
    });
    sleep(1); 
`,
	};
	// Append the appropriate scenario to the file
	fs.appendFileSync(testFile, k6Scenario[method]);
}

// Close the k6 script and add module.exports
function finalizeK6ScriptFile(testFile) {
	const finalContent = `\n}\nmodule.exports = { options, default: defaultFunction };\n`;
	fs.appendFileSync(testFile, finalContent);
}

// Function to TestGenerator k6 performance tests
async function generateK6PerformanceTests(swaggerUrl, customBaseDir = apiDir) {
	try {
		if (!swaggerUrl) {
			throw new Error('Swagger URL is not defined.');
		}

		console.log(
			'Generating K6 performance api tests from the Swagger URL:',
			swaggerUrl
		);
		const swaggerJson = await fetchSwaggerJson(swaggerUrl);
		const endpoints = await parseSwagger(swaggerJson);

		const { testDir } = createPerformanceDirectories(customBaseDir);
		const testFiles = {
			get: initializeK6ScriptFile(testDir, 'get'),
			post: initializeK6ScriptFile(testDir, 'post'),
			put: initializeK6ScriptFile(testDir, 'put'),
			delete: initializeK6ScriptFile(testDir, 'delete'),
		};

		// Append all scenarios into separate files based on HTTP method
		for (const { path, method } of endpoints) {
			if (['get', 'post', 'put', 'delete'].includes(method)) {
				appendK6Scenario(testFiles[method], method, path);
			}
		}

		// Finalize each script file by closing the function and adding module.exports
		finalizeK6ScriptFile(testFiles.get);
		finalizeK6ScriptFile(testFiles.post);
		finalizeK6ScriptFile(testFiles.put);
		finalizeK6ScriptFile(testFiles.delete);

		logger.info(
			`k6 performance test scripts generated and saved in the api directory ${testDir}`,
			testDir
		);
	} catch (error) {
		logger.error('Error during k6 performance test generation:', error);
	}
}

const swaggerUrl =
	codeConfig?.custom?.swaggerUrl ||
	'https://petstore.swagger.io/v2/swagger.json';
generateK6PerformanceTests(swaggerUrl);
