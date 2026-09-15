let adminRooms = [];

function roomFormHTML(room){
  const r = room || {};
  return ''+
    '<div class="card" style="margin-bottom:20px;">'+
      '<h3 style="margin:0 0 14px;">'+(room ? 'Sửa phòng' : 'Thêm phòng mới')+'</h3>'+
      '<div id="room-form-error" class="form-error"></div>'+
      '<div class="form-grid">'+
        '<div><label for="rf-tieude">Tiêu đề</label><input id="rf-tieude" value="'+(r.tieuDe||'')+'"></div>'+
        '<div><label for="rf-diachi">Địa chỉ</label><input id="rf-diachi" value="'+(r.diaChi||'')+'"></div>'+
        '<div><label for="rf-quan">Quận/Huyện</label><input id="rf-quan" value="'+(r.quanHuyen||'')+'"></div>'+
        '<div><label for="rf-gia">Giá thuê (đ/tháng)</label><input id="rf-gia" type="number" min="0" value="'+(r.gia||'')+'"></div>'+
        '<div><label for="rf-dientich">Diện tích (m2)</label><input id="rf-dientich" type="number" min="0" value="'+(r.dienTich||'')+'"></div>'+
        '<div><label for="rf-hinh">Link hình ảnh (không bắt buộc)</label><input id="rf-hinh" value="'+(r.hinhAnh||'')+'"></div>'+
      '</div>'+
      '<label for="rf-mota">Mô tả</label>'+
      '<textarea id="rf-mota" rows="3" style="margin-bottom:14px;">'+(r.moTa||'')+'</textarea>'+
      '<button class="btn btn-primary" id="rf-submit">'+(room ? 'Lưu thay đổi' : 'Thêm phòng')+'</button>'+
      '<button class="btn" id="rf-cancel">Hủy</button>'+
    '</div>';
}

function openRoomForm(room){
  const box = document.getElementById('room-form-box');
  box.innerHTML = roomFormHTML(room);
  document.getElementById('rf-cancel').addEventListener('click', () => { box.innerHTML = ''; });
  document.getElementById('rf-submit').addEventListener('click', async () => {
    const data = {
      tieuDe: document.getElementById('rf-tieude').value.trim(),
      diaChi: document.getElementById('rf-diachi').value.trim(),
      quanHuyen: document.getElementById('rf-quan').value.trim(),
      gia: parseFloat(document.getElementById('rf-gia').value),
      dienTich: parseFloat(document.getElementById('rf-dientich').value) || null,
      hinhAnh: document.getElementById('rf-hinh').value.trim() || null,
      moTa: document.getElementById('rf-mota').value.trim(),
    };
    const errBox = document.getElementById('room-form-error');
    errBox.textContent = '';
    try{
      if(room) await apiSend('PUT', '/rooms/'+room.maPhong, data);
      else await apiSend('POST', '/rooms', data);
      box.innerHTML = '';
      await loadRooms();
    }catch(err){ errBox.textContent = err.message; }
  });
}

function currentFilter(){
  return {
    q: document.getElementById('f-q').value.trim(),
    trangThai: document.getElementById('f-trangthai').value,
  };
}

async function loadRooms(){
  const body = document.getElementById('rooms-body');
  body.innerHTML = '<tr><td colspan="6" class="empty">Đang tải...</td></tr>';
  const { q, trangThai } = currentFilter();
  const params = new URLSearchParams();
  if(q) params.set('q', q);
  if(trangThai) params.set('trangThai', trangThai);
  try{
    adminRooms = await apiGet('/admin/rooms?' + params.toString());
    body.innerHTML = adminRooms.map(r =>
      '<tr><td>'+r.tieuDe+'</td><td>'+r.diaChi+'</td><td>'+fmtMoney(r.gia)+'</td><td>'+r.tenNguoiDang+'</td><td>'+statusBadge(r.trangThai)+'</td>'+
      '<td class="actions">'+
        '<button class="btn btn-sm" onclick="editAdminRoom('+r.maPhong+')">Sửa</button>'+
        '<button class="btn btn-sm btn-danger" onclick="deleteAdminRoom('+r.maPhong+')">Xóa</button>'+
      '</td></tr>'
    ).join('') || '<tr><td colspan="6" class="empty">Không có phòng nào phù hợp.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="6" class="empty">'+err.message+'</td></tr>';
  }
}

function editAdminRoom(id){
  const room = adminRooms.find(r => r.maPhong === id);
  if(room) openRoomForm(room);
}

async function deleteAdminRoom(id){
  if(!confirm('Xóa phòng này?')) return;
  try{ await apiSend('DELETE', '/rooms/'+id); await loadRooms(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('admin');
  const me = await requireAdmin();
  if(!me) return;

  document.getElementById('form-filter').addEventListener('submit', (e) => { e.preventDefault(); loadRooms(); });
  document.getElementById('btn-new-room').addEventListener('click', () => openRoomForm(null));

  await loadRooms();
});
