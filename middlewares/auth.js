const jwt = require("jsonwebtoken");
const secretKey = "Administrator";
const pool = require("../config.js");

function authentication(req, res, next) {
  const { access_token } = req.headers;

  // BERHASIL LOGIN
  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, secretKey);
      const { id, email } = decoded;
      const findMovies = `
        SELECT
          *
        FROM users
        WHERE id = $1;
      `;

      pool.query(findMovies, [id], (err, result) => {
        if (err) next(err);

        if (result.rows.length === 0) {
          // NOT FOUND
          next({ name: "ErrorNotFound" });
        } else {
          // SUCCESS LOGIN
          const user = result.rows[0];

          req.loggedUser = {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin,
          };
          next();
        }
      });
    } catch (err) {
      next({ name: "JWTerror" });
    }
  } else {
    // GAGAL LOGIN
    next({ name: "Unauntheticated" });
  }
}

function authorization(req, res, next) {
  console.log(req.loggedUser);
  const { is_admin, id, email } = req.loggedUser;

  if (is_admin) {
    //BOLEH EKSEKUSI
    next();
  } else {
    //GAK BOLEH EKSEKUSI
    next({ name: "Unauthorized" });
  }
}

module.exports = {
  authentication,
  authorization,
};
