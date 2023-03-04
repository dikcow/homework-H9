function errorHandler(err, req, res, next) {
  if (err.name === "ErrorNotFound") {
    res.status(404).json({
      message: "Error Not Found",
    });
  } else if (err.name === "WrongPassword") {
    res.status(400).json({
      message: "Wrong Password or Email",
    });
  } else if (err.name === "Unauntheticated") {
    res.status(400).json({
      message: "Unauntheticated",
    });
  } else if (err.name === "JWTerror") {
    res.status(400).json({
      message: "JWTerror",
    });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = errorHandler;
