async function loadSaved(){
  const list = document.getElementById('saved-list');
  try{
    const rooms = await apiGet('/saved');
    list.innerHTML = rooms.map(r =>
      '<div>'+roomCardHTML(r)+
      '<button class="btn btn-sm btn-danger" style="width:100%;margin-top:6px;" onclick="unsave('+r.maPhong+')">Bỏ lưu</button></div>'
    ).join('') || '<div class="empty">Bạn chưa lưu tin nào.</div>';
  }catch(err){
    list.innerHTML = '<div class="empty">'+err.message+'</div>';
  }
}

async function unsave(id){
  try{ await apiSend('DELETE', '/saved/'+id); await loadSaved(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('saved');
  const me = await requireAuth();
  if(!me) return;
  await loadSaved();
});
