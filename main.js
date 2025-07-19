// public/main.js
document.addEventListener('DOMContentLoaded', () => {
  const threadForm = document.getElementById('thread-form');
  const threadList = document.getElementById('thread-list');
  const adminBtn = document.getElementById('admin-btn');
  // 管理者モードボタンの動作
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      const input = prompt('管理者パスワードを入力してください');
      if (input === 'admin.06010717') {
        alert('管理者モードに入りました');
        // 管理者モード用の処理
      } else {
        alert('パスワードが違います');
      }
    });
  }
  

  // スレッド一覧を取得して表示
  async function loadThreads() {
    const res = await fetch('/api/threads');
    const threads = await res.json();
    threadList.innerHTML = '';
    threads.forEach(thread => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${thread.title}</strong><br>
        <small>${thread.posts[0].name}：${thread.posts[0].content}</small><br>
        <a href="/thread.html?id=${thread.id}">スレッドへ</a>
      `;
      threadList.appendChild(li);
    });
  }

  // 新規スレッド投稿
  threadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('thread-title').value;
    const name = document.getElementById('thread-name').value;
    const content = document.getElementById('thread-content').value;

    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, name, content }),
    });

    if (res.ok) {
      alert('スレッドを作成しました！');
      threadForm.reset();
      loadThreads();
    }
  });

  loadThreads();
});
