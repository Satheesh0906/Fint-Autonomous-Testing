const {
	updateTestCaseStatus,
} = require('../../../../../main/utils/jiraIntegrationUtils');

Feature('Nuskin Shopping cart');

Scenario(
	'NUS-T1_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T7_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T6_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T5_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T4_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T3_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);

Scenario(
	'NUS-T2_Create a scenario to check the shopping cart',
	async ({ I }) => {
		let testCaseId = 'NUS-T1';

		try {
			await I.logInfo('Step 1: Navigate to url');
			await I.amOnPage('https://example.com');

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
	}
);
