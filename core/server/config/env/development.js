// ENVIRONMENT VARIABLES
module.exports = {
    // you want to get your own mongolab database and credentials from within Heroku
    // if you leave it like this you will be hitting my database :)
    db: 'mongodb://example:example@ds031223.mongolab.com:31223/heroku_q398n5nn',
    sessionSecret: 'developmentSessionSecret'
};