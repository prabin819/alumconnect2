const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss'); //npm WARN deprecated xss-clean@0.1.4: Package no longer supported
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, swaggerSpec } = require('./swagger/swaggerConfig');
const ApiError = require('./utils/ApiError');

// Load env vars
dotenv.config();

//function to sanitize
function sanitizeObject(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
});
app.use(hpp());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// API Routes
//app.use('/api/test', require('./routes/test.route'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/jobs', require('./routes/job.routes'));
app.use('/api/v1/events', require('./routes/event.routes'));
app.use('/api/v1/news', require('./routes/news.routes'));
app.use('/api/v1/contacts', require('./routes/contact.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
