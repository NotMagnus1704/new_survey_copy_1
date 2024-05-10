const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/';
const dbName = 'VRNC';
const collectionName = 'questionnaire';
const path = require('path');
const fs = require('fs')
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' middleware

// Middleware to parse JSON request bodies
// app.use(express.json());

// MongoDB connection instance
let db;

/*


// Connect to MongoDB server
mongodb.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  
  console.log('Connected to MongoDB server');
 
  try{

  }
  // Set the 'db' variable to the connected database instance
  db = client.db(dbName);
  
  // Start the Express server 
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Define a route to handle storing response documents
app.post('/submit-response', async (req, res) => {
  try {
    const response = req.body; // Assuming request body contains the response data
  
    // Insert the response document into the 'questionnaire' collection
    const result = await db.collection(collectionName).insertOne(response);
    
    console.log('Response stored in MongoDB:', result.insertedId);
    res.status(201).json({ message: 'Response stored successfully', responseId: result.insertedId });
  } catch (error) {
    console.error('Error storing response in MongoDB:', error);
    res.status(500).json({ error: 'Failed to store response' });
  }
});


*/

app.use(bodyParser.json());

app.use(cors());

async function connectToDatabase() {
  const client = new MongoClient(mongoURI);

  try {
    // Connect to MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Set the 'db' variable to the connected database instance
    db = client.db(dbName);

    // Start the Express server after successful MongoDB connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

    app.post('/submitMockData', async (req, res) => {
      const mockData = req.body;
      console.log('Received mockData:', mockData);

      try {
        // Insert mockData into 'questionnaire' collection
        const result = await db.collection(collectionName).insertOne(mockData);
        console.log('Mock data inserted successfully:', result.insertedId);
        res.status(200).send('Mock data inserted successfully');
      } catch (error) {
        console.error('Error inserting mock data into MongoDB:', error);
        res.status(500).send('Error inserting mock data');
      }
    });

    app.post('/submitFormData', async (req, res) => {
      const formData = req.body;
      console.log('Received formData:', formData);

      try {
        // Insert formData into 'questionnaire' collection
        const result = await db.collection(collectionName).insertOne(formData);
        console.log('Form data inserted successfully:', result.insertedId);
        res.status(200).send('Form data inserted successfully');
      } catch (error) {
        console.error('Error inserting form data into MongoDB:', error);
        res.status(500).send('Error inserting form data');
      }
    });


  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  }


}




// Function to insert mock data into MongoDB collection
async function insertMockData(mockData) {
  const { userId, answers } = mockData;

  // Object.entries() method is used to convert the answers object into 
  // an array of its own enumerable property [key, value] pairs. 
  // This method returns an array where each element is an array representing a key-value pair from the answers object.
  const responseDocument = {
    userId,
    // map each k-v pair (questionNumber, answer) to create an object
    // questionNumber is parsed to integer
    answers: Object.entries(answers).map(([questionNumber, answer]) => ({
      questionNumber: parseInt(questionNumber),
      answer
    }))
  };

  try {
    // Insert response document into 'questionnaire' collection
    const result = await db.collection(collectionName).insertOne(responseDocument);
    console.log('Mock data inserted successfully:', result.insertedId);
  } catch (error) {
    console.error('Error inserting mock data into MongoDB:', error);
  }
}

// Initialize database connection and start server
connectToDatabase();