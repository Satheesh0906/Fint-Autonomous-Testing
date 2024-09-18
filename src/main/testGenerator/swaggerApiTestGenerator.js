const fs = require('fs');
const path = require('path');
const axios = require('axios');
const SwaggerParser = require('swagger-parser');
const logger = require('../../../logger');
const { codeConfig } = require('../../../codecept.conf.api');

// Ensure codeConfig and helpers.rest.endpoint are defined
const baseUrl =
	codeConfig?.helpers?.rest?.endpoint || 'https://petstore.swagger.io/v2';

// Initialize the project root directory
global.projectRoot = path.resolve(__dirname, '../../..').toString(); // Adjust the path as needed
const apiDir = path.join(global.projectRoot, 'src', 'test', 'api');

async function fetchSwaggerJson(url) {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		logger.error('Error fetching Swagger JSON file:', error);
		throw error;
	}
}

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

function getExampleValue(schema) {
	switch (schema.type) {
		case 'string':
			return schema.example || 'example string';
		case 'integer':
			return schema.example || 0;
		case 'boolean':
			return schema.example || true;
		case 'array':
			return [getExampleValue(schema.items)];
		case 'object':
			return Object.fromEntries(
				Object.entries(schema.properties).map(([prop, propDetails]) => [
					prop,
					getExampleValue(propDetails),
				])
			);
		default:
			return null;
	}
}

async function extractRequestBody(details) {
	if (details.requestBody && details.requestBody.content) {
		const { schema } = Object.values(details.requestBody.content)[0];
		return getExampleValue(schema);
	}
	return {};
}

function generateTestName(path) {
	return path
		.replace(/\/\{.*?\}/g, '')
		.replace(/\//g, '_')
		.replace(/__+/g, '_')
		.replace(/^_+|_+$/g, '');
}

function createDirectories(baseDir) {
	const testDir = path.join(baseDir, 'tests');
	const dataDir = path.join(baseDir, 'testData');
	[testDir, dataDir].forEach((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	});
	return { testDir, dataDir };
}

function initializeTestFiles(testDir) {
	console.log(testDir);
	const methods = ['get', 'post', 'put', 'delete'];
	return methods.reduce((files, method) => {
		const filePath = path.join(testDir, `${method}_api_test.js`);
		fs.writeFileSync(
			filePath,
			`const logger = require("../../../../logger"); \nconst apiTestData = require('../../../test/api/testData/api_test_data.json');\nFeature('API - ${method.toUpperCase()} Requests');\n`
		);
		files[method] = filePath;
		return files;
	}, {});
}

function appendTestScenario(testFiles, method, path, testName = {}) {
	const methodName = method.toUpperCase();
	const loggerInfo = `logger.info('Running ${methodName} ${testName} ${methodName} : ${path}');
`;
	const responseLogging = `logger.info(\`Response Status: \${response.status}\`);
logger.info(\`Response Data: \${JSON.stringify(response.data)}\`);
`;

	const scenarioCode = {
		get: `
		Scenario('Verify ${methodName} ${testName}', { retries: 1 }, async ({ I }) => {
		  ${loggerInfo}
		  const response = await I.sendGetRequest('${path}');
		  ${responseLogging}
		  I.seeResponseCodeIs(200);
		});
`,
		post: `
Scenario('Verify ${methodName} ${testName}', { retries: 1 }, async ({ I }) => {
  ${loggerInfo}
  const testData = require('../testData/api_test_data.json')['${path}']['${method}'];
  const response = await I.sendPostRequest('${path}', testData);
  ${responseLogging}
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson(testData);
});
`,
		put: `
Scenario('Verify ${methodName} ${testName}', { retries: 1 }, async ({ I }) => {
  ${loggerInfo}
  const testData = require('../testData/api_test_data.json')['${path}']['${method}'];
  const response = await I.sendPutRequest('${path}', testData);
  ${responseLogging}
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson(testData);
});
`,
		delete: `
Scenario('Verify ${methodName} ${testName}', { retries: 1 }, async ({ I }) => {
  ${loggerInfo}
  const response = await I.sendDeleteRequest('${path}');
  ${responseLogging}
  I.seeResponseCodeIs(200);
});
`,
	};

	fs.appendFileSync(testFiles[method], scenarioCode[method]);
}

async function swaggerApiTestGenerator(swaggerUrl, customBaseDir = apiDir) {
	try {
		console.log('swaggerUrl: ' + swaggerUrl);
		const swaggerJson = await fetchSwaggerJson(swaggerUrl);
		const endpoints = await parseSwagger(swaggerJson);

		const { testDir, dataDir } = createDirectories(customBaseDir);
		const testFiles = initializeTestFiles(testDir);
		const testData = {};

		for (const { path, method, details } of endpoints) {
			const testName = generateTestName(path);
			let requestBody = {};

			if (['post', 'put'].includes(method)) {
				requestBody = await extractRequestBody(details);
				if (!requestBody) {
					logger.error(
						`Failed to generate test data for ${method.toUpperCase()} ${path}`
					);
					continue;
				}
			}

			if (!testData[path]) {
				testData[path] = {};
			}
			testData[path][method] = requestBody;

			appendTestScenario(testFiles, method, path, testName);
		}

		const testDataFile = path.join(dataDir, 'api_test_data.json');
		fs.writeFileSync(testDataFile, JSON.stringify(testData, null, 2));
		logger.info('API test cases and test data generated and saved.');
	} catch (error) {
		logger.error('Error during API test generation:', error);
	}
}

// Ensure codeConfig and custom property are defined
const swaggerUrl =
	codeConfig?.custom?.swaggerUrl ||
	'https://petstore.swagger.io/v2/swagger.json';

// Example usage
swaggerApiTestGenerator(swaggerUrl);
