const expxress = require("express");
const app = expxress();

var cors = require('cors');
app.use(cors());

app.use(expxress.json());

const port = process.env.PORT || 5000;

require("./db/connection");

const routes = require("./routing");
app.use("/api", routes);

app.get("/", async (req, res) => {
    res.send("Your app is running perfectly...");
})

app.listen(port, ()=>{
    console.log(`Your app listening at port ${port}`);
})