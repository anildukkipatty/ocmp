const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const swig = require('swig')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('./config')
const { fetch ,fetchOne } = require('./lib/mongoose');
const io = require('socket.io')()

const app = express()

// Mongoose setup
mongoose.connect(config.mongo.host, {useMongoClient: true})

// Socket.io setup
app.io = io

// view engine setup
app.engine('html', swig.renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.set('view cache', false)
swig.setDefaults({ cache: false, varControls: ['<%=', '%>'] })

// Setting up middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.io.on('connection', socket => {
  socket.join('data-room')
  console.log('New connection found');
})

// Declaring routes
app.use('/', require('./routes/index')(io))
app.use('/api/v1', require('./routes/api'))
app.use('/api/v1', require('./routes/api-messages'))
app.use('/api/v1', require('./routes/api-dashboard'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
