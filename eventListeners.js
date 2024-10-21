const { event } = require('codeceptjs');
const fs = require('fs');
const path = require('path');

const jiraIntegrationUtils = require('./src/main/utils/jiraIntegrationUtils');

let lastScreenshotName = null; // This will hold the screenshot name
let i = 0;
let testTitle;
event.dispatcher.on(event.test.failed, async (test, error) => {
	const I = actor();
	let testID = test.title.split('_')[0];
	console.log('testID:' + testID);
	await jiraIntegrationUtils.updateTestCaseStatus(
		global.testCycleKey,
		testID,
		'Fail',
		`Test failed with error from event: ${error.message}`
	);
	// Generate a dynamic screenshot name
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	lastScreenshotName = `${test.title.replace(/ /g, '_')}_${timestamp}.png`;

	// Capture the screenshot with the dynamic name
	I.saveScreenshot(lastScreenshotName);

	console.log(`Screenshot captured: ${lastScreenshotName}`);
	await jiraIntegrationUtils.logInfo(
		'---[' + test.title + ' ]---Test failed with error:' + error.message
	);
});
event.dispatcher.on(event.test.started, async (test, error) => {
	testTitle = test.title;
	await jiraIntegrationUtils.logInfo('---[' + testTitle + ' started]---');
});
event.dispatcher.on(event.test.finished, async (test, error) => {
	i = 0;
});
event.dispatcher.on(event.test.passed, async (test, error) => {
	let testID = test.title.split('_')[0];
	console.log('testID:' + testID);
	updateTestCaseStatus(
		global.testCycleKey,
		testID,
		'Pass',
		'Test passed successfully'
	);
	await jiraIntegrationUtils.logInfo('---[' + test.title + ' passed]---');
});

event.dispatcher.on(event.step.passed, async (step, test) => {
	if (
		!step.toString().includes('log info') &&
		!step.toString().includes('grab htmlfrom') &&
		!step.toString().includes('I wait') &&
		!step.toString().includes('I grab source') &&
		!step.toString().includes('save screenshot')
	) {
		// let logText =
		// 	'Step:' + ++i + '--> ' + step.toString() + ':' + step.status;
		let logText = step.toString() + ':' + step.status;
		await jiraIntegrationUtils.logInfo(logText);
		if (step.line().includes('pause.js')) {
			await addStepToFile(step, test);
		}
	}
});
let flag = true;
event.dispatcher.on(event.step.failed, async (step) => {
	if (flag) {
		let logText =
			'Step:' + ++i + '--> ' + step.toString() + ':' + step.status;
		await jiraIntegrationUtils.logInfo(logText);
		//console.log(logText);
		flag = false;
	}
});

async function addStepToFile(step, test) {
	// Define the folder and file paths
	const folderPath = path.join(__dirname, 'AISteps'); // Folder where the file will be saved
	const filePath = path.join(folderPath, testTitle + '.txt'); // Full file path

	// Log step details (optional, useful for debugging)
	// console.log('suffix: ' + step.suffix);
	// console.log('prefix: ' + step.prefix);
	// console.log('comment: ' + step.comment);
	// console.log('args: ' + step.args);
	// console.log('metaStep: ' + step.metaStep);
	// console.log('stack: ' + step.stack);
	// console.log('name: ' + step.name);
	// console.log('helper: ' + await step.helper);
	// console.log('actor: ' + step.actor);
	// console.log('line: ' + step.line());
	// console.log('toCode(): ' + step.toCode());
	// console.log('humanize(): ' + step.humanize());

	// Check if the folder exists, if not create it
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
		console.log(`Folder created at ${folderPath}`);
	} else {
		//  console.log(`Folder already exists at ${folderPath}`);
	}

	// Append step code to file
	const code = step.toCode();
	fs.appendFileSync(filePath, code + '\n', 'utf-8');

	let logText = "I.logInfo('" + step.toString() + "');";
	//fs.appendFileSync(filePath, logText + '\n', 'utf-8');

	//console.log(`Saved toCode() to ${filePath}`);
}

async function generateInitialData(testTitle) {}
module.exports = {
	getLastScreenshotName: () => lastScreenshotName,
};
