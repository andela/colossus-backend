import express, { static } from "express";
import { urlencoded, json } from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import { name, internet } from "faker";
import { UserModel, sequelize } from "./database/config";

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(require("method-override")());
app.use(static(__dirname + "/public"));

app.use(
    session({
        secret: "authorshaven",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

if (!isProduction) {
    app.use(errorhandler());
}

if (isProduction) {
    sequelize.sync({});
} else {
    sequelize.sync({
        force: true
    }).then((v) => {
        UserModel.create({
            first_name: name.firstName(),
            last_name: name.lastName(),
            email: internet.email(),
            password: internet.password(8)
        }).then((user) => {
            console.log(user);
        })
    });

}

app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});
