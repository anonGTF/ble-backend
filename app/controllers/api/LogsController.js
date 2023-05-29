const moment = require('moment');
// Facades:
const logsFacade = require('#facades/logs')

// Reponse protocols.
const { 
	createOKResponse,
	createErrorResponse
} = require('#factories/responses/api');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = LogsController;

function LogsController() {

	const _processError = (error, req, res) => {
		// Default error message.
		let errorMessage = error?.message ?? 'Internal server error';
		// Default HTTP status code.
		let statusCode = 500;

		switch(error.name) {
			case('Unauthorized'):
				errorMessage = 'Email or password are incorrect.';
				statusCode = 406;
				break;
			case('ValidationError'):
				errorMessage = "Invalid email OR password input";
				statusCode = 401;
				break;
			case('InvalidToken'):
				errorMessage = 'Invalid token or token expired';
				statusCode = 401;
				break;
			case('UserNotFound'):
				errorMessage = "Such user doesn't exist";
				statusCode = 400;
				break;

			// Perform your custom processing here...

			default:
				break;
		}

		// Send error response with provided status code.
		return createErrorResponse({
			res, 
			error: {
				message: errorMessage
			},
			status: statusCode
		});
	}

  const _getLogs = async (req, res) => {
    try {
      const start = req.query.start
      const end = req.query.end
      const startDate = moment(start, 'DD/MM/YYYY').format('YYYY-MM-DD')
      const endDate = moment(end, 'DD/MM/YYYY').format('YYYY-MM-DD')

      console.log(startDate, endDate);

			const [ logs ] = await logsFacade.getLogs({ startDate, endDate });

			return createOKResponse({
				res, 
				content:{
					logs
				}
			});
		}
		catch(error) {
			console.error("LogsController._getLogs error: ", error);
			return _processError(error, req, res);
		}
  }

	return {
		getLogs: _getLogs
	}
}
