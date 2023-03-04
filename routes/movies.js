const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const { authorization } = require("../middlewares/auth.js");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

router.get("/movies", (req, res, next) => {
  const { limit, page } = req.query;

  let resultLimit = limit ? +limit : DEFAULT_LIMIT;
  let resultPage = page ? +page : DEFAULT_PAGE;

  const findQuery = `
    SELECT
    *
    FROM movies
    LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}
  `;

  pool.query(findQuery, (err, result) => {
    if (err) next(err);

    res.status(200).json(result.rows);
  });
});

router.get("/movies/:id", (req, res, next) => {
  const { id } = req.params;

  const findOneQuery = `
    SELECT
    *
    FROM movies
    WHERE movies.id = $1
  `;

  pool.query(findOneQuery, [id], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      // NOT FOUND
      next({ name: "ErrorNotFound" });
    } else {
      // FOUND
      res.status(200).json(result.rows[0]);
    }
  });
});

router.post("/movies", authorization, (req, res, next) => {
  const { id, title, genres, year } = req.body;

  const createMovies = `
    INSERT INTO movies (id, title, genres, year)
      VALUES
        ($1, $2, $3, $4);
  `;

  pool.query(createMovies, [id, title, genres, year], (err, result) => {
    if (err) next(err);

    res.status(201).json({
      message: "Movies created succesfuly",
    });
  });
});

router.put("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;

  const updateMovies = `
    UPDATE movies
      SET title = $1,
          genres = $2,
          year = $3
      WHERE id = $4
  `;

  pool.query(updateMovies, [title, genres, year, id], (err, result) => {
    if (err) next(err);

    res.status(200).json({
      message: "Update Successfuly",
    });
  });
});

router.delete("/movies/:id", (req, res, next) => {
  const { id } = req.params;

  const deleteMovies = `
    DELETE FROM movies
    WHERE id = $1;
  `;

  pool.query(deleteMovies, [id], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      // NOT FOUND
      next({ name: "ErrorNotFound" });
    } else {
      // FOUND
      res.status(200).json({
        message: "Delete Successfuly",
      });
    }
  });
});

module.exports = router;
