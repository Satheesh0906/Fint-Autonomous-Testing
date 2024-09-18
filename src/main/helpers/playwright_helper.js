const Helper = require('@codeceptjs/helper');
const log4js = require('log4js');
const { chromium } = require('playwright');
const environment = process.env.NODE_ENV || 'test';

class PlaywrightCustomHelper extends Helper {
	// before/after hooks
	/**
	 * @protected
	 */
	_before() {
		// console.log("--- in before ---")
	}

	/**
	 * @protected
	 */
	_after() {
		// remove if not used
		//console.log("--- in after ---")
	}

	async getContrastRatioForElement() {
		const browser = await chromium.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(componentURL);
		return page;
	}

	async open_skin_and_beauty_Page() {
		const browser = await chromium.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(skin_and_beauty_url);
		return page;
	}

	async logInfo(logVal) {
		log4js.configure({
			appenders: {
				console: { type: 'console' }, // Log to console
				file: { type: 'file', filename: 'logs/FAT.log' }, // Log to a file
			},
			categories: {
				default: { appenders: ['console', 'file'], level: 'info' },
			},
		});
		log4js.getLogger('FAT').info(logVal);
	}

	async logError(logVal) {
		log4js.configure({
			appenders: {
				console: { type: 'console' }, // Log to console
				file: { type: 'file', filename: 'logs/FAT.log' }, // Log to a file
			},
			categories: {
				default: { appenders: ['console', 'file'], level: 'info' },
			},
		});
		log4js.getLogger('FAT').error(logVal);
	}
}

module.exports = PlaywrightCustomHelper;
