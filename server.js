// koharu-bbs: シンプルな2ch風匿名BBS

// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = './data/threads.json';

// データファイルがなければ初期化
if (!fs.existsSync(DATA_FILE)) {
  fs.mkdirSync('./data', { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// スレッド一覧取得
app.get('/api/threads', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// スレッド新規作成
app.post('/api/threads', (req, res) => {
  const threads = JSON.parse(fs.readFileSync(DATA_FILE));
  const { title, name, content } = req.body;
  const threadId = threads.length + 1;
  const timestamp = new Date().toISOString();
  threads.push({
    id: threadId,
    title,
    posts: [{
      id: 1,
      name: name || '名無しさん',
      content,
      timestamp,
    }],
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(threads, null, 2));
  res.json({ success: true });
});

// 投稿追加
app.post('/api/threads/:id/posts', (req, res) => {
  const threads = JSON.parse(fs.readFileSync(DATA_FILE));
  const { id } = req.params;
  const { name, content } = req.body;
  const thread = threads.find(t => t.id === Number(id));
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  const timestamp = new Date().toISOString();
  thread.posts.push({
    id: thread.posts.length + 1,
    name: name || '名無しさん',
    content,
    timestamp,
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(threads, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`BBS running at http://localhost:${PORT}`);
});

/*
public/
  index.html
  style.css
  main.js
*/
