// Reference models.
const User = require('#models/User');
// JWT facade.
const JWT = require('#facades/jwt.facade');
// Password hash and compare service.
const bcrypt = require('#services/bcrypt.service');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = {
	// Auth:
	register: _register,
	login: _login,
	// Auth\

	// Private:
	getFullName: _getFullName,

	// Add your methods here...
	verifyUser: _verifyUser,
	updateUser: _updateUser,
	getUsers: _getUsers,
	getUser: _getUser,
	removeUser: _removeUser
	// Private\
}

// Auth:
async function _register({ email, password, name, nip, role, isVerified }) {
	try{
		// Try to create new user.
		const user = await User.create({
			email,
			password,
			name,
			nip,
			role,
			is_verified: isVerified
		});

		// Issue new access and refresh JWT.
		const [ tokens ] = await JWT.issueTokens({ user });

		// Prepare output.
		const result = [
			tokens,
			user
		];
		// Send output.
		return Promise.resolve(result);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _login({ email, password }) {
	try{
		// Try to find user.
		const user = await User.findOneByEmail(email);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		if (!bcrypt.comparePasswords(password, user.password)) {
			// Validation failed,
			// throw custom error with name Unauthorized:
			const err = new Err(`Validation failed.`);
			err.name = "ValidationError";
			throw err;
		}

		if (!user.is_verified) {
			// Validation failed,
			// throw custom error with name Unauthorized:
			const err = new Err(`User not verified.`);
			err.name = "VerificationError";
			throw err;
		}

		// Issue new access and refresh JWT.
		const [ tokens ] = await JWT.issueTokens({ user });

		// Prepare output.
		const result = [
			tokens,
			user
		];
		// Send output.
		return Promise.resolve(result);
	}
	catch(error){
		return Promise.reject(error);
	}
}
// Auth\

// Private:
async function _getFullName({ userId }) {
	try{
		// Try to find user.
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		// Get value of virtual field 'fullName'.
		const fullName = user.fullName;

		// Send output.
		return Promise.resolve([ fullName ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}
// Private\

async function _verifyUser({ userId }) {
	try{
		// Try to find user.
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		} else if (user.is_verified == true) {
			const err = new Err('User already verified');
			err.name = "ValidationError";
			throw err;
		}

		const updatedUser = await user.update({
			is_verified: true
		})

		const message = "Berhasil verifikasi User"

		// Send output.
		return Promise.resolve([ message, updatedUser ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _updateUser({ userId, name, role, nip }) {
	try{
		// Try to find user.
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		const updateduser = await user.update({
			name,
			role,
			nip
		})

		const message = "Berhasil update User"

		// Send output.
		return Promise.resolve([ message, updateduser ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _getUsers() {
  try{
		const users = await User.findAll()
		return Promise.resolve([ users ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _getUser({ userId }) {
  try{
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		return Promise.resolve([ user ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}

async function _removeUser({ userId }) {
  try{
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		const deletedUser = await user.destroy()

		return Promise.resolve([ deletedUser ]);
	}
	catch(error){
		return Promise.reject(error);
	}
}
