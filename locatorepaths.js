module.exports = {
	USEN: {
		signInLink: "//*[(text() = 'Sign In' or . = 'Sign In')]",
		Username: "//label[contains(text(),'Username')]",
		userNameTextField: "//input[@name='identifier']",
		pwdField: "//input[@name='credentials.passcode']",
		signInButton: "//input[@value='Sign in']",
		signOutLink: "(//button[contains(text(),'Sign Out')])[1]",
		nothanksPopUp: "//div[@id='QSIWebResponsive']",
		noThanksTextBut: 'NO THANKS',
	},
};
