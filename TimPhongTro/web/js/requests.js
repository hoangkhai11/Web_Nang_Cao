document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('requests');
  const me = await requireAuth();
  if(!me) return;

  const body = document.getElementById('req-body');
  try{
    const rows = await apiGet('/requests/me');
    body.innerHTML = rows.map(r =>
      '<tr><td><a href="/pages/room-detail.html?id='+r.maPhong+'">'+r.tieuDe+'</a></td>'+
      '<td>'+r.hoTenLienHe+'</td><td>'+r.soDienThoaiLienHe+'</td>'+
      '<td>'+(r.loiNhan||'—')+'</td><td>'+fmtDate(r.ngayTao)+'</td><td>'+statusBadge(r.trangThai)+'</td></tr>'
    ).join('') || '<tr><td colspan="6" class="empty">Bạn chưa gửi yêu cầu nào.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="6" class="empty">'+err.message+'</td></tr>';
  }
});
