function readQuery(){
  return Object.fromEntries(new URLSearchParams(location.search).entries());
}
function buildQuery(obj){
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k,v])=>{ if(v) p.set(k,v); });
  return p.toString();
}

async function loadRooms(query){
  const list = document.getElementById('room-list');
  list.innerHTML = '<div class="empty">Đang tải...</div>';
  try{
    const rooms = await apiGet('/rooms?' + buildQuery(query));
    list.innerHTML = rooms.map(roomCardHTML).join('') || '<div class="empty">Không tìm thấy phòng phù hợp.</div>';
  }catch(err){
    list.innerHTML = '<div class="empty">'+err.message+'</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('rooms');
  const q = readQuery();
  document.getElementById('f-q').value = q.q || '';
  document.getElementById('f-quan').value = q.quanHuyen || '';
  document.getElementById('f-giamin').value = q.giaMin || '';
  document.getElementById('f-giamax').value = q.giaMax || '';

  document.getElementById('form-filter').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = {
      q: document.getElementById('f-q').value.trim(),
      quanHuyen: document.getElementById('f-quan').value.trim(),
      giaMin: document.getElementById('f-giamin').value,
      giaMax: document.getElementById('f-giamax').value,
    };
    location.href = '/pages/rooms.html?' + buildQuery(query);
  });

  loadRooms(q);
});
