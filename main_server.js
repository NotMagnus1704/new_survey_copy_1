const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' middleware

const app = express();

const port = process.env.PORT;

const mongoURI = process.env.MONGODB_URI;
const dbName = 'VRNC';
const collectionName = 'questionnaire';

const sendEmail = require('./send_mail');


// MongoDB connection instance
let db;

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
    app.listen(port, () => {
      console.log('Server is running on port 3000');
    });

    app.post('/submitFormData', async (req, res) => {
      const formData = req.body;
      const formId = formData.form_id;
      const clientEmail = formData.questions.client_email;
      const dateOfSubmission = formData.date;
      const timeOfSubmission = formData.time;

      console.log('Received formData:', formData);

      try {
        // Insert formData into 'questionnaire' collection
        const result = await db.collection(collectionName).insertOne(formData);
        console.log("\n------------------------------------------------------------------------")
        console.log('Form data inserted successfully:', result.insertedId);
        console.log("------------------------------------------------------------------------")
        console.log("Form ID = ", formId);
        console.log("------------------------------------------------------------------------")

        sendEmail(clientEmail, formId, dateOfSubmission, timeOfSubmission);

        res.status(200).send('Form data inserted successfully\nForm ID Sent To Client Email ID!');



      } catch (error) {
        console.error('Error inserting form data into MongoDB:', error);
        res.status(500).send('Error inserting form data');
      }
    });

    // endpoint to get all the forms from the database
    app.post('/form2/getForms', async (req, res) => {
      try {
        const forms = await db.collection(collectionName).find().toArray();
        // console.log(forms);
        res.status(200).json({ forms });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the forms.' });
      }
    });

    // endpoint to hanlde delete form thru a given id
    app.post('/form2/deleteForm', (req, res) => {
      const { form2Id } = req.body;

      console.log(`Attempting to delete form with form2Id: ${form2Id}`);

      db.collection(collectionName)
          .deleteOne({ form2Id: form2Id })
          .then(result => {
              if (result.deletedCount === 1) {
                  res.json({ message: 'Form deleted successfully' });
              } else {
                  res.status(404).json({ error: 'Form not found' });
              }
          })
          .catch(error => {
              console.error('Error deleting form:', error);
              res.status(500).json({ error: 'Failed to delete form' });
          });
      });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }


}

connectToDatabase();


/* code for testing purposes, refer for any doubts
---------------------------------------------------------------------------------------------------------------------------

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

---------------------------------------------------------------------------------------------------------------------------
*/

