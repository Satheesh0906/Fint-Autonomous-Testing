const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../../../config');
const { getUserStoryDetails } = require('../../utils/jiraIntegrationUtils');
const { initializeOpenAI } = require('../../utils/openaiUtils');

const customDirectory = './src/test/web';
const BASE_TESTS_DIR = customDirectory || './tests'; // Default to './tests' if custom directory is not provided

function sanitizeSummary(summary) {
	if (!summary || typeof summary !== 'string') {
		return 'No_Summary'; // Fallback value if summary is undefined or not a string
	}

	let sanitized = summary.replace(/[^a-zA-Z0-9]+/g, '_');
	if (sanitized.endsWith('_')) {
		sanitized = sanitized.slice(0, -1);
	}
	return sanitized;
}

async function getTestSteps(testScriptUrl) {
	const response = await axios.get(testScriptUrl, {
		headers: {
			Authorization: `Bearer ${config.zapiBearerToken}`,
			'Content-Type': 'application/json',
		},
		params: {
			maxResults: 50,
			startAt: 0,
		},
	});

	console.log(response.data);
	return response.data.values;
}

async function getTestCasesByKey(testCaseKey) {
	const response = await axios.get(
		`${config.zapiBaseUrl}/testcases/${testCaseKey}`,
		{
			headers: {
				Authorization: `Bearer ${config.zapiBearerToken}`,
				'Content-Type': 'application/json',
			},
		}
	);

	return response.data;
}

async function getTestCasesByProjectKey() {
	try {
		console.log(
			'Fetching test cases...',
			config.zapiBaseUrl,
			config.projectKey
		);
		const response = await axios.get(
			`${config.zapiBaseUrl}/testcases?projectKey=${config.projectKey}`,
			{
				headers: {
					Authorization: `Bearer ${config.zapiBearerToken}`,
					'Content-Type': 'application/json',
				},
				params: {
					maxResults: 50,
					startAt: 0,
				},
			}
		);
		console.log(response.data);
		return response.data.values;
	} catch (error) {
		console.error(
			'Error fetching test cases:',
			error.response ? error.response.data : error.message
		);
		throw error;
	}
}

function extractLinksAndIssues(testCase) {
	const links = testCase.links;
	if (links && links.issues && Array.isArray(links.issues)) {
		return links.issues.map((issue) => ({
			issueId: issue.issueId,
			target: issue.target,
		}));
	} else {
		console.log('No issues found in links for test case:', testCase.name);
		return [];
	}
}

function groupTestCasesByUserStory(testCases) {
	const grouped = {};

	testCases.forEach((testCase) => {
		const issuesData = extractLinksAndIssues(testCase);
		issuesData.forEach(({ target }) => {
			const userStoryId = path.basename(target);

			if (!grouped[userStoryId]) {
				grouped[userStoryId] = { testCases: [] };
			}
			grouped[userStoryId].testCases.push(testCase);
		});
	});

	return grouped;
}

async function generateTestCaseTemplates(
	apiKey,
	model,
	groupedTestCases,
	customBaseDir
) {
	const baseDir = customBaseDir || BASE_TESTS_DIR;

	for (const userStoryId in groupedTestCases) {
		const userStoryDetails = await getUserStoryDetails(userStoryId);

		if (userStoryDetails) {
			const { parentKey, userStoryName, userStoryKey } = userStoryDetails;

			const parentFolderDir = path.join(
				baseDir,
				config.projectKey,
				parentKey
			);
			const userStoryDir = path.join(
				parentFolderDir.toLowerCase(),
				userStoryKey.toLowerCase()
			);

			fs.ensureDirSync(userStoryDir);

			const testFileName = `${sanitizeSummary(userStoryName)}.js`;
			const testFilePath = path.join(userStoryDir, testFileName);

			let testFileContent = `const { updateTestCaseStatus } = require("../../../../../main/utils/jiraIntegrationUtils")\n;
            Feature('${userStoryName}');\n`;

			for (const testCase of groupedTestCases[userStoryId].testCases) {
				const testCaseKey = testCase.key;

				console.log(
					`Generating test case template for ${testCaseKey}_${testCase.name}`
				);

				const tcDetails = await getTestCasesByKey(testCaseKey);
				const testSteps = await getTestSteps(tcDetails.testScript.self);

				testSteps.forEach((step, index) => {
					console.log(
						`Step ${index + 1}: ${step.inline.description}`
					);
				});

				const prompt = `
           Generate only CodeceptJS testcase with but don't create a scenario and block with out any comments. :
                Test Steps:
                ${testSteps.map((step, index) => `${index + 1}. ${step.inline.description}`).join('\n')}
                `;

				// Create a chat completion using the OpenAI API
				const response =
					await initializeOpenAI().chat.completions.create({
						model: model,
						messages: [{ role: 'user', content: prompt }],
						max_tokens: 1000,
						temperature: 0.7,
					});

				if (
					response &&
					response.choices &&
					response.choices.length > 0
				) {
					const generatedCode =
						response.choices[0].message.content.trim();

					testFileContent += `
                        Scenario('${testCaseKey}_${testCase.name}', async ({ I }) => {
                             global.testCaseId = '${testCaseKey}';
                                    ${generatedCode}    
                        });
                    `;
				} else {
					throw new Error('Invalid response from OpenAI API');
				}
			}

			fs.writeFileSync(testFilePath, testFileContent.trim());
		}
	}
}

async function main() {
	try {
		const testCases = await getTestCasesByProjectKey();
		const groupedTestCases = groupTestCasesByUserStory(testCases);
		await generateTestCaseTemplates(
			config.apikeyCode,
			'gpt-4o',
			groupedTestCases,
			customDirectory
		);
	} catch (error) {
		console.error('Error during the workflow:', error.message);
	}
}

main();
