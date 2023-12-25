const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
		},

		salt: {
			type: String,
		},

		profileImg: {
			type: String,
			default: "/public/images/Avatar.png",
		},

		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	const user = this;

	if (!user.isModified("password")) return;

	const salt = randomBytes(16).toString();

	const hashedPassword = createHmac("sha256", salt)
		.update(user.password)
		.digest("hex");

	this.salt = salt;
	this.password = hashedPassword;

	next();
});

userSchema.static(
	"matchPasswordAndGenerateToken",
	async function (email, password) {
		const anyUser = await this.findOne({ email });

		if (!anyUser) throw new Error("Couldn't find user");

		const salt = anyUser.salt;

		const hashedPassword = anyUser.password;

		const userProvidedPassword = createHmac("sha256", salt)
			.update(password)
			.digest("hex");

		if (userProvidedPassword !== hashedPassword)
			throw new Error("Password did not match");

		const token = createTokenForUser(anyUser);
		return token;
	}
);

const User = model("user", userSchema);

module.exports = User;
