const express = require('express');
const { v4: uuidv4, validate: isUuid } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

 
let users = [
  { id: uuidv4(), username: 'John Doe', age: 25, hobbies: ['Reading', 'Traveling'] },
  { id: uuidv4(), username: 'Jane Doe', age: 30, hobbies: ['Cooking', 'Painting'] },
];
 
app.use(express.json());

 
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

 
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isUuid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

 
app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required fields' });
  }

  const newUser = { id: uuidv4(), username, age, hobbies: hobbies || [] };
  users.push(newUser);

  res.status(201).json(newUser);
});

 
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isUuid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required fields' });
  }

  users[userIndex] = { id: userId, username, age, hobbies: hobbies || [] };

  res.status(200).json(users[userIndex]);
});

 
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isUuid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.status(200).json({ message: 'successfully deleted' });
});

 
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
