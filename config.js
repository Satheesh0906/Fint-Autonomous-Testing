require('dotenv').config();

module.exports = {
	projectKey: process.env.PROJECT_KEY || 'NUS',
	projectVersion: process.env.PROJECT_VERSION || 10000,
	zapiBaseUrl:
		process.env.ZAPI_BASE_URL || 'https://prod-api.zephyr4jiracloud.com/v2',
	swaggerUrl:
		process.env.SWAGGER_URL ||
		'https://petstore.swagger.io/v2/swagger.json',
	apiUrl: process.env.API_URL || 'https://petstore.swagger.io/v2',
	jiraBaseUrl:
		process.env.JIRA_BASE_URL || 'https://gudurusatheesh.atlassian.net',
	jiraUsername: process.env.JIRA_USERNAME || 'maheswara.gunipati@fintinc.com',
	prometheusHost: process.env.PROMETHEUS_HOST || 'localhost',
	reportPortalHost: process.env.REPORT_PORTAL_HOST || 'localhost',
	zapiBearerToken: process.env.ZAPI_BEARER_TOKEN,
	jiraApiToken: process.env.JIRA_API_TOKEN,
	apikeyCode: process.env.API_KEY_CODE,
	reportPortalKey: process.env.REPORT_PORTAL_KEY,
	model: process.env.MODEL || 'gpt-4o',
};
