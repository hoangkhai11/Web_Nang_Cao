/* Helper goi API + tien ich dung chung cho toan bo cac trang.
   Token JWT luu trong localStorage (khac voi ban SPA truoc, o day nhieu trang HTML
   rieng biet nen can token song qua cac lan tai trang). */
const API_BASE = '/api';

function getToken(){ return localStorage.getItem('tpt_token'); }
function setToken(t){ if(t) localStorage.setItem('tpt_token', t); else localStorage.removeItem('tpt_token'); }
function getUser(){ try{ return JSON.parse(localStorage.getItem('tpt_user') || 'null'); }catch{ return null; } }
function setUser(u){ if(u) localStorage.setItem('tpt_user', JSON.stringify(u)); else localStorage.removeItem('tpt_user'); }

function authHeaders(extra){
  const headers = Object.assign({}, extra);
  const token = getToken();
  if(token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function apiGet(path){
  const r = await fetch(API_BASE + path, { headers: authHeaders() });
  if(r.status === 401){ setToken(null); setUser(null); location.href = '/pages/login.html'; throw new Error('401'); }
  const data = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.error || 'Yêu cầu thất bại.');
  return data;
}

async function apiSend(method, path, body){
  const r = await fetch(API_BASE + path, {
    method,
    headers: authHeaders({'Content-Type':'application/json'}),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if(r.status === 401){ setToken(null); setUser(null); location.href = '/pages/login.html'; throw new Error('401'); }
  const data = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.error || 'Yêu cầu thất bại.');
  return data;
}

function fmtMoney(n){ return (Number(n)||0).toLocaleString('vi-VN')+' đ'; }
function fmtDate(s){ return s ? String(s).slice(0,10) : '—'; }

function statusBadge(s){
  const map = {
    ChoDuyet:['Chờ duyệt','badge-amber'], DaDuyet:['Đã duyệt','badge-green'], TuChoi:['Từ chối','badge-red'], DaAn:['Đã ẩn','badge-gray'],
    ChoXuLy:['Chờ xử lý','badge-amber'], DaLienHe:['Đã liên hệ','badge-green'], DaXuLy:['Đã xử lý','badge-green'], DaHuy:['Đã hủy','badge-gray'],
    Admin:['Admin','badge-green'], NguoiDung:['Người dùng','badge-gray'],
  };
  const p = map[s] || [s,'badge-gray'];
  return '<span class="badge '+p[1]+'">'+p[0]+'</span>';
}

function roomCardHTML(r){
  const img = r.hinhAnh || 'https://placehold.co/400x260?text=Ph%C3%B2ng+tr%E1%BB%8D';
  return '<a class="room-card" href="/pages/room-detail.html?id='+r.maPhong+'">'+
    '<div class="room-card-img" style="background-image:url(\''+img+'\')"></div>'+
    '<div class="room-card-body">'+
      '<div class="room-card-title">'+r.tieuDe+'</div>'+
      '<div class="room-card-addr">'+r.diaChi+(r.quanHuyen?(' — '+r.quanHuyen):'')+'</div>'+
      '<div class="room-card-price">'+fmtMoney(r.gia)+'/tháng</div>'+
    '</div></a>';
}
