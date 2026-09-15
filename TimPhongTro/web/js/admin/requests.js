const STATUS_OPTIONS = ['ChoXuLy', 'DaLienHe', 'DaXuLy', 'DaHuy'];
const STATUS_LABEL = { ChoXuLy: 'Chờ xử lý', DaLienHe: 'Đã liên hệ', DaXuLy: 'Đã xử lý', DaHuy: 'Đã hủy' };

function statusSelectHTML(id, current){
  return '<select id="st-'+id+'">'+
    STATUS_OPTIONS.map(s => '<option value="'+s+'"'+(s===current?' selected':'')+'>'+STATUS_LABEL[s]+'</option>').join('')+
    '</select>';
}

async function loadRequests(){
  const body = document.getElementById('requests-body');
  body.innerHTML = '<tr><td colspan="6" class="empty">Đang tải...</td></tr>';
  const trangThai = document.getElementById('f-trangthai').value;
  const params = new URLSearchParams();
  if(trangThai) params.set('trangThai', trangThai);
  try{
    const rows = await apiGet('/requests?' + params.toString());
    body.innerHTML = rows.map(r =>
      '<tr><td>'+r.tieuDe+'</td>'+
      '<td>'+r.hoTenLienHe+' <span style="color:var(--text-muted);font-size:12px;">('+r.tenNguoiGui+')</span></td>'+
      '<td>'+r.soDienThoaiLienHe+'</td><td>'+(r.loiNhan||'—')+'</td>'+
      '<td>'+statusSelectHTML(r.maYeuCau, r.trangThai)+'</td>'+
      '<td class="actions"><button class="btn btn-sm" onclick="updateStatus('+r.maYeuCau+')">Cập nhật</button></td></tr>'
    ).join('') || '<tr><td colspan="6" class="empty">Chưa có yêu cầu nào.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="6" class="empty">'+err.message+'</td></tr>';
  }
}

async function updateStatus(id){
  const trangThai = document.getElementById('st-'+id).value;
  try{ await apiSend('PUT', '/requests/'+id+'/trangthai', {trangThai}); await loadRequests(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('admin');
  const me = await requireAdmin();
  if(!me) return;

  document.getElementById('form-filter').addEventListener('submit', (e) => { e.preventDefault(); loadRequests(); });
  await loadRequests();
});
