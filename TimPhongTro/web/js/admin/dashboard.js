function renderChart(rows){
  if(!rows || !rows.length) return '<div class="empty">Chưa có phòng nào được duyệt.</div>';
  const max = Math.max(...rows.map(r => Number(r.soLuong)), 1);
  return rows.map(r => {
    const pct = Math.max(4, Math.round((Number(r.soLuong)/max)*100));
    return '<div class="chart-row"><div>'+r.quanHuyen+'</div>'+
      '<div class="chart-track"><div class="chart-fill" style="width:'+pct+'%"></div></div>'+
      '<div>'+r.soLuong+'</div></div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('admin');
  const me = await requireAdmin();
  if(!me) return;

  try{
    const d = await apiGet('/admin/dashboard');
    document.getElementById('stat-grid').innerHTML =
      '<div class="stat-card"><div class="label">Tổng số tin đăng</div><div class="value">'+(d.tongPhong||0)+'</div></div>'+
      '<div class="stat-card"><div class="label">Chờ duyệt</div><div class="value">'+(d.choDuyet||0)+'</div></div>'+
      '<div class="stat-card"><div class="label">Đã duyệt</div><div class="value">'+(d.daDuyet||0)+'</div></div>'+
      '<div class="stat-card"><div class="label">Từ chối / Đã ẩn</div><div class="value">'+((d.tuChoi||0)+(d.daAn||0))+'</div></div>'+
      '<div class="stat-card"><div class="label">Tổng người dùng</div><div class="value">'+(d.tongNguoiDung||0)+'</div></div>'+
      '<div class="stat-card"><div class="label">Yêu cầu chờ xử lý</div><div class="value">'+(d.choXuLy||0)+'</div></div>';
    document.getElementById('chart-quan').innerHTML = renderChart(d.phongTheoQuan);
  }catch(err){
    document.getElementById('stat-grid').innerHTML = '<div class="empty">'+err.message+'</div>';
  }
});
