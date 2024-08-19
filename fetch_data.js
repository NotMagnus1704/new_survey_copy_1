const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(express.json());

client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
    const db = client.db('VRNC');
    const questionnaireCollection = db.collection('questionnaire');

    
    app.get('/getFormData/:formId', async (req, res) => {
        const { formId } = req.params;
        try {
            const documents = await questionnaireCollection.find({ form2Id: formId }).toArray();
            if (documents.length > 0) {
                res.status(200).json(documents);
            } else {
                res.status(404).send('No documents found');
            }
        } catch (error) {
            console.error('Error retrieving documents from MongoDB:', error);
            res.status(500).send('Error retrieving documents');
        }
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
