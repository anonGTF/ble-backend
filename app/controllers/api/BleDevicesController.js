// Facades:
const bleDevicesFacade = require('#facades/bleDevices');
const logsFacade = require('#facades/logs')

// Reponse protocols.
const { 
	createOKResponse,
	createErrorResponse
} = require('#factories/responses/api');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = BleDevicesController;

function BleDevicesController() {

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

  const _getDevices = async (req, res) => {
    try {
			const [ devices ] = await bleDevicesFacade.getDevices();

			return createOKResponse({
				res, 
				content:{
					devices
				}
			});
		}
		catch(error) {
			console.error("BleDevicesController._getDevices error: ", error);
			return _processError(error, req, res);
		}
  }

  const _addDevice = async (req, res) => {
    try {
      const userId = req.body?.userId
      const name = req.body?.name
      const uuid = req.body?.uuid
      const mac = req.body?.mac
      const major = req.body?.major
      const minor = req.body?.minor

			const [ device ] = await bleDevicesFacade.addDevice({
        name, 
        uuid, 
        mac, 
        major, 
        minor, 
        state: true
      });

      const log = await logsFacade.addLog({
        date: new Date(),
        type: 'INBOUND',
        userId,
        bleId: device.id
      })

			return createOKResponse({
				res, 
				content:{
					device,
          log
				}
			});
		}
		catch(error) {
			console.error("BleDevicesController._addDevice error: ", error);
			return _processError(error, req, res);
		}
  }

  const _updateDevice = async (req, res) => {
    try {
      const id = req.body?.id
      const name = req.body?.name
      const uuid = req.body?.uuid
      const mac = req.body?.mac
      const major = req.body?.major
      const minor = req.body?.minor
      const state = req.body?.state

			const [ device ] = await bleDevicesFacade.updateDevice({
        id,
        name, 
        uuid, 
        mac, 
        major, 
        minor, 
        state
      });

			return createOKResponse({
				res, 
				content:{
					device
				}
			});
		}
		catch(error) {
			console.error("BleDevicesController._updateDevice error: ", error);
			return _processError(error, req, res);
		}
  }

  const _removeDevice = async (req, res) => {
    try {
      const id = req.body?.id
      const userId = req.body?.userId

			const [ message ] = await bleDevicesFacade.removeDevice({ id });

      const log = await logsFacade.addLog({
        date: new Date(),
        type: 'OUTBOUND',
        userId,
        bleId: id
      })

			return createOKResponse({
				res, 
				content:{
					message,
          log
				}
			});
		}
		catch(error) {
			console.error("BleDevicesController._removeDevice error: ", error);
			return _processError(error, req, res);
		}
  }

	return {
		getDevices: _getDevices,
    addDevice: _addDevice,
    updateDevice: _updateDevice,
    removeDevice: _removeDevice
	}
}
