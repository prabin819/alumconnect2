const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Helper function to load YAML files
const loadYaml = (filePath) => {
  try {
    return yaml.load(fs.readFileSync(path.resolve(__dirname, filePath), 'utf8'));
  } catch (error) {
    console.error(`Error loading YAML file at ${filePath}:`, error);
    return {};
  }
};

// Define your Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for AlumConnect',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        // ...loadYaml('./schemas/adminRoutes/admin.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/changeCurrentPassword/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/changeCurrentPassword/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/changeProfilePic/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/changeProfilePic/user.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/deleteProfilePic/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/deleteUser/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/forgotPassword/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/getCurrentUser/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/getCurrentUser/user.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/login/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/login/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/logout/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/logout/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/refreshAccessToken/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/refreshAccessToken/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/resend-verification-email/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/resetpassword/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/signUpAlumini/alumni.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/signUpAlumini/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/signUpStudent/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/signUpStudent/student.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/updateAluminiAccount/alumni.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/updateAluminiAccount/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/updateStudentAccount/response.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/updateStudentAccount/student.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/verifyEmail/auth.schemas.yaml'),
        // ...loadYaml('./schemas/authRoutes/common.schemas.yaml'),
        // ...loadYaml('./schemas/contactRoutes/contact.schemas.yaml'),
        // ...loadYaml('./schemas/eventRoutes/event.schemas.yaml'),
        // ...loadYaml('./schemas/jobRoutes/job.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/addComment/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/CreateNews/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/deleteNews/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/getAllNews/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/getAllNews/response.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/getNewsByNewsId/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/getNewsByUserId/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/likeNews/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/updateNews/news.schemas.yaml'),
        // ...loadYaml('./schemas/newsRoutes/common.schemas.yaml'),
        ...loadYaml('./schemas/new - Copy.yaml'),
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'], // specify the path to your route files
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
