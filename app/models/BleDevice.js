// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

// Password hasher.
const bcryptSevice = require('#services/bcrypt.service');


const BleDevice = database.define(
	'BleDevice',
	{
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type: DataTypes.STRING
    },
    mac: {
      type: DataTypes.STRING
    },
    major: {
      type: DataTypes.INTEGER
    },
    minor: {
      type: DataTypes.INTEGER
    },
    rack_no: {
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING
    }
	},
	{
		// Enable automatic 'createdAt' and 'updatedAt' fields.
		timestamps: true,
		// Only allow 'soft delete'
		// (set of 'deletedAt' field, insted of the real deletion).
		paranoid: true
	}
);

// Static methods:
BleDevice.associate = (models) => {
	models.BleDevice.hasMany(models.Log, {
		foreignKey: "ble_id",
		as: 'logs',
    paranoid: false
	});
}

BleDevice.findById = function(id) {
	return this.findByPk(id);
}

// Static methods\

module.exports = BleDevice;
