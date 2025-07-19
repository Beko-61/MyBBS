
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const message = document.createElement('div');
  message.className = 'message';
  message.innerHTML = '<strong class="admin-tag">[管理者]</strong> ようこそ、こはるBBSへ！';
  app.appendChild(message);
});
