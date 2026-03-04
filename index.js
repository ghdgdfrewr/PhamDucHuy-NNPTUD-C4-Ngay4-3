const express = require('express');
const { dataRole, dataUser } = require('./data');

const app = express();
app.use(express.json()); // để đọc body JSON

const PORT = 3000;

// ======================
// CRUD cho ROLES
// ======================

// GET all roles
app.get('/roles', (req, res) => {
  res.json(dataRole);
});

// GET role by id
app.get('/roles/:id', (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
});

// POST create new role
app.post('/roles', (req, res) => {
  const newRole = {
    id: `r${dataRole.length + 1}`, // tự sinh id đơn giản
    name: req.body.name,
    description: req.body.description || '',
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataRole.push(newRole);
  res.status(201).json(newRole);
});

// PUT update role
app.put('/roles/:id', (req, res) => {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Role not found' });

  dataRole[index] = {
    ...dataRole[index],
    name: req.body.name || dataRole[index].name,
    description: req.body.description || dataRole[index].description,
    updatedAt: new Date().toISOString()
  };
  res.json(dataRole[index]);
});

// DELETE role
app.delete('/roles/:id', (req, res) => {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Role not found' });

  dataRole.splice(index, 1);
  res.status(204).send();
});

// ======================
// CRUD cho USERS
// ======================

// GET all users
app.get('/users', (req, res) => {
  res.json(dataUser);
});

// GET user by username (hoặc có thể đổi thành id nếu muốn)
app.get('/users/:username', (req, res) => {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST create new user
app.post('/users', (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || 'https://i.sstatic.net/l60Hf.png',
    status: req.body.status ?? true,
    loginCount: req.body.loginCount || 0,
    role: req.body.role, // mong đợi object {id, name, description}
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataUser.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:username', (req, res) => {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  dataUser[index] = {
    ...dataUser[index],
    ...req.body, // override các field được gửi lên
    updatedAt: new Date().toISOString()
  };
  res.json(dataUser[index]);
});

// DELETE user
app.delete('/users/:username', (req, res) => {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  dataUser.splice(index, 1);
  res.status(204).send();
});

// ======================
// ENDPOINT BỔ SUNG: Lấy tất cả user thuộc một role
// ======================
app.get('/roles/:id/users', (req, res) => {
  const roleId = req.params.id;
  const usersInRole = dataUser.filter(user => user.role?.id === roleId);
  
  if (usersInRole.length === 0) {
    return res.status(404).json({ message: 'No users found in this role' });
  }
  
  res.json(usersInRole);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});