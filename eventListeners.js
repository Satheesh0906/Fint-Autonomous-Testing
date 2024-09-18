const { event } = require('codeceptjs');

const {
	updateTestCaseStatus,
	logInfo,
} = require('./src/main/utils/jiraIntegrationUtils');

let lastScreenshotName = null; // This will hold the screenshot name
let i = 0;
event.dispatcher.on(event.test.failed, async (test, error) => {
	const I = actor();
	await updateTestCaseStatus(
		global.testCycleKey,
		global.testCaseId,
		'Fail',
		`Test failed with error from event: ${error.message}`
	);
	// Generate a dynamic screenshot name
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	lastScreenshotName = `${test.title.replace(/ /g, '_')}_${timestamp}.png`;

	// Capture the screenshot with the dynamic name
	I.saveScreenshot(lastScreenshotName);

	console.log(`Screenshot captured: ${lastScreenshotName}`);
	await logInfo(
		'---[' + test.title + ' ]---Test failed with error:' + error.message
	);
});
event.dispatcher.on(event.test.started, async (test, error) => {
	await logInfo('---[' + test.title + ' started]---');
});
event.dispatcher.on(event.test.finished, async (test, error) => {
	i = 0;
});
event.dispatcher.on(event.test.passed, async (test, error) => {
	updateTestCaseStatus(
		global.testCycleKey,
		global.testCaseId,
		'Pass',
		'Test passed successfully'
	);
	await logInfo('---[' + test.title + ' passed]---');
});

event.dispatcher.on(event.step.passed, async (step, test) => {
	if (
		!step.toString().includes('log info') &&
		!step.toString().includes('grab htmlfrom') &&
		!step.toString().includes('I wait') &&
		!step.toString().includes('I grab source') &&
		!step.toString().includes('save screenshot')
	) {
		let logText =
			'Step:' + ++i + '--> ' + step.toString() + ':' + step.status;
		await logInfo(logText);
		//console.log(logText); // Output: "I click #loginButton"
	}
});
let flag = true;
event.dispatcher.on(event.step.failed, async (step) => {
	if (flag) {
		let logText =
			'Step:' + ++i + '--> ' + step.toString() + ':' + step.status;
		await logInfo(logText);
		//console.log(logText); // Output: "I click #loginButton"
		flag = false;
	}
});
module.exports = {
	getLastScreenshotName: () => lastScreenshotName,
};
