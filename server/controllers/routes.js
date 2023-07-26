/**
 * The routes for the application
 *
 * @author Holly Springsteen
 */

/**
 * The routes to be returned to the server.
 *
 * @returns {Void} No return, only serves routes.
 */
function routes() {
  // Views
  /**
   * Index / Landing route - base route
   */
  global.app.get('/', (req, res) => {
    res.render('index', {
      title: 'Node Template',
    });
  });
}

module.exports = routes;
