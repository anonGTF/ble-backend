module.exports = {
	'GET /users/name': 'UsersController.getFullName',
	'GET /users': 'UsersController.getUsers',
	'GET /user': 'UsersController.getUser',
	'POST /users/verify': 'UsersController.verifyUser',
	'POST /users/update': 'UsersController.updateUser',
	'POST /users/remove': 'UsersController.removeUser',
	'GET /devices': 'BleDevicesController.getDevices',
	'POST /device/add': 'BleDevicesController.addDevice',
	'POST /device/update': 'BleDevicesController.updateDevice',
	'POST /device/remove': 'BleDevicesController.removeDevice',
	'GET /logs': 'LogsController.getLogs'
};
