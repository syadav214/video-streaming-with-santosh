const app = require("express")();
const router = require("./routes");
const cors = require("cors");

app.use(cors());
app.use(router);

app.listen(8000, () => console.log("server is running at 8000"));
