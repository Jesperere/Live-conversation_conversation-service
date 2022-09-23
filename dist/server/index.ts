"use strict";
import * as express from "express"
const app = express()
const port = 3000
app.get("/", (req, res) => {
    res.send("Hello asdas")
})
app.listen(port, () => {
    console.log(`Listening on port + ${port}`)
})
//# sourceMappingURL=index.js.map