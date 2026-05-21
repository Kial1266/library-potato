// Konfigurasi URL API Backend CodeIgniter 4 Anda
const BASE_URL_API = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Sistem Dashboard Diinisialisasi...");

  const sessionUser = localStorage.getItem("user_logged_in");

  // 1. PROTEKSI HALAMAN (LOGIN CHECK)
  if (!sessionUser) {
    alert("Akses ditolak! Silakan login terlebih dahulu.");
    // Arahkan ke halaman login di root folder (sesuaikan dengan struktur Anda)
    window.location.href = "../../Login/login.html";
    return;
  }

  const dataUser = JSON.parse(sessionUser);

  // Pastikan yang login adalah user biasa
  if (dataUser.role !== "user") {
    alert("Anda tidak memiliki akses ke halaman ini!");
    window.location.href = "../../Login/login.html";
    return;
  }

  // Tampilkan nama user yang sedang login
  const elNamaUser = document.getElementById("nama-user");
  if (elNamaUser) {
    elNamaUser.innerText = dataUser.username || "Member";
  }

  // Jalankan Animasi Alert Selamat Datang selama 5 detik
  const welcomeAlert = document.getElementById("welcome-alert");
  if (welcomeAlert) {
    welcomeAlert.style.display = "block";
    setTimeout(function () {
      welcomeAlert.classList.add("alert-fade-out");
      setTimeout(function () {
        welcomeAlert.style.display = "none";
      }, 500);
    }, 5000);
  }

  // 2. JALANKAN FUNGSI UTAMA
  muatDataBuku();

  // 3. LOGIKA FILTER/PENCARIAN BUKU KETIKA USER MENGETIK
  const inputSearch = document.getElementById("keyword");
  if (inputSearch) {
    inputSearch.addEventListener("input", function (e) {
      const kataKunci = e.target.value.toLowerCase();
      muatDataBuku(kataKunci);
    });
  }

  // 4. LOGIKA TOMBOL LOGOUT (Dipindah ke file HTML sesuai diskusi sebelumnya)
  // Tidak perlu ada di sini lagi karena sudah ada script logout di paling bawah file dashboard.html
});


// FUNGSI UTAMA UNTUK AMBIL DATA DARI API CI4
async function muatDataBuku(filterKataKunci = "") {
  console.log("1. Fungsi muatDataBuku mulai berjalan...");
  const wadahBuku = document.getElementById("wadah-buku");

  if (!wadahBuku) {
    console.error("CCTV ERROR: Elemen dengan id='wadah-buku' TIDAK DITEMUKAN di file HTML kamu!");
    return; 
  }

  try {
    console.log("2. Memanggil API Backend...");
    const respon = await fetch(`${BASE_URL_API}/buku`);
    const hasilJson = await respon.json(); 

    let listBuku = [];
    if (Array.isArray(hasilJson)) {
      listBuku = hasilJson; 
    } else if (hasilJson.data && Array.isArray(hasilJson.data)) {
      listBuku = hasilJson.data; 
    }

    if (respon.ok) {
      wadahBuku.innerHTML = ""; 

      // Filter Data Berdasarkan Kata Kunci
      const dataTerfilter = listBuku.filter(
        (buku) =>
          (buku.judul && buku.judul.toLowerCase().includes(filterKataKunci.toLowerCase())) ||
          (buku.kategori && buku.kategori.toLowerCase().includes(filterKataKunci.toLowerCase()))
      );

      if (dataTerfilter.length === 0) {
        wadahBuku.innerHTML = '<p class="text-muted text-center w-100 mt-4">Buku yang dicari tidak ditemukan atau data kosong.</p>';
        return;
      }

      dataTerfilter.forEach((item) => {
        // Disinkronkan dengan output format dari API /buku yang telah dibuat di Admin
        let kategoriBuku = item.kategori || "Kategori Tidak Diketahui";
        let judulAsli = item.judul || "Tanpa Judul";
        let arrayJudul = judulAsli.split(" ");
        let judulPendek = arrayJudul.length > 3 ? arrayJudul.slice(0, 3).join(" ") + "..." : judulAsli;

        let namaFileGambar = item.cover && item.cover !== 'default.jpg' ? item.cover : "default-book.png"; 
        
        // Sesuaikan folder path gambar dengan yang ada di API Anda (uploads/cover)
        let urlCover = namaFileGambar === "default-book.png" 
            ? `../../images/default-book.png` 
            : `http://localhost:8080/uploads/cover/${namaFileGambar}`;

        let judulAman = judulAsli.replace(/'/g, "\\'");

        // Gunakan struktur desain CSS Card yang sudah Anda buat
        let templateCard = `
            <div class="card m-2" style="width: 12rem; display: inline-block; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <img src="${urlCover}" 
                  class="card-img-top"
                  alt="${judulAsli}"
                  style="height: 250px; object-fit: cover;">
              <div class="card-body text-center d-flex flex-column justify-content-between p-2" style="height: 120px;">
                  <h6 style="font-weight:bold; color:black; font-size: 14px; margin-bottom: 5px;">
                      ${judulPendek}
                  </h6>
                  <small class="text-muted d-block mb-2">
                    <span style="color: blue; font-weight: 500; font-size: 12px;">${kategoriBuku}</span>
                  </small>
                  <button type="button"
                      class="btn btn-success btn-sm w-100 mt-auto"
                      data-bs-toggle="modal"
                      data-bs-target="#cek${item.id_buku}">
                      Cek Buku
                  </button>
              </div>
            </div>

            <div id="cek${item.id_buku}" class="modal fade" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-titlefw-bold text-success">Detail Buku</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-center">
                    <img src="${urlCover}" class="img-thumbnail mb-3" style="height: 260px; width: 180px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                    <h4 class="font-weight-bold text-dark mt-2 mb-3">${judulAsli}</h4>
                    
                    <div class="text-start px-4">
                        <p class="mb-1"><strong>Kategori:</strong> <span style="color: blue;">${kategoriBuku}</span></p>
                        <p class="mb-1"><strong>Pengarang:</strong> ${item.pengarang || 'N/A'}</p>
                        <p class="mb-1"><strong>Penerbit:</strong> ${item.penerbit || 'N/A'}</p>
                        <p class="mb-1"><strong>Tahun Terbit:</strong> ${item.thn_terbit || 'N/A'}</p>  
                    </div>
                  </div>
                  <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Tutup</button>
                    <button type="button" onclick="alihkanKePeminjaman('${judulAman}')" class="btn btn-success px-4" data-bs-dismiss="modal">
                      <i class="fas fa-bookmark me-1"></i> Pinjam Buku Ini
                    </button>
                  </div>
                </div>
              </div>
            </div>
        `;
        wadahBuku.innerHTML += templateCard;
      });

      console.log("5. Render buku ke HTML sukses!");
    } else {
      wadahBuku.innerHTML = '<p class="text-danger text-center w-100">Gagal mengambil data dari server API.</p>';
    }
  } catch (error) {
    console.error("CCTV ERROR KONEKSI/SINTAKS:", error);
    wadahBuku.innerHTML = '<p class="text-danger text-center w-100">Gagal memuat sistem. Pastikan backend API berjalan!</p>';
  }
}

function alihkanKePeminjaman(judulBuku) {
  const judulEncoded = encodeURIComponent(judulBuku);
  window.location.href = `daftar_pinjam.html?judul=${judulEncoded}&action=tambah`;
}