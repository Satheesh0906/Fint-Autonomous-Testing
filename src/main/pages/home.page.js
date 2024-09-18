const { I } = inject();
const currentFolderPath = process.cwd();
const testData = require(currentFolderPath + '/data');
const profileData = require(currentFolderPath + '/locatorepaths');
const environment = process.env.NODE_ENV || 'test';
const profile = process.NODE_PROFILE || 'USEN';
const { baseURL } = testData[environment];
const {
	signInLink,
	Username,
	pwdField,
	signInButton,
	signOutLink,
	userNameTextField,
} = profileData[profile];

module.exports = {
	async goto() {
		// console.log("env:" + baseURL)
		I.logInfo('env:' + baseURL);
		I.amOnPage(baseURL).catch(async (error) => {
			I.logError('Navigated to Nuskin home page failed :' + error);
			await I.saveScreenshot('goto.png');
		});
		I.wait(5);
		// pause();
		// if (I.seeElement(nothanksPopUp)) {
		//     I.click(noThanksTextBut);
		//     I.dontSeeElement(nothanksPopUp);
		// }
		I.logInfo('Navigated to Nuskin home page');
	},
	clickSignInLink() {
		I.click(signInLink).catch(async (error) => {
			I.logError('I click on sign in link failed with :' + error);
			await I.saveScreenshot('clickSignInLink.png');
		});
		I.wait(2);
		I.logInfo('I click on sign in link passed');
	},
	verifySignInPage() {
		I.wait(5);

		I.waitForVisible(Username);
		I.seeElement(Username).catch(async (error) => {
			I.logError('sign in page not displayed :' + error);
			await I.saveScreenshot('verifySignInPage.png');
		});
		I.logInfo('verify SignIn passed');
	},
	enterUserName(username) {
		I.fillField(userNameTextField, username).catch(async (error) => {
			I.logError('enter user name failed :' + error);
			await I.saveScreenshot('enterUserName.png');
		});
		I.logInfo('enter UserName passed');
	},
	enterPwd(pwd) {
		I.fillField(pwdField, pwd).catch(async (error) => {
			I.logError('enter password failed :' + error);
			await I.saveScreenshot('enterPwd.png');
		});
		I.logInfo('enter password passed');
	},
	clickSubmit() {
		I.click(signInButton).catch(async (error) => {
			I.logError('click submit failed :' + error);
			await I.saveScreenshot('clickSubmit.png');
		});
		I.logInfo('click Submit passed');
		I.wait(2);
	},
	verifySignOutLink() {
		I.wait(6);
		I.waitForVisible(signOutLink);
		I.seeElement(signOutLink).catch(async (error) => {
			I.logError('sign out link not displayed :' + error);
			await I.saveScreenshot('verifySignOutLink.png');
		});
		I.logInfo('sign out link displayed');
		I.wait(2);
	},
};
