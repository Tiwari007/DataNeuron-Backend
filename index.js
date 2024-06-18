const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const uri = "mongodb+srv://VivekTiwari:N9mxc4eGkjhD9KAc@forinterviewpurpose.foswxtu.mongodb.net/DataNeuron";

const app = express();
const PORT = process.env.PORT || 5000;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MongoDB connection
mongoose.connect(uri, options)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// MongoDB schema
const userdatas = new mongoose.Schema({
  userData: {
    id: Number,
    name: String,
    age: Number,
    designation: String
  },
  count: Number
});

const UserData = mongoose.model('UserData', userdatas);
// Create a new instance of the UserData model with some sample data
const sampleUserData = new UserData({
  userData: {
    id: Number(Math.random()*1000000),
    name: "John Doe",
    age: 30,
    designation: "Software Engineer"
  },
  count: 1 // Assuming this is a count related to the user data
});

// Save the sample data to the database
sampleUserData.save()
  .then(() => console.log('Sample user data added successfully'))
  .catch(err => console.error('Error adding sample user data:', err));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/data', async (req, res) => {
  try {
    const userData = await UserData.find(); // Assuming there's only one document in the collection
    console.log(userData);
    const count = await UserData.countDocuments();
    res.json({ userData, count });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addUser', async (req, res) => {
  try {
    const userData = new UserData(req.body);
    await userData.save();
    res.json({ message: 'Data added successfully!' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateUser/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await UserData.findOneAndUpdate({ 'userData.id': id }, req.body, { new: true });
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User data updated successfully', userData });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
