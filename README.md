
# FAT - Fint Autonomous Testing

**A autonomous framework for Automation testing using AI**

## Key Features:

1. **Jira Integration**
2. **Code Gen templates**
3. **Auto Generation of Test Cases**
4. **Data-Driven Testing**
6. **Smart Wait**
7. **Self-Healing**
8. **CI/CD Integration**
9. **Report Portal**
10. **AI-Based Analysis**

### FAT Setup Instructions

1. **Clone the Project:**
   ```bash
   git clone https://github.com/Fint-Solutions/FAT.git
   ```

2. **Install Node.js and npm:**
   - Ensure you have Node.js and npm (Node Package Manager) installed. You can download and install them from the [Node.js official website](https://nodejs.org/).
   - Install the dependencies listed in `package.json`:
     ```bash
     npm install --verbose
     ```

3. **Run a Sample Scenario:**
   ```bash
   npx codeceptjs run test/web/**/**/*.js
   ```

### Writing Tests with AI Copilot

1. **Create a Test to Use AI Features:**
   - Run the following command to generate a new test:
     ```bash
     npx codeceptjs gt
     ```
   - Name your test and write the code. Use `Scenario.only` to execute only this specific test.
     ```javascript
     Feature('ai');

     Scenario.only('test ai features', ({ I }) => {
       I.amOnPage('https://www.google.co.in');
       pause();
     });
     ```

2. **Run the Test in Debug Mode with AI Enabled:**
   ```bash
   npx codeceptjs run --debug --ai
   ```

3. **Interact with AI During Pause Mode:**
   - When in pause mode, ask GPT to perform actions on the page using natural language. Ensure to include at least one space in your input, as input without spaces will be treated as JavaScript code.
   - Example input:
     ```
     I.fill checkout form with valid values without submitting it
     ```

4. **AI Generates and Executes Code:**
   - GPT generates the necessary code and data, and CodeceptJS executes it. Successful code is saved to history for future use.

### Self-Healing Tests

1. **Heal Recipes:**
   - Functions executed upon test failure to attempt recovery.
   - AI Heal Recipes provide error messages, the step being executed, and HTML context to the AI provider.
   - AI suggests code to fix the failing test.

2. **AI Healing:**
   - Specifically addresses locator changes (e.g., renaming "Sign in" to "Login").
   - AI matches the new locator, retries the command, and continues test execution.

3. **Limitations:**
   - Heal actions only work on actions like `click`, `fillField`, etc.
   - They do not work on assertions, waiters, or grabbers.

4. **Automatic Updates:**
   - If the Heal plugin successfully fixes a step, it suggests code changes at the end of execution. Use these suggestions to update the codebase.

5. **Setup Instructions:**
   - **Ensure AI Provider Connection:**
     - Connect an AI provider.
     - Include heal recipes in your `codecept.conf.js` or `codecept.conf.ts` configuration file.
   - **Enable the Heal Plugin:**
     ```javascript
     plugins: {
       heal: {
         enabled: true
       }
     }
     ```
   - **Run Tests in AI Mode:**
     ```bash
     npx codeceptjs run --ai
     ```
   - **Review AI Suggestions:**
     - After test execution, you’ll receive token usage information and code suggestions from AI. Use this information to improve your test recovery process.

### Arbitrary GPT Prompts

1. **Enabling AI Helper:**
   - Update `codecept.conf.js` to enable the AI helper along with the Playwright, Puppeteer, or WebDriver helper.
     ```javascript
     helpers: {
       Playwright: {
         // configuration
       },
       AI: {}
     }
     ```

2. **AI Helper Methods:**
   - `askGptOnPage`: Sends a GPT prompt with the HTML of the page (split into chunks if necessary).
   - `askGptOnPageFragment`: Sends a GPT prompt with the HTML of a specific element.
   - `askGptGeneralPrompt`: Sends a GPT prompt without HTML.
   - `askForPageObject`: Creates a PageObject.

3. **Generating PageObjects:**
   - Enable the AI helper and launch the shell:
     ```bash
     npx codeceptjs shell --ai
     ```
   - Use `pause()` to interact with AI and browse web pages:
     ```javascript
     I.askForPageObject('login')
     ```

4. **Refining PageObjects:**
   - Customize requests or use a root locator:
     ```javascript
     I.askForPageObject('login', 'implement signIn(username, password) method')
     I.askForPageObject('login', '', '#auth')
     ```
   - Move generated PageObjects to the `pages` folder and include them in `codecept.conf.js`:
     ```javascript
     include: {
       loginPage: "./pages/loginPage.js",
       // ...
     }
     ```

5. **Debugging AI Features:**
   - Use the `DEBUG` flag to debug AI features:
     ```bash
     DEBUG="codeceptjs:ai" npx codeceptjs run --ai
     DEBUG="codeceptjs:ai" npx codeceptjs shell --ai
     ```
