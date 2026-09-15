let currentAdmin = null;

async function loadUsers(){
  const body = document.getElementById('users-body');
  try{
    const rows = await apiGet('/users');
    body.innerHTML = rows.map(u =>
      '<tr><td>'+u.hoTen+'</td><td>'+u.email+'</td><td>'+(u.soDienThoai||'—')+'</td><td>'+statusBadge(u.vaiTro)+'</td><td>'+fmtDate(u.ngayTao)+'</td>'+
      '<td class="actions">'+
        (u.maNguoiDung === currentAdmin.id
          ? '<span style="color:var(--text-muted);font-size:12px;">Đang đăng nhập</span>'
          : '<button class="btn btn-sm btn-danger" onclick="deleteUser('+u.maNguoiDung+')">Xóa</button>')+
      '</td></tr>'
    ).join('') || '<tr><td colspan="6" class="empty">Chưa có người dùng nào.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="6" class="empty">'+err.message+'</td></tr>';
  }
}

async function deleteUser(id){
  if(!confirm('Xóa người dùng này?')) return;
  try{ await apiSend('DELETE', '/users/'+id); await loadUsers(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('admin');
  const me = await requireAdmin();
  if(!me) return;
  currentAdmin = { id: me.maNguoiDung };
  await loadUsers();
});
