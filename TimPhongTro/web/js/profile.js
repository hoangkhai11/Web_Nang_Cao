let myRooms = [];

function roomFormHTML(room){
  const r = room || {};
  return ''+
    '<div class="card" style="margin-bottom:20px;">'+
      '<h3 style="margin:0 0 14px;">'+(room ? 'Sửa tin đăng' : 'Đăng tin mới')+'</h3>'+
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
      '<button class="btn btn-primary" id="rf-submit">'+(room ? 'Lưu thay đổi' : 'Đăng tin')+'</button>'+
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
      await loadMyRooms();
    }catch(err){ errBox.textContent = err.message; }
  });
}

async function loadMyRooms(){
  const body = document.getElementById('my-rooms-body');
  try{
    myRooms = await apiGet('/rooms/mine');
    body.innerHTML = myRooms.map(r =>
      '<tr><td>'+r.tieuDe+'</td><td>'+r.diaChi+'</td><td>'+fmtMoney(r.gia)+'</td><td>'+statusBadge(r.trangThai)+'</td>'+
      '<td class="actions">'+
        '<button class="btn btn-sm" onclick="editRoom('+r.maPhong+')">Sửa</button>'+
        '<button class="btn btn-sm btn-danger" onclick="deleteRoom('+r.maPhong+')">Xóa</button>'+
      '</td></tr>'
    ).join('') || '<tr><td colspan="5" class="empty">Bạn chưa đăng tin nào.</td></tr>';
  }catch(err){
    body.innerHTML = '<tr><td colspan="5" class="empty">'+err.message+'</td></tr>';
  }
}

function editRoom(id){
  const room = myRooms.find(r => r.maPhong === id);
  if(room) openRoomForm(room);
}

async function deleteRoom(id){
  if(!confirm('Xóa tin đăng này?')) return;
  try{ await apiSend('DELETE', '/rooms/'+id); await loadMyRooms(); }
  catch(err){ alert(err.message); }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('profile');
  const me = await requireAuth();
  if(!me) return;

  document.getElementById('in-email').value = me.email;
  document.getElementById('in-hoten').value = me.hoTen;
  document.getElementById('in-sdt').value = me.soDienThoai || '';

  document.getElementById('form-info').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errBox = document.getElementById('info-error');
    errBox.textContent = '';
    try{
      await apiSend('PUT', '/users/me', {
        hoTen: document.getElementById('in-hoten').value.trim(),
        soDienThoai: document.getElementById('in-sdt').value.trim(),
      });
      const updated = Object.assign({}, me, { hoTen: document.getElementById('in-hoten').value.trim() });
      setUser(updated);
      renderNavbar('profile');
    }catch(err){ errBox.textContent = err.message; }
  });

  document.getElementById('form-pass').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errBox = document.getElementById('pass-error');
    errBox.textContent = '';
    try{
      await apiSend('PUT', '/users/me/matkhau', {
        matKhauCu: document.getElementById('in-passold').value,
        matKhauMoi: document.getElementById('in-passnew').value,
      });
      document.getElementById('form-pass').reset();
      errBox.textContent = '';
      alert('Đổi mật khẩu thành công.');
    }catch(err){ errBox.textContent = err.message; }
  });

  document.getElementById('btn-new-room').addEventListener('click', () => openRoomForm(null));

  await loadMyRooms();
});
