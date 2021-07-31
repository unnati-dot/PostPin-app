const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express();
const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")


dotenv.config();

app.use(express.json());
mongoose
.connect(process.env.connection_url,{useNewUrlParser : true,useUnifiedTopology: true })
.then(()=>{
	console.log("mongodb connected!");
})
.catch((err) => console.log(err));

app.use("/api/pins",pinRoute)
app.use("/api/users",userRoute)


app.listen(5000,()=>{
	console.log("server is running!");
})
