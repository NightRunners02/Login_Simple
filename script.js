/* script.js
   Handles: register, login, forgot, history display, remove entries, remember-me, toast
   Uses localStorage keys:
     - nz_users    : array of {email,password,createdAt}
     - nz_remember : remembered email (string)
     - nz_logged   : current logged email (string)
*/

(function(){
  // === util: toast ===
  function showToast(message, tone = 'info') {
    let toast = document.getElementById('toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(0,255,255,0.8)';
      toast.style.color = '#000';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '30px';
      toast.style.fontWeight = 'bold';
      toast.style.transition = '0.4s';
      toast.style.opacity = '0';
      toast.style.zIndex = '9999';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(()=> toast.style.opacity = '0', 3000);
  }

  // === utils ===
  function readUsers(){ return JSON.parse(localStorage.getItem('nz_users') || '[]'); }
  function writeUsers(arr){ localStorage.setItem('nz_users', JSON.stringify(arr)); }
  function isoNow(){ return new Date().toLocaleString(); }

  // === email validation (must end with known domain) ===
  function isValidEmail(email) {
    if (!email.includes('@')) return false;
    const allowedDomains = [
      '@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com',
      '@icloud.com', '@um.ac.id', '@student.edu'
    ];
    return allowedDomains.some(domain => email.endsWith(domain));
  }

  /* REGISTER PAGE */
  const registerForm = document.getElementById('registerForm');
  if(registerForm){
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('email') || {}).value?.trim?.() || '';
      const password = (document.getElementById('password') || {}).value?.trim?.() || '';

      if(!email || !password){ showToast('Isi email & password dulu ✨'); return; }

      // validasi email format domain
      if(!isValidEmail(email)){
        showToast('⚠️ Gunakan email valid seperti @gmail.com, @yahoo.com, dsb.');
        return;
      }

      const users = readUsers();
      if(users.some(u=>u.email === email)){
        showToast('⚠️ Email sudah terdaftar');
        return;
      }
      users.push({ email, password, createdAt: isoNow() });
      writeUsers(users);
      showToast('✅ Akun berhasil dibuat!');
      setTimeout(()=> location.href = 'index.html', 900);
    });
  }

  /* LOGIN PAGE */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    // autofill remembered
    const remembered = localStorage.getItem('nz_remember');
    if(remembered){
      const emailInput = document.getElementById('email');
      if(emailInput) emailInput.value = remembered;
      const rememberBox = document.getElementById('remember');
      if(rememberBox) rememberBox.checked = true;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('email') || {}).value?.trim?.() || '';
      const password = (document.getElementById('password') || {}).value?.trim?.() || '';

      if(!email || !password){ showToast('Masukkan email & password'); return; }

      // validasi email format
      if(!isValidEmail(email)){
        showToast('Email tidak valid! Gunakan domain yang benar');
        return;
      }

      const users = readUsers();
      const found = users.find(u=> u.email === email && u.password === password);
      if(!found){
        showToast('❌ Email atau password salah');
        return;
      }
      // remember me
      const remember = document.getElementById('remember')?.checked;
      if(remember) localStorage.setItem('nz_remember', email);
      else localStorage.removeItem('nz_remember');

      localStorage.setItem('nz_logged', email);
      showToast('✔️ Login sukses. Mengarahkan ke Riwayat...');
      setTimeout(()=> location.href='history.html', 900);
    });
  }

  /* FORGOT PAGE */
  const forgotForm = document.getElementById('forgotForm');
  if(forgotForm){
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('forgotEmail') || {}).value?.trim?.() || '';

      if(!email){ showToast('Masukkan email untuk reset.'); return; }
      if(!isValidEmail(email)){ showToast('Email tidak valid!'); return; }

      const users = readUsers();
      const found = users.find(u=> u.email === email);
      if(!found){ showToast('Email tidak ditemukan.'); return; }

      // demo: simulate reset token
      const token = Math.random().toString(36).slice(2,9);
      localStorage.setItem('nz_reset_'+email, token);
      showToast('🔐 Link reset dikirim (simulasi) — cek konsol');
      console.log('Reset token (simulated) ->', token);
    });
  }

  /* HISTORY PAGE: show users, delete, clear all */
  const historyTable = document.getElementById('historyTable');
  if(historyTable){
    const tbody = historyTable.querySelector('tbody');
    function render(){
      const users = readUsers();
      tbody.innerHTML = '';
      if(users.length === 0){
        tbody.innerHTML = `<tr><td colspan="4" style="opacity:.8">Belum ada akun tersimpan.</td></tr>`;
        return;
      }
      users.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(u.email)}</td>
          <td><span style="opacity:.9">${escapeHtml(u.password)}</span></td>
          <td>${escapeHtml(u.createdAt)}</td>
          <td style="text-align:right">
            <button class="row-btn del" data-index="${idx}">Hapus</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      // attach delete listeners
      tbody.querySelectorAll('.row-btn.del').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const i = parseInt(btn.getAttribute('data-index'));
          const users = readUsers();
          users.splice(i,1);
          writeUsers(users);
          showToast('🗑️ Akun dihapus');
          render();
        });
      });
    }
    render();

    // Clear all
    const clearAll = document.getElementById('clearAll');
    if(clearAll){
      clearAll.addEventListener('click', ()=>{
        if(!confirm('Hapus semua akun dari riwayat?')) return;
        localStorage.removeItem('nz_users');
        showToast('🗑️ Semua akun dihapus');
        setTimeout(()=> render(), 300);
      });
    }
  }

  // escape HTML
  function escapeHtml(text){
    if(!text) return '';
    return text
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'", '&#039;');
  }

})();
