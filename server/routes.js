/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

    app.engine('html', require('ejs').renderFile);


  var options = {
    root: '/home/danny/Documents/Kinetech/DataWar/'
  }

  // Insert routes below
  app.route('/aa')
    .get(function(req, res) {
      // var temp = options.root;
      // options.root += 'server/';
      res.sendFile('server/test.js', options)
      // options.root = temp;
    })

  // All other routes should redirect to the index.html
  app.route('/')
    .get(function(req, res) {
      // res.set('Content-Type', 'text/html');
      // var temp = options.root;
      // options.root += 'src/';
      // console.log(options.root);
      res.render(options.root + 'src/datawar.html');
      // options.root = temp;
    });
};
