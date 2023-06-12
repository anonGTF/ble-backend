// Reference models.
const BleDevice = require('#models/BleDevice');
// JWT facade.
const JWT = require('#facades/jwt.facade');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = {
  getDevices: _getDevices,
  addDevice: _addDevice,
  updateDevice: _updateDevice,
  removeDevice: _removeDevice
}

async function _getDevices() {
  try{
		const devices = await BleDevice.findAll()
		return Promise.resolve([ devices ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _addDevice({ name, uuid, mac, major, minor, rackNo, password }) {
  try{
		const device = await BleDevice.create({
      name, 
      uuid, 
      mac, 
      major, 
      minor, 
      rack_no:rackNo,
      password
    })
		return Promise.resolve([ device ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _removeDevice({ id }) {
  try{
		const deletedRow = await BleDevice.destroy({
      where: {
        id
      }
    })

    const message = (deletedRow > 0) ? "Berhasil menghapus BLE" : "BLE tidak ditemukan"

		return Promise.resolve([ message ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _updateDevice({ id, name, uuid, mac, major, minor, rackNo, password }) {
  try{
    const device = await BleDevice.findById(id)

    if (!device) {
      const err = new Err('Device not found');
      err.name = "DeviceNotFound";
      throw err;
    }

		const updatedDevice = await device.update({
      name, 
      uuid, 
      mac, 
      major, 
      minor, 
      rack_no: rackNo, 
      password
    })
		return Promise.resolve([ updatedDevice ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}