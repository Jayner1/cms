const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const documentsRoutes = require('./server/routes/documents');
const messagesRoutes = require('./server/routes/messages');
const contactsRoutes = require('./server/routes/contacts');


// Import the routing file to handle the default route
const index = require('./server/routes/app');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use('/api/documents', documentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/contacts', contactsRoutes);

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Serve Angular static files from the correct output folder
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

// Map default route to index router
app.use('/', index);

// Express 5 requires named wildcard parameters for catch-all routes
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Set port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server and start listening
const server = http.createServer(app);
server.listen(port, () => {
  console.log('API running on localhost:' + port);
});
