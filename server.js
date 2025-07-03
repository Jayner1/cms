const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const documentsRoutes = require('./server/routes/documents');
const messagesRoutes = require('./server/routes/messages');
const contactsRoutes = require('./server/routes/contacts');
const index = require('./server/routes/app');

const app = express();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cms', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to database!');
  } catch (err) {
    console.error('Connection failed:', err);
  }
}
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

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

// API Routes
app.use('/api/documents', documentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/contacts', contactsRoutes);

// Serve Angular static files
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));
app.use('/', index);

// Wildcard route (for Angular routing)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Start server
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log('API running on localhost:' + port);
});
