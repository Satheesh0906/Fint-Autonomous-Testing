Feature('CTBC Checking Account');

Scenario('Fill Form with Random Data', async ({ I }) => {
	const randomEmail = `test${Math.floor(Math.random() * 1000)}@example.com`;
	const randomPhoneNumber = `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`;

	I.amOnPage('https://fint-dev-digitalbanking.azurewebsites.net/?source=0');

	pause();
	// Fill Email Address
	I.fillField({ id: 'Ema' }, randomEmail);

	// Select Country
	I.fillField({ id: 'Country' }, 'United States (US)');

	// Fill Phone Number
	I.fillField({ id: 'Mobile' }, randomPhoneNumber);

	// Confirm Phone Number
	I.fillField({ id: 'ConfirmPhoneNumber' }, randomPhoneNumber);
	I.click('span#view_disclosure');
	I.click('CLOSE');

	// Check the checkbox
	I.checkOption({ id: 'IsESign' });

	// Click on NEXT button
	I.click({ xpath: '//button[text()="NEXT"]' });
	I.see('Welcome');
	I.wait(5);
	I.fillField({ id: 'Amount' }, '5000');
	I.click({ xpath: '(//div[@title="Add Account to List"]/button)[1]' });
	I.click({ xpath: '//button[text()="NEXT"]' });
	I.see("Let's Gather Your Information");
});
