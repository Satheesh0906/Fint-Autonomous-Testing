const axios = require('axios');
const fs = require('fs');
const config = require('../../../config');
const FormData = require('form-data');
const { initializeOpenAI } = require('./openaiUtils');

const JIRA_API_URL = config.zapiBaseUrl;
const JIRA_API_KEY = config.zapiBearerToken;

let testCycleId = null;
let testCycleKey = null;

async function createTestCycle() {
	if (testCycleId && testCycleKey) {
		return { testCycleId, testCycleKey };
	}

	const testCycleName = `AE_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${new Date().toISOString().slice(11, 16).replace(':', '')}`;

	try {
		const response = await axios.post(
			`${JIRA_API_URL}/testcycles`,
			{
				name: testCycleName,
				projectKey: config.projectKey,
				versionId: config.projectVersion,
				description: 'Automatically created by FAT',
				startDate: new Date().toISOString().split('T')[0],
			},
			{
				headers: getJiraHeaders(),
			}
		);

		testCycleId = response.data.id;
		testCycleKey = response.data.key;
		return { testCycleId, testCycleKey, testCycleName };
	} catch (error) {
		handleError('Error creating test cycle', error);
	}
}

function getJiraHeaders() {
	return {
		Authorization: `Bearer ${JIRA_API_KEY}`,
		'Content-Type': 'application/json',
	};
}

function getTestCycleId() {
	if (!testCycleId) {
		throw new Error('Test cycle ID is not yet created.');
	}
	return testCycleId;
}

async function getJiraIssue(issueKey) {
	const url = `${config.jiraBaseUrl}/rest/api/3/issue/${issueKey}`;
	const auth = {
		username: config.jiraUsername,
		password: config.jiraApiToken,
	};

	try {
		const response = await axios.get(url, {
			auth,
			headers: { 'Content-Type': 'application/json' },
		});
		return response.data;
	} catch (error) {
		handleError(`Error fetching Jira issue ${issueKey}`, error);
	}
}

async function getUserStoryDetails(issueKey) {
	try {
		const issueData = await getJiraIssue(issueKey);
		const parentData = issueData.fields.parent || {};
		return {
			parentId: parentData.id,
			parentName: parentData.fields?.summary,
			parentKey: parentData.key,
			userStoryId: issueData.id,
			userStoryName: issueData.fields.summary,
			userStoryKey: issueData.key,
		};
	} catch (error) {
		if (error.response?.status === 404) {
			console.warn(`User story ${issueKey} not found. Skipping...`);
		} else {
			handleError(
				`Error fetching user story details for ${issueKey}`,
				error
			);
		}
		return null;
	}
}

async function getTestCases(testCaseKey) {
	try {
		const response = await axios.get(
			`${JIRA_API_URL}/testcases/${testCaseKey}`,
			{ headers: getJiraHeaders() }
		);
		return response.data;
	} catch (error) {
		handleError(`Error fetching test case ${testCaseKey}`, error);
	}
}

async function getTestSteps(testScriptUrl) {
	try {
		const response = await axios.get(testScriptUrl, {
			headers: getJiraHeaders(),
		});
		return response.data.values;
	} catch (error) {
		handleError('Error fetching test steps', error);
	}
}

async function generateCode(testCase, testSteps) {
	const prompt = `
        Generate Codeceptjs automation code with await command before each line:
        Test Steps:
        ${testSteps.map((step, index) => `${index + 1}. ${step.inline.description}`).join('\n')}
    `;

	try {
		const response = await initializeOpenAI().chat.completions.create({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 1000,
			temperature: 0.7,
		});

		if (response?.choices?.[0]?.message?.content) {
			return response.choices[0].message.content.trim();
		} else {
			throw new Error('Invalid response from OpenAI API');
		}
	} catch (error) {
		handleError('Error generating code', error);
	}
}

async function generateAutomationCodeForTestCase(testCaseKey) {
	try {
		const testCase = await getTestCases(testCaseKey);
		const testSteps = await getTestSteps(testCase.testScript.self);
		const automationCode = await generateCode(testCase, testSteps);
		console.log(
			`Generated Code for Test Case ${testCaseKey}:\n${automationCode}`
		);
	} catch (error) {
		handleError('Error in generating automation code', error);
	}
}

async function uploadScreenshot(issueIdOrKey, screenshotPath) {
	const formData = new FormData();
	formData.append('file', fs.createReadStream(screenshotPath));

	try {
		const response = await axios.post(
			`${JIRA_API_URL}/issue/${issueIdOrKey}/attachments`,
			formData,
			{
				headers: {
					...getJiraHeaders(),
					'X-Atlassian-Token': 'no-check',
					...formData.getHeaders(),
				},
			}
		);

		console.log('Screenshot uploaded:', response.data);
		return response.data;
	} catch (error) {
		handleError('Error uploading screenshot', error);
	}
}

async function updateTestCaseStatus(
	testCycleKey,
	testCaseId,
	statusName,
	actualResult,
	screenshotPath
) {
	const currentDate = new Date().toISOString();
	const testCase = await getTestCases(testCaseId);
	const testSteps = await getTestSteps(testCase.testScript.self);

	const testScriptResults = Array(testSteps.length).fill({
		statusName,
		actualResult,
	});

	const data = {
		projectKey: config.projectKey,
		testCycleKey,
		testCaseKey: testCaseId,
		statusName,
		actualEndDate: currentDate,
		testScriptResults,
	};

	try {
		const response = await axios.post(
			`${JIRA_API_URL}/testexecutions`,
			data,
			{ headers: getJiraHeaders() }
		);
		console.log(`Test case status updated: ${response.data.self}`);
		if (screenshotPath) {
			await uploadScreenshot(response.data.id, screenshotPath);
		}
	} catch (error) {
		handleError('Error updating test case status', error);
	}
}

function handleError(message, error) {
	console.error(
		`${message}:`,
		error.response?.data?.message || error.message
	);
	throw error;
}

module.exports = {
	createTestCycle,
	getTestCycleId,
	updateTestCaseStatus,
	getJiraIssue,
	getUserStoryDetails,
	generateAutomationCodeForTestCase,
};
