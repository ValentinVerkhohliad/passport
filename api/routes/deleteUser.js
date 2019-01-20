import User from '../sequelize';
import passport from 'passport';

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     tags:
 *       - Users
 *     name: Delete User
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         in: query
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: string
 *         required:
 *           - username
 *     responses:
 *       '200':
 *         description: User deleted from db
 *       '403':
 *         description: Authentication error
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */

module.exports = app => {
  app.delete('/deleteUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.status(403).send(info.message);
      } else {
        User.destroy({
          where: {
            username: req.query.username,
          },
        })
          .then(user => {
            if (user === 1) {
              console.log('user deleted from db');
              res.status(200).send('user deleted from db');
            } else {
              console.log('user not found in db');
              res.status(404).send('no user with that username to delete');
            }
          })
          .catch(err => {
            console.log('problem communicating with db');
            res.status(500).send(err);
          });
      }
    })(req, res, next);
  });
};
