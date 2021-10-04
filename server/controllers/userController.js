const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EMAIL_VALIDATION =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  userLogin: function (req, res) {
    if (!req.body.email) {
      return res.status(400).send({
        error: true,
        message: "Email can't be empty",
      });
    } else if (!req.body.password) {
      return res.status(400).send({
        error: true,
        message: "Password can't be empty",
      });
    }

    db.User.findOne({ email: req.body.email })
      .then((data) => {
        if (!data) {
          return res.status(400).send({
            error: true,
            message: "The email or password you entered is invalid",
          });
        }

        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          data.password
        );

        if (!passwordIsValid) {
          return res.status(400).send({
            error: true,
            message: "Password you entered is invalid",
          });
        }

        const token = jwt.sign(
          {
            id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
          process.env.SECRET,
          {
            expiresIn: "72h",
          }
        );

        res.status(200).send({
          error: false,
          message: "User Login success!",
          data: {
            token: token,
          },
        });
      })
      .catch((err) => {
        res.status(400).send({
          error: true,
          message: err.message || "Some error occurred while logging in User.",
        });
      });
  },

  userAdd: function (req, res) {
    if (!req.body.email) {
      return res.status(400).send({
        error: true,
        message: "Email address can't be empty",
      });
    }

    if (!EMAIL_VALIDATION.test(req.body.email)) {
      return res.status(400).send({
        error: true,
        message: "Email address is invalid",
      });
    }

    if (!req.body.password) {
      return res.status(400).send({
        error: true,
        message: "Password can't be empty",
      });
    }

    if (req.body.password.length <= 7) {
      return res.status(400).send({
        error: true,
        message: "Password requires a minimum of 8 characters",
      });
    }

    if (!req.body.firstName) {
      return res.status(400).send({
        error: true,
        message: "First name can't be empty",
      });
    }

    if (!req.body.lastName) {
      return res.status(400).send({
        error: true,
        message: "Last name can't be empty",
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new db.User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      username: req.body.email,
    });
    user
      .save()
      .then((user) => {
        const token = jwt.sign(
          {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          process.env.SECRET,
          {
            expiresIn: "72h",
          }
        );

        res.status(200).send({
          error: false,
          message: "User Adding Success!",
          data: {
            id: user["_id"],
            firstName: user["firstName"],
            lastName: user["lastName"],
            email: user["email"],
            token: token,
          },
        });
      })
      .catch((err) => {
        if (err.code == 11000) {
          res.status(400).send({
            error: true,
            message:
              "Email address or phone number is already in use. Please try another email or phone number",
          });
        } else {
          res.status(400).send({
            error: true,
            message:
              err.message || "Some error occurred while adding the User.",
          });
        }
      });
  },

  userDetails: function (req, res) {
    db.User.findById(req.params.id)
      .select("-password -createdAt -updatedAt -__v")
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            error: true,
            message: "User not found with id " + req.params.id,
          });
        }

        res.status(200).send({
          error: false,
          message: "Successfully retrieved user details",
          data: {
            id: user["_id"],
            firstName: user["firstName"],
            lastName: user["lastName"],
            email: user["email"],
          },
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(400).send({
            error: true,
            message: "User not found with id " + req.params.id,
          });
        }
        return res.status(400).send({
          error: true,
          message: "Error retrieving user with id " + req.params.id,
        });
      });
  },

  userUpdate: function (req, res) {
    db.User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            error: true,
            message: "User not found with id " + req.params.id,
          });
        }

        if (req.body.firstName) {
          user.firstName = req.body.firstName;
        }

        if (req.body.lastName) {
          user.lastName = req.body.lastName;
        }

        if (req.body.email) {
          if (!EMAIL_VALIDATION.test(req.body.email)) {
            return res.status(400).send({
              error: true,
              message: "Email address is invalid",
            });
          } else {
            user.email = req.body.email;
          }
        }

        if (req.body.password) {
          if (req.body.password.length <= 7) {
            return res.status(400).send({
              error: true,
              message: "Password requires minimum of 8 characters",
            });
          } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
            user.password = hashedPassword;
          }
        }

        user.save().then((data) => {
          const token = jwt.sign(
            {
              id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phoneNumber,
              role: data?.role,
              company: data?.company,
            },
            process.env.SECRET,
            {
              expiresIn: "72h",
            }
          );

          return res.status(200).send({
            error: false,
            message: "Successfully updated user with id" + req.params.id,
            data: data,
            token: token,
          });
        });
      })
      .catch((err) => {
        return res.status(400).send({
          error: true,
          message:
            err.message || "Could not update user with id" + req.params.id,
        });
      });
  },

  userDelete: function (req, res) {
    db.User.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            error: true,
            message: "User not found with id " + req.params.id,
          });
        }

        res.status(200).send({
          error: false,
          message: "User successfully deleted!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(400).send({
            error: true,
            message: "User not found with id " + req.params.id,
          });
        }
        return res.status(400).send({
          error: true,
          message: "Could not delete user with id " + req.params.id,
        });
      });
  },
};
