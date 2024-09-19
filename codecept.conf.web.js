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
			show: true,
			windowSize: '1000X600',
			browser: 'chromium',
			//channel: 'msedge',
			waitForNavigation: 'load',
			waitForNavigation: 'domcontentloaded',
			waitForNavigation: 'commit',
			waitForAction: 1000,
			getPageTimeout: 100000,
			waitForTimeout: 100000,
			video: true,
			trace: true,
			smartWait: 10000,
			highlightElement: true,
			chromium: {
				args: [
					'--no-sandbox', // Disables sandboxing
					'--disable-gpu', // Disables GPU hardware acceleration
					// '--headless',                   // Runs the browser in headless mode
					'--window-size=1000,600', // Sets the initial window size
					'--disable-dev-shm-usage', // Avoids potential issues with shared memory
					'--disable-extensions', // Disables extensions
					'--incognito', // Opens browser in incognito mode
					'--disable-notifications', // Disables browser notifications
					'--disable-infobars', // Disables info bars
					'--ignore-certificate-errors', // Ignores SSL certificate errors
					'--disable-popup-blocking', // Disables popup blocking
					'--deny-permission-prompts', // Denies all permission prompts
					'--suppress-message-center-popups',
				],
			},
			bypassCSP: true,
		},
		ExpectHelper: {},
		FileSystem: {},
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
