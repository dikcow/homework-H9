const express = require("express");
const router = express.Router();
const moviesRouter = require("./movies.js");
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretKey = "Administrator";
const { authentication } = require("../middlewares/auth.js");

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  findUser = `
    SELECT 
    *
    FROM users
    WHERE email = $1
  `;

  pool.query(findUser, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      // NOT FOUND
      next({ name: "ErrorNotFound" });
    } else {
      // FOUND
      const data = result.rows[0];
      const comparePassword = bcrypt.compareSync(password, data.password);

      //PASSWORD BENAR
      if (comparePassword) {
        const accessToken = jwt.sign(
          {
            id: data.id,
            email: data.email,
          },
          secretKey
        );
        res.status(200).json({
          id: data.id,
          email: data.email,
          is_admin: data.is_admin,
          accessToken: accessToken,
        });

        //PASSWORD SALAH
      } else {
        next({ name: "WrongPassword" });
      }
    }
  });
});

router.post("/register", (req, res, next) => {
  const { id, email, gender, password, role, is_admin } = req.body;

  const hash = bcrypt.hashSync(password, salt);
  const insertUser = `
    INSERT INTO users (id, email, gender, password, role, is_admin)
      VALUES
      ($1, $2, $3, $4, $5, $6)
  `;
  try {
    pool.query(insertUser, [id, email, gender, hash, role, is_admin], (err, result) => {
      if (err) next(err);
      res.status(201).json({
        message: "Users Register",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.use(authentication);
router.use("/", moviesRouter);

module.exports = router;
