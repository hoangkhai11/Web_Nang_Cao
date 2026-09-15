function getRoomId(){ return new URLSearchParams(location.search).get('id'); }

function detailHTML(r){
  const img = r.hinhAnh || 'https://placehold.co/800x480?text=Ph%C3%B2ng+tr%E1%BB%8D';
  return ''+
    '<div class="detail-img" style="background-image:url(\''+img+'\')"></div>'+
    '<h1>'+r.tieuDe+'</h1>'+
    '<p class="detail-addr">'+r.diaChi+(r.quanHuyen?(' — '+r.quanHuyen):'')+'</p>'+
    '<div class="detail-meta">'+
      '<span><b>'+fmtMoney(r.gia)+'</b>/tháng</span>'+
      (r.dienTich?('<span>'+r.dienTich+' m2</span>'):'')+
      '<span>Người đăng: '+r.tenNguoiDang+'</span>'+
    '</div>'+
    '<p class="detail-desc">'+(r.moTa ? r.moTa.replace(/\n/g,'<br>') : 'Chưa có mô tả.')+'</p>'+
    '<button class="btn" id="btn-save">'+(getUser() ? 'Lưu tin' : 'Đăng nhập để lưu tin')+'</button>';
}

function wireSaveButton(maPhong){
  const btn = document.getElementById('btn-save');
  btn.addEventListener('click', async () => {
    if(!getUser()){ location.href = '/pages/login.html'; return; }
    try{ await apiSend('POST', '/saved/'+maPhong); btn.textContent = 'Đã lưu ✓'; btn.disabled = true; }
    catch(err){ alert(err.message); }
  });
}

function wireRequestForm(maPhong){
  const box = document.getElementById('request-box');
  if(!getUser()){
    box.innerHTML = '<p class="empty"><a href="/pages/login.html">Đăng nhập</a> để gửi yêu cầu liên hệ xem phòng.</p>';
    return;
  }
  box.innerHTML =
    '<h3>Gửi yêu cầu liên hệ</h3>'+
    '<div id="req-error" class="form-error"></div>'+
    '<label for="req-hoten">Họ tên liên hệ</label><input id="req-hoten" value="'+(getUser().hoTen||'')+'">'+
    '<label for="req-sdt">Số điện thoại</label><input id="req-sdt">'+
    '<label for="req-msg">Lời nhắn</label><textarea id="req-msg" rows="3" placeholder="VD: Mình muốn xem phòng cuối tuần này..."></textarea>'+
    '<button class="btn btn-primary" id="req-submit" style="width:100%;">Gửi yêu cầu</button>';

  document.getElementById('req-submit').addEventListener('click', async () => {
    const hoTenLienHe = document.getElementById('req-hoten').value.trim();
    const soDienThoaiLienHe = document.getElementById('req-sdt').value.trim();
    const loiNhan = document.getElementById('req-msg').value.trim();
    const err = document.getElementById('req-error');
    err.textContent = '';
    try{
      await apiSend('POST', '/requests', {maPhong, hoTenLienHe, soDienThoaiLienHe, loiNhan});
      box.innerHTML = '<p class="empty">Đã gửi yêu cầu, admin/chủ nhà sẽ liên hệ bạn sớm.</p>';
    }catch(e){ err.textContent = e.message; }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('rooms');
  const id = getRoomId();
  const box = document.getElementById('detail-box');
  if(!id){ box.innerHTML = '<div class="empty">Thiếu mã phòng.</div>'; return; }
  try{
    const r = await apiGet('/rooms/'+id);
    box.innerHTML = detailHTML(r);
    wireSaveButton(r.maPhong);
    wireRequestForm(r.maPhong);
  }catch(err){
    box.innerHTML = '<div class="empty">'+err.message+'</div>';
    document.getElementById('request-box').remove();
  }
});
