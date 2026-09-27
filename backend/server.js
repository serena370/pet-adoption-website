const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Pet routes
const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);


const adoptionRoutes = require('./routes/adoptionRoutes');
app.use('/api/adoptions', adoptionRoutes);


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);





// Test Route
app.get('/', (req, res) => {
    res.send('Pet Adoption Backend is running!');
});

// Swagger
const options = {
  definition: {
  openapi: '3.0.0',
  info: {
    title: 'Pet Adoption API',
    version: '1.0.0',
    description: 'API documentation for your Pet Adoption project',
  },
  servers: [
    { url: 'http://localhost:5000' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
},

  apis: ['./routes/*.js'], // point this to your route files
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
