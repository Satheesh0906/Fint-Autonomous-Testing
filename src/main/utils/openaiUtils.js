// This file contains utility functions for interacting with the OpenAI API.
const { OpenAI } = require('openai');

function initializeOpenAI() {
	// Initialize OpenAI with the API key
	const openai = new OpenAI({
		apiKey: process.env.API_KEY_CODE,
	});

	return openai;
}

async function sendPrompt(
	openai,
	{ model, prompt, cookieString, stop, maxTokens = 1000, temperature = 0.7 }
) {
	const response = await openai.chat.completions.create({
		model: model,
		messages: [
			{
				role: 'user',
				content: `${prompt} (Cookies: ${cookieString})`,
			},
		],
		max_tokens: maxTokens,
		temperature: temperature,
		stop: stop,
	});

	return response;
}

async function sendPromptToOpenAIWithCookies({ prompt, cookies, stop = null }) {
	try {
		// Convert cookies to a string that can be sent as part of the prompt
		const cookieString = cookies
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ');

		// Initialize OpenAI
		const openai = initializeOpenAI();

		// Send the prompt and cookies to OpenAI
		const response = await sendPrompt(openai, {
			model: 'gpt-4',
			prompt: prompt,
			cookieString: cookieString,
			stop: stop,
		});

		if (response.choices && response.choices.length > 0) {
			const aiResponse = response.choices[0].message.content;
			return aiResponse;
		} else {
			throw new Error('No response choices found.');
		}
	} catch (error) {
		console.error('Error sending prompt to OpenAI:', error);
		throw new Error('Failed to get a response from OpenAI.');
	}
}

module.exports = {
	sendPromptToOpenAIWithCookies,
	initializeOpenAI,
	sendPrompt,
};
