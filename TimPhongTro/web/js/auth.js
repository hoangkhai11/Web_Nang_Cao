/* Navbar dung chung + cac ham dang nhap/dang ky/dang xuat, dua vao moi trang qua
   <div id="navbar"></div> va goi renderNavbar('id-trang-hien-tai'). */
function renderNavbar(active){
  const el = document.getElementById('navbar');
  if(!el) return;
  const user = getUser();
  const links = [
    {href:'/index.html', label:'Trang chủ', id:'home'},
    {href:'/pages/rooms.html', label:'Tìm phòng', id:'rooms'},
  ];
  if(user){
    links.push({href:'/pages/saved.html', label:'Đã lưu', id:'saved'});
    links.push({href:'/pages/requests.html', label:'Yêu cầu của tôi', id:'requests'});
    links.push({href:'/pages/profile.html', label:'Hồ sơ', id:'profile'});
    if(user.vaiTro === 'Admin') links.push({href:'/pages/admin/dashboard.html', label:'Quản trị', id:'admin'});
  }
  el.innerHTML =
    '<div class="navbar">'+
      '<a class="navbar-brand" href="/index.html">TimPhongTro</a>'+
      '<nav class="navbar-links">'+
        links.map(l=>'<a href="'+l.href+'" class="'+(active===l.id?'active':'')+'">'+l.label+'</a>').join('')+
      '</nav>'+
      '<div class="navbar-auth">'+
        (user
          ? '<span class="navbar-user">Xin chào, '+user.hoTen+'</span><button class="btn" onclick="logout()">Đăng xuất</button>'
          : '<a class="btn" href="/pages/login.html">Đăng nhập</a><a class="btn btn-primary" href="/pages/register.html">Đăng ký</a>')+
      '</div>'+
    '</div>';
}

function logout(){
  setToken(null); setUser(null);
  location.href = '/index.html';
}

// Dung dau moi trang can dang nhap. Tra ve thong tin user moi nhat tu server (hoac null neu bi redirect).
async function requireAuth(){
  if(!getToken()){ location.href = '/pages/login.html'; return null; }
  try{ const me = await apiGet('/users/me'); setUser(me); return me; }
  catch{ return null; }
}

async function requireAdmin(){
  const me = await requireAuth();
  if(me && me.vaiTro !== 'Admin'){ location.href = '/index.html'; return null; }
  return me;
}

async function doLoginForm(e){
  e.preventDefault();
  const email = document.getElementById('in-email').value.trim();
  const matKhau = document.getElementById('in-pass').value;
  const errBox = document.getElementById('form-error');
  errBox.textContent = '';
  try{
    const data = await apiSend('POST', '/auth/login', {email, matKhau});
    setToken(data.token); setUser(data.user);
    location.href = data.user.vaiTro === 'Admin' ? '/pages/admin/dashboard.html' : '/index.html';
  }catch(err){ errBox.textContent = err.message; }
}

async function doRegisterForm(e){
  e.preventDefault();
  const hoTen = document.getElementById('in-hoten').value.trim();
  const email = document.getElementById('in-email').value.trim();
  const soDienThoai = document.getElementById('in-sdt').value.trim();
  const matKhau = document.getElementById('in-pass').value;
  const matKhau2 = document.getElementById('in-pass2').value;
  const errBox = document.getElementById('form-error');
  errBox.textContent = '';
  if(matKhau.length < 6){ errBox.textContent = 'Mật khẩu cần ít nhất 6 ký tự.'; return; }
  if(matKhau !== matKhau2){ errBox.textContent = 'Mật khẩu nhập lại không khớp.'; return; }
  try{
    const data = await apiSend('POST', '/auth/register', {hoTen, email, soDienThoai, matKhau});
    setToken(data.token); setUser(data.user);
    location.href = '/index.html';
  }catch(err){ errBox.textContent = err.message; }
}
