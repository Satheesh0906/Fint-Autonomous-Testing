const { createTestCycle } = require('./src/main/utils/jiraIntegrationUtils');
const OpenAI = require('openai');
const { setWindowSize } = require('@codeceptjs/configure');
const config = require('./config');
require('./heal');

setWindowSize(1080, 700);
exports.config = {
	name: 'FAT',
	tests: 'src/test/web/nus/**/**/*.js',
	output: './output',
	helpers: {
		Playwright: {
			url: '',
			show: false,
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
		// "ResembleHelper": {
		//     "require": "codeceptjs-resemblehelper",
		//     "screenshotFolder": "./output/",
		//     "baseFolder": "./src/visual/base",
		//     "diffFolder": "./src/visual/actual"
		// },
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
		data: './data.js',
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
		console.log('Test Cycle Key:', key);
	},
	plugins: {
		heal: {
			enabled: true,
		},
		retryFailedStep: {
			enabled: true,
		},
		stepByStepReport: {
			enabled: false,
			screenshotsForAllureReport: true,
			deleteSuccessful: false,
			animateSlides: false,
			output: './output/animatedSlides',
			fullPageScreenshots: true,
			disableScreenshotOnFailure: false,
		},
		screenshotOnFail: {
			enabled: true,
			uniqueScreenshotNames: true,
			fullPageScreenshots: true,
		},
		allure: {
			enabled: true,
			require: '@codeceptjs/allure-legacy',
			outputDir: './output/allure-results',
		},
		reportportal: {
			enabled: true,
			require: '@reportportal/agent-js-codecept',
			token: config.reportPortalKey,
			endpoint: 'http://20.244.5.65:8080/api/v1',
			projectName: 'superadmin_personal',
			launchName: 'FAT TESTS',
			description: 'tests for the sales',
			debug: false,
			rerun: false,
		},
		multiple: {
			parallel: {
				chunks: 2,
			},
		},
	},
	require: ['./eventListeners.js'],
	hooks: {},
	ai: {
		request: async (messages) => {
			const openai = new OpenAI({ apiKey: config.apikeyCode });
			const completion = await openai.chat.completions.create({
				model: config.model,
				messages,
			});
			// return only text content
			return completion?.choices[0]?.message?.content;
		},
	},
};
