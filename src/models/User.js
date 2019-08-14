// const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
// const crypto = require("crypto");
// const secret = require("../config").secret;

// const UserSchema = new mongoose.Schema(
//     {
//         username: {
//             type: String,
//             lowercase: true,
//             unique: true,
//             required: [true, "can't be blank"],
//             match: [/^[a-zA-Z0-9]+$/, "is invalid"],
//             index: true
//         },
//         email: {
//             type: String,
//             lowercase: true,
//             unique: true,
//             required: [true, "can't be blank"],
//             match: [/\S+@\S+\.\S+/, "is invalid"],
//             index: true
//         },
//         bio: String,
//         image: String,
//         favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
//         following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//         hash: String,
//         salt: String
//     },
//     { timestamps: true }
// );

// UserSchema.plugin(uniqueValidator, { message: "is already taken." });

// UserSchema.methods.validPassword = function(password) {
//     const hash = crypto
//         .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
//         .toString("hex");
//     return this.hash === hash;
// };

// UserSchema.methods.setPassword = function(password) {
//     this.salt = crypto.randomBytes(16).toString("hex");
//     this.hash = crypto
//         .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
//         .toString("hex");
// };

// UserSchema.methods.toAuthJSON = function() {
//     return {
//         username: this.username,
//         email: this.email
//     };
// };

// mongoose.model("User", UserSchema);
const bcrypt = require('bcryptjs');
const User = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'First name cannot be empty'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Last name cannot be empty'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Provide a valid email'
                },
                notEmpty: {
                    msg: 'Email is required'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password is required'
                }
            }
        }
    }, {
        hooks: {
            beforeSave: (user, options) => {
                // Hash password before saving
                if (user.changed('password')) {
                    const salt = bcrypt.genSaltSync(10);
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            }
        }
    });
};

module.exports = User;
