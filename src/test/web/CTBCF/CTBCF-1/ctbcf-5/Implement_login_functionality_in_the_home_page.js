const {
	updateTestCaseStatus,
} = require('../../../../../main/utils/jiraIntegrationUtils');
const { logger } = require('../../../../../../logger');
Feature('Implement login functionality in the home page');
Scenario('CTBCF-T1_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T2_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T3_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');
		await I.logInfo('Verified the welcome message');

		await I.fillField('email', 'test@example.com');
		await I.logInfo('Filled the email field');
		await I.fillField('phone number', '1234567890');
		await I.logInfo('Filled the phone number field');
		await I.fillField('confirm phone number', '1234567890');
		await I.logInfo('Filled the confirm phone number field');
		await I.selectOption('Country List', 'United States');
		await I.logInfo('Selected United States from Country List');

		await I.click('View Disclosures');
		await I.logInfo('Opened View Disclosures link');
		await I.click('Close Disclosures');
		await I.logInfo('Closed View Disclosures link');

		await I.checkOption('ACCEPT');
		await I.logInfo('Checked the checkbox of ACCEPT');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T4_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');
		await I.logInfo('Verified the welcome message');

		await I.fillField('email', 'test@example.com');
		await I.logInfo('Filled the email field');
		await I.fillField('phone number', '1234567890');
		await I.logInfo('Filled the phone number field');
		await I.fillField('confirm phone number', '1234567890');
		await I.logInfo('Filled the confirm phone number field');
		await I.selectOption('Country List', 'United States');
		await I.logInfo('Selected United States from Country List');

		await I.click('View Disclosures');
		await I.logInfo('Opened View Disclosures link');
		await I.click('Close Disclosures');
		await I.logInfo('Closed View Disclosures link');

		await I.checkOption('ACCEPT');
		await I.logInfo('Checked the checkbox of ACCEPT');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T5_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');
		await I.logInfo('Verified the welcome message');

		await I.fillField('email', 'test@example.com');
		await I.logInfo('Filled the email field');
		await I.fillField('phone number', '1234567890');
		await I.logInfo('Filled the phone number field');
		await I.fillField('confirm phone number', '1234567890');
		await I.logInfo('Filled the confirm phone number field');
		await I.selectOption('Country List', 'United States');
		await I.logInfo('Selected United States from Country List');

		await I.click('View Disclosures');
		await I.logInfo('Opened View Disclosures link');
		await I.click('Close Disclosures');
		await I.logInfo('Closed View Disclosures link');

		await I.checkOption('ACCEPT');
		await I.logInfo('Checked the checkbox of ACCEPT');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T6_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');
		await I.logInfo('Verified the welcome message');

		await I.fillField('email', 'test@example.com');
		await I.logInfo('Filled the email field');
		await I.fillField('phone number', '1234567890');
		await I.logInfo('Filled the phone number field');
		await I.fillField('confirm phone number', '1234567890');
		await I.logInfo('Filled the confirm phone number field');
		await I.selectOption('Country List', 'United States');
		await I.logInfo('Selected United States from Country List');

		await I.click('View Disclosures');
		await I.logInfo('Opened View Disclosures link');
		await I.click('Close Disclosures');
		await I.logInfo('Closed View Disclosures link');

		await I.checkOption('ACCEPT');
		await I.logInfo('Checked the checkbox of ACCEPT');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T7_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T8_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T9_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T10_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T11_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});

Scenario('CTBCF-T12_Create and verify checking account', async ({ I }) => {
	let testCaseId = 'CTBCF-T1';

	try {
		await I.amOnPage(
			'https://fint-dev-digitalbanking.azurewebsites.net/?source=0'
		);
		await I.logInfo('Navigated to home page with URL');
		await I.see('Welcome');

		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Pass',
			'Test passed successfully'
		);
	} catch (error) {
		await updateTestCaseStatus(
			testCycleKey,
			testCaseId,
			'Fail',
			`Test failed with error: ${error.message}`
		);
	}
});
