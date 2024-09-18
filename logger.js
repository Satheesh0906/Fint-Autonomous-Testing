const { createLogger, format, transports } = require('winston');
const path = require('path');

// Create a log file with the current date in its name
const logFileName = path.join(
	__dirname,
	`../logs/log_${new Date().toISOString().split('T')[0]}.log`
);

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.printf(
			({ timestamp, level, message }) =>
				`${timestamp} [${level.toUpperCase()}] ${message}`
		)
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: logFileName }),
	],
});

module.exports = logger;
