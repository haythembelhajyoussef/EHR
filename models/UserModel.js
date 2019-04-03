const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { isEmail } = require("../helpers/CustomValidators");
const ROLES = require("../configurations/Roles");
const SECRETS = require("../configurations/Secrets");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "incorrect format of email adress"]
  },
  password: {
    type: String,
    required: true
  },
  sexe: {
    type: Boolean,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: ROLES.SIMPLE_USER
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role
    },
    SECRETS.JWT_SECRET
  );
  return token;
};

userSchema.methods.encryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(SECRETS.SALT_VALUE);
  console.log(salt, this.password);
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
