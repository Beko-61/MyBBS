// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const threadsFile = './data/threads.json';

function readThreads() {
  if (!fs.existsSync(threadsFile)) return [];
  const raw = fs.readFileSync(threadsFile);
  return JSON.parse(raw);
}

function writeThreads(threads) {
  fs.writeFileSync(threadsFile, JSON.stringify(threads, null, 2));
}

app.get('/api/threads', (req, res) => {
  const threads = readThreads();
  res.json(threads.map(t => ({ id: t.id, title: t.title })));
});

app.post('/api/threads', (req, res) => {
  const { title, name, content } = req.body;
  const threads = readThreads();
  const id = Date.now().toString();
  const newThread = {
    id,
    title,
    posts: [
      { name: name || '名無しさん', content: content }
    ]
  };
  threads.push(newThread);
  writeThreads(threads);
  res.status(201).json({ id });
});

app.get('/api/thread/:id', (req, res) => {
  const threads = readThreads();
  const thread = threads.find(t => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'Not found' });
  res.json(thread);
});

app.post('/api/thread/:id/reply', (req, res) => {
  const { name, content } = req.body;
  const threads = readThreads();
  const thread = threads.find(t => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  thread.posts.push({ name: name || '名無しさん', content });
  writeThreads(threads);
  res.status(201).json({ success: true });
});

app.get('/thread', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thread.html'));
});

app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動中…`);
});
