// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

// Password hasher.
const bcryptSevice = require('#services/bcrypt.service');


const Log = database.define(
	'Log',
	{
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['INBOUND', 'OUTBOUND']]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ble_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
Log.associate = (models) => {
	models.Log.belongsTo(models.User, {
		foreignKey: "user_id",
		as: 'user'
	});
  models.Log.belongsTo(models.BleDevice, {
		foreignKey: "ble_id",
		as: 'bleDevice',
    paranoid: false
	});
}

Log.findById = function(id) {
	return this.findByPk(id);
}

// Static methods\

module.exports = Log;
