const { initializeOpenAI } = require('../utils/openaiUtils');
const axios = require('axios');
const logger = require('../../../logger');
const SwaggerParser = require('swagger-parser');
const fs = require('fs');
const path = require('path');

async function fetchSwaggerJson(url) {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		logger.error('Error fetching Swagger JSON file:', error);
		return null;
	}
}

async function parseSwagger(filePath) {
	try {
		const api = await SwaggerParser.validate(filePath);
		const { paths } = api;

		const endpoints = [];
		for (const [path, methods] of Object.entries(paths)) {
			for (const [method, details] of Object.entries(methods)) {
				endpoints.push({ path, method, details });
			}
		}

		return endpoints;
	} catch (error) {
		console.error('Error parsing Swagger file:', error);
		return [];
	}
}

async function generateAPITestsAI(tests) {
	const getTests = [];
	const postTests = [];
	const putTests = [];
	const deleteTests = [];

	for (const test of tests) {
		const prompt = `
            Generate an API test for the following endpoint:
            - Path: ${test.path}
            - Method: ${test.method}
            - Summary: ${test.summary}
            - Parameters: ${JSON.stringify(test.parameters)}
            - Expected Responses: ${JSON.stringify(test.responses)}

            Write the test in JavaScript using CodeceptJS with I.logInfo step details.:
        `;

		try {
			const response = await initializeOpenAI.chat.completions.create({
				model: 'gpt-4', // Specify the model
				messages: [{ role: 'user', content: prompt }],
				max_tokens: 1000,
				temperature: 0.7,
			});

			if (
				response &&
				response.data &&
				response.data.choices &&
				response.data.choices.length > 0
			) {
				const generatedTest =
					response.data.choices[0].message.content.trim();

				// Categorize tests based on the method
				switch (test.method) {
					case 'GET':
						getTests.push(generatedTest);
						break;
					case 'POST':
						postTests.push(generatedTest);
						break;
					case 'PUT':
						putTests.push(generatedTest);
						break;
					case 'DELETE':
						deleteTests.push(generatedTest);
						break;
					default:
						console.error(`Unhandled method type: ${test.method}`);
						break;
				}
			} else {
				console.error('Unexpected response format:', response);
				throw new Error('Invalid response from OpenAI API');
			}
		} catch (error) {
			console.error('Error generating test:', error);
			throw error;
		}
	}

	return { getTests, postTests, putTests, deleteTests };
}

function writeTestsToFile(testCases, method) {
	const dir = path.join(__dirname, 'generatedTests');
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const filePath = path.join(dir, `${method.toLowerCase()}Tests_test.js`);
	const fileContent = testCases.join('\n\n');

	fs.writeFileSync(filePath, fileContent, 'utf8');
	console.log(`Generated ${method} tests written to ${filePath}`);
}

// Example continuation from the previous fetch and parse
(async () => {
	const url = 'https://petstore.swagger.io/v2/swagger.json'; // Replace with your Swagger file URL
	try {
		const swaggerJson = await fetchSwaggerJson(url);
		const tests = await parseSwagger(swaggerJson);
		const { getTests, postTests, putTests, deleteTests } =
			await generateAPITestsAI(tests);

		// Write tests to separate files
		writeTestsToFile(getTests, 'GET');
		writeTestsToFile(postTests, 'POST');
		writeTestsToFile(putTests, 'PUT');
		writeTestsToFile(deleteTests, 'DELETE');
	} catch (error) {
		console.error('Error generating API tests:', error);
	}
})();
