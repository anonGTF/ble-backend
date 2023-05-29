// Reference models.
const Log = require('#models/Log');
const User = require('#models/User');
const BleDevice = require('#models/BleDevice');
const { Op } = require('sequelize');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = {
  getLogs: _getLogs,
  addLog: _addLog
}

async function _getLogs({ startDate, endDate }) {
  try{
		const logs = await Log.findAll({
      include: [
        { model: User, as: 'user' },
        { model: BleDevice, as: 'bleDevice', paranoid: false }
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    })
		return Promise.resolve([ logs ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _addLog({ date, type, userId, bleId }) {
  try{
		const log = await Log.create({
      date,
      type,
      user_id: userId,
      ble_id: bleId
    })
		return Promise.resolve([ log ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}