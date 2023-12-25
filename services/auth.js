const JWT = require("jsonwebtoken");

const secretkey = "Vaibhav@2002-jwt";

const createTokenForUser = (user) => {
	const payload = {
		_id: user._id,
		email: user.email,
		profileImg: user.profileImg,
		role: user.role,
	};

	const token = JWT.sign(payload, secretkey);

	return token;
};

const validateToken = (token) => {
	const payload = JWT.verify(token, secretkey);
	return payload;
};

module.exports = {
	createTokenForUser,
	validateToken,
};
