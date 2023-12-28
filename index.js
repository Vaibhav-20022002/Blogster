const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const Blog = require("./models/blog");

const app = express();

const PORT = 8000;

mongoose
	.connect(
		"mongodb+srv://vibhu20022002:FdVBTvjqMSFH2dq6@cluster0.ju0momt.mongodb.net/?retryWrites=true&w=majority"
	)
	.then((e) => {
		console.log("MongoDB connection established");
	})
	.catch((e) => {
		console.log("MongoDB connection error");
	});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
	const allBlogs = await Blog.find({});
	res.render("home", {
		user: req.user,
		blogs: allBlogs,
	});
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});
