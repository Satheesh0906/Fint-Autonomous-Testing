const { event } = require('codeceptjs');

// BeforeSuite hook to run once before all tests
function BeforeSuite(fn) {
	event.dispatcher.on(event.suite.before, fn);
}

// AfterEach hook to run after each test
function AfterEach(fn) {
	event.dispatcher.on(event.test.after, fn);
}

module.exports = {
	BeforeSuite,
	AfterEach,
};
