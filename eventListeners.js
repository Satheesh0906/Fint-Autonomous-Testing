const { event } = require('codeceptjs');

let lastScreenshotName = null; // This will hold the screenshot name

event.dispatcher.on(event.test.failed, async (test, error) => {
	const I = actor();

	// Generate a dynamic screenshot name
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	lastScreenshotName = `${test.title.replace(/ /g, '_')}_${timestamp}.png`;

	// Capture the screenshot with the dynamic name
	I.saveScreenshot(lastScreenshotName);

	console.log(`Screenshot captured: ${lastScreenshotName}`);
});

module.exports = {
	getLastScreenshotName: () => lastScreenshotName,
};
