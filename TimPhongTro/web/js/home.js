document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('home');

  document.getElementById('home-search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('home-q').value.trim();
    location.href = '/pages/rooms.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
  });

  const list = document.getElementById('featured-list');
  try{
    const rooms = await apiGet('/rooms');
    list.innerHTML = rooms.slice(0, 6).map(roomCardHTML).join('') || '<div class="empty">Chưa có phòng nào được đăng.</div>';
  }catch(err){
    list.innerHTML = '<div class="empty">'+err.message+'</div>';
  }
});
