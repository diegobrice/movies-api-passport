const express = require('express');
const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');

const { userIdSchema } = require('../utils/schemas/users');
const {
  userMovieIdSchema,
  createUserMovieSchema
} = require('../utils/schemas/userMovies');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  router.get(
    '/',
    validationHandler({ userId: userIdSchema }, 'query'),
    async function(req, res, next) {
      const { userId } = req.query;

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });

        res.status(200).json({
          data: userMovies,
          message: 'userMovies listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post('/', validationHandler(createUserMovieSchema), async function(
    req,
    res,
    next
  ) {
    const { body: userMovie } = req;
    try {
      const createdUserMovieId = await userMoviesService.createUserMovie({
        userMovie
      });

      res.status(201).json({
        data: createdUserMovieId,
        message: 'user movie created'
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete(
    '/:userMovieId',
    validationHandler({ userMovieId: userMovieIdSchema }, 'params'),
    async function(req, res, next) {
      const { userMovieId } = req.params;

      try {
        const deletedUserMovieId = await userMoviesService.deleteUserMovie({
          userMovieId
        });

        res.status(200).json({
          data: deletedUserMovieId,
          message: 'user movie deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = userMoviesApi;
