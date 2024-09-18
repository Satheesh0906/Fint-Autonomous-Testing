const fs = require('fs');
const path = require('path');
const config = require('../../../config');
const { initializeOpenAI, sendPrompt } = require('../utils/openaiUtils');

global.projectRoot = path.resolve(__dirname, '../../..').toString();
const baseDir = path.join(global.projectRoot, 'src', 'test', 'api');
const dataDir = path.join(baseDir, '.', 'testData');

const prompt = `Generate test data with variables for get, post, put, and delete mentioned in the swagger ${config.swaggerUrl} for all of them without response and create a file in the json format `;

async function swaggerApiTestDataGenerator(prompt) {
	try {
		// Initialize OpenAI
		const openai = initializeOpenAI();

		// Create a chat completion using the OpenAI API
		const response = await sendPrompt(openai, {
			model: config.model,
			prompt: prompt,
			cookieString: '', // Assuming no cookies are needed here
			stop: null,
		});

		const testData = response.choices[0].message.content;
		console.log(testData);

		// Define the directory and file path where the JSON file will be saved
		const dirPath = dataDir;
		const filePath = path.join(dirPath, 'api_test_data.json');

		// Ensure the directory exists
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Write the generated test data to the file in JSON format
		fs.writeFileSync(filePath, testData, 'utf8');
		console.log(`Test data saved to ${filePath}`);

		return testData;
	} catch (error) {
		console.error('Error generating test data:', error);
		return null;
	}
}

swaggerApiTestDataGenerator(prompt);
