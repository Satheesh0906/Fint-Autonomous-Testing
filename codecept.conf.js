const { createTestCycle } = require('./src/main/utils/jiraIntegrationUtils');
const OpenAI = require('openai');
const { setWindowSize } = require('@codeceptjs/configure');
const { common } = require('./config');
require('./heal');

setWindowSize(1080, 700);
exports.config = {
	name: 'FAT',
	tests: 'src/test/**/**/**/*.js',
	output: './output',
	helpers: {
		Playwright: {
			url: '',
			show: true,
			windowSize: '1200x900',
			browser: 'chromium',
			waitForNavigation: 'domcontentloaded',
			waitForAction: 200,
			getPageTimeout: 10000,
			waitForTimeout: 10000,
			video: true,
			trace: true,
		},
		AI: {},
		PlaywrightCustomHelper: {
			require: './src/main/helpers/playwright_helper.js',
		},
		ResembleHelper: {
			require: 'codeceptjs-resemblehelper',
			screenshotFolder: './output/',
			baseFolder: './src/test/visual/base',
			diffFolder: './src/test/visual/actual',
		},
		REST: {
			endpoint: 'https://petstore.swagger.io/v2',
			prettyPrintJson: true,
			defaultHeaders: {
				// use Bearer Authorization
				// 'Authorization': 'Bearer 11111',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		JSONResponse: {},
	},
	include: {
		I: './steps_file.js',
		HomePage: './src/main/pages/home.page.js',
		//data: './data.js',
		ReadDataUtil: './src/main/frameworkUtils/getTestData.js',
	},
	bootstrap: async () => {
		const {
			testCycleId: id,
			testCycleKey: key,
			testCycleName: name,
		} = await createTestCycle();
		global.testCycleId = id;
		global.testCycleKey = key;
		global.testCycleName = name;

		console.log(`Initialized Test Cycle ID: ${global.testCycleId}`);
		console.log(`Initialized Test Cycle Name: ${global.testCycleName}`);
		console.log(`Initialized Test Cycle Key: ${global.testCycleKey}`);
	},
	mocha: {
		reporterOptions: {
			reportDir: 'output',
			reportFilename: 'report',
			inlineAssets: true,
			reportPageTitle: 'Test Report',
			reportTitle: 'FAT Test Execution Report',
			enableCharts: true,
		},
	},
	plugins: {
		heal: {
			enabled: true,
		},
		retryFailedStep: {
			enabled: true,
		},
		screenshotOnFail: {
			enabled: true,
		},
		allure: {
			enabled: false,
			require: '@codeceptjs/allure-legacy',
			outputDir: './output/allure-results',
		},
		reportportal: {
			enabled: true,
			require: '@reportportal/agent-js-codecept',
			token: 'new_8hyYvli2RsODHrSzYGu3jiDCKyUcAGR8d2aYuTR5Vc5Lr56ey07H9eycBFgg4b4P',
			endpoint: 'http://20.244.5.65:8080/api/v1',
			projectName: 'superadmin_personal',
			launchName: 'Fat Web and Api Tests',
			description: 'tests for the sales',
			debug: false,
			rerun: false,
		},
	},
	hooks: {},
	custom: {
		swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json', // Add the Swagger URL here
	},
	ai: {
		request: async (messages) => {
			const openai = new OpenAI({ apiKey: common.apikeyCode });
			const completion = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo-0125',
				messages,
			});
			// return only text content
			return completion?.choices[0]?.message?.content;
		},
	},
};
