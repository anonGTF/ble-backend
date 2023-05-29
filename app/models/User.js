// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

// Password hasher.
const bcryptSevice = require('#services/bcrypt.service');


const User = database.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		nip: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
        isIn: [['ADMIN', 'USER']]
      }
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
	},
	{
		// Enable automatic 'createdAt' and 'updatedAt' fields.
		timestamps: true,
		// Only allow 'soft delete'
		// (set of 'deletedAt' field, insted of the real deletion).
		paranoid: true
	}
);

// Hooks:
User.beforeValidate((user, options) => {
	// Hash user's password.
	user.password = bcryptSevice.hashPassword(user);
})
// Hooks\

// Static methods:
User.associate = (models) => {
	models.User.hasMany(models.DisabledRefreshToken, {
		foreignKey: "UserId",
		as: 'disabledRefreshTokens'
	});
	models.User.hasMany(models.Log, {
		foreignKey: "user_id",
		as: 'logs'
	});
}

User.findById = function(id) {
	return this.findByPk(id);
}

User.findOneByEmail = function(email) {
	const query = {
		where: {
			email
		}
	};
	return this.findOne(query);
}
// Static methods\

// Instance methods:
User.prototype.toJSON = function() {
	const values = { ...this.get() };
	delete values.password;
	return values;
}
// Instance methods\

module.exports = User;
