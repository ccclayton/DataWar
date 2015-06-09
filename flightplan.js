/**
 * ONLY FOR DEPLOYMENT
 * https://gist.github.com/learncodeacademy/35045e64d2bbe6eb14f9
 */

var plan = require('flightplan');

var appName = 'datawar';
var username = 'deploy';
var startFile = 'app.js';

var tmpDir = appName+'-' + new Date().getTime();

// configuration
plan.target('staging', [
    {
        host: '104.131.93.214',
        username: username,
        agent: process.env.SSH_AUTH_SOCK
    }
]);

plan.target('production', [
    {
        host: '104.131.159.175',
        username: username,
        agent: process.env.SSH_AUTH_SOCK
    },
//add in another server if you have more than one
// {
//   host: '104.131.93.216',
//   username: username,
//   agent: process.env.SSH_AUTH_SOCK
// }
]);

// run commands on localhost
plan.local(function(local) {
    // uncomment these if you need to run a build on your machine first
    // local.log('Run build');
    // local.exec('gulp build');

    local.log('Copy files to remote hosts');
    var filesToCopy = local.exec('git ls-files', {silent: true});
    // rsync files to all the destination's hosts
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
    remote.log('Move folder to root');
    remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
    remote.rm('-rf /tmp/' + tmpDir);

    remote.log('Install dependencies');
    remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

    remote.log('Reload application');
    remote.sudo('ln -snf ~/' + tmpDir + ' ~/'+appName, {user: username});
    //remote.exec('pm2 stop ~/'+appName+'/'+startFile, {failsafe: true});
    //remote.exec('pm2 delete ~/'+appName+'/'+startFile);
    //remote.exec('pm2 start ~/'+appName+'/'+startFile);
});