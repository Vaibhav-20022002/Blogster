const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");

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

app.get("/", (req, res) => {
	res.render("home");
});

app.use("/user", userRouter);

app.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});
