async function loadPosts(){
  const body = document.getElementById('posts-body');
  body.innerHTML = '<tr><td colspan="6" class="empty">Đang tải...</td></tr>';
  const trangThai = document.getElementById('f-trangthai').value;
  const params = new URLSearchParams();
  if(trangThai) params.set('trangThai', trangThai);
  try{
    const rows = await apiGet('/admin/rooms?' + params.toString());
    body.innerHTML = rows.map(r =>
      '<tr><td>'+r.tieuDe+'</td><td>'+r.diaChi+'</td><td>'+r.tenNguoiDang+'</td><td>'+fmtDate(r.ngayDang)+'</td><td>'+statusBadge(r.trangThai)+'</td>'+
      '<td class="actions">'+
        '<button class="btn btn-sm" onclick="setStatus('+r.maPhong+',\'DaDuyet\')">Duyệt</button>'+
        '<button class="btn btn-sm btn-danger" onclick="setStatus('+r.maPhong+',\'TuChoi\')">Từ chối</button>'+
        '<button class="btn btn-sm" onclick="setStatus('+r.maPhong+',\'DaAn\')">Ẩn</button>'+
      '</td></tr>'
    ).join('') || '<tr><td colspan="6" class="empty">Không có tin nào.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="6" class="empty">'+err.message+'</td></tr>';
  }
}

async function setStatus(id, trangThai){
  try{ await apiSend('PUT', '/admin/rooms/'+id+'/trangthai', {trangThai}); await loadPosts(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('admin');
  const me = await requireAdmin();
  if(!me) return;

  document.getElementById('form-filter').addEventListener('submit', (e) => { e.preventDefault(); loadPosts(); });
  await loadPosts();
});
