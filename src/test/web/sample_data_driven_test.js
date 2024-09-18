const { I, HomePage, ReadDataUtil } = inject();
const currentFolderPath = process.cwd();
const filePath = currentFolderPath + '/testDataProvider.xlsx';

Feature('Demo data driven reading data from excel ');

Data(ReadDataUtil.getTestData(filePath)).Scenario(
	'Login to nuskin',
	async ({ I, current }) => {
		console.log('current.comments:' + current.comments);

		I.say('have navigated to Nuskin home page');
		HomePage.goto();

		I.say('I click on sign in link');
		HomePage.clickSignInLink();

		I.say('I see the sign in page');
		HomePage.verifySignInPage();

		I.say('I enter the user name');
		HomePage.enterUserName(current.username);

		I.say('I enter the password');
		HomePage.enterPwd(current.password);

		I.say('I click on sign in button');
		HomePage.clickSubmit();

		I.say('I see Sign Out link');
		HomePage.verifySignOutLink();
		I.saveScreenshot('nuskin-homepage.png');
	}
);

After(async () => {
	// I.closeCurrentTab();
});
