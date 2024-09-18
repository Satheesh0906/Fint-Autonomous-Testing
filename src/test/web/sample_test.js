const { I, HomePage } = inject();

Feature('Demo login scenario ');

Scenario('Login to nuskin', async ({ I }) => {
	I.say('have navigated to Nuskin home page');
	HomePage.goto();

	I.say('I click on sign in link');
	HomePage.clickSignInLink();

	I.say('I see the sign in page');
	HomePage.verifySignInPage();

	I.say('I enter the user name');
	HomePage.enterUserName('shinu1900@gmail.com');

	I.say('I enter the password');
	HomePage.enterPwd('Shinu1900@gmail.com');

	I.say('I click on sign in button');
	HomePage.clickSubmit();

	I.say('I see Sign Out link');
	HomePage.verifySignOutLink();
	I.saveScreenshot('nuskin-homepage.png');
});

After(async () => {
	// I.closeCurrentTab();
});
