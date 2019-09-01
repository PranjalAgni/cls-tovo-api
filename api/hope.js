const express = require("express");
const cors = require("cors");
const middleware = require("./middleware");
const morgan = require("morgan");
const { buildMap } = require("./Utils/fileDB");
const fs = require("fs");
// For Constants
const constants = require("./Utils/constants");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
/**
 * buildMap() - builds the lowDB map.
 */
buildMap();
//@sdPr1me - route as params for dynamic routing
app.post(
    `${constants.rrdmsUrlPath}:route`,
    middleware.understandRequest,
    (req, res) => {
        const status = res.isRoute ? 200 : 404;
        const result = res.data;
        const isArray = Array.isArray(result);
        if (isArray) {
            res.json(result);
        } else {
            res.json({
                isRoute: res.isRoute,
                ...result,
            }).status(status);
        }
    }
);

//ashutosh084 - added get functionality for providing images
app.get(`${constants.imagesUrlPath}/:fileName`, (req, res) => {
    if (fs.existsSync("./data/images/" + req.params.fileName)) {
        res.status(202).sendFile(req.params.fileName, {
            root: "./data/images/",
        });
    } else {
        res.status(404).send("FILE NOT FOUND");
    }
});

const PORT = process.env.PORT || constants.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
