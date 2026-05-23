// assets/js/home.js

const API_URL = "http://localhost:8080/api";
let dataBukuGlobal = []; 

document.addEventListener('DOMContentLoaded', () => {
    loadBuku();
});

async function loadBuku() {
    const container = document.getElementById('booksContainer');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_URL}/buku`);
        const result = await response.json();
        
        // PENGECEKAN ARRAY agar data.forEach tidak error!
        let data = [];
        if (Array.isArray(result)) {
            data = result;
        } else if (result.data && Array.isArray(result.data)) {
            data = result.data;
        } else if (result.messages && Array.isArray(result.messages)) {
            data = result.messages; 
        }

        container.innerHTML = ''; 
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="text-center w-100 py-5">
                    <p style="color:#aaaaaa;">Data buku tidak ditemukan.</p>
                </div>`;
            return;
        }

        dataBukuGlobal = data;

        data.forEach(book => {
            // Ubah jalur fallback sesuai dengan yang sukses di buku.js
            const coverPath = book.cover ? `http://localhost/backend-fapus/public/imgDB/${book.cover}` : '../../images/a.png';
            
            const cardHTML = `
                <div class="card" style="width: 160px; cursor: pointer; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onclick="bukaModalDetail('${book.id_buku}')">
                    <img src="${coverPath}" 
                         class="card-img-top" 
                         alt="Cover Buku" 
                         style="height: 220px; object-fit: cover;"
                         onerror="this.onerror=null; this.src='../../images/a.png'"> 
                         <div class="card-body p-3">
                        <h6 class="card-title text-truncate fw-bold text-dark m-0" title="${book.judul}">${book.judul}</h6>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item text-muted border-top-0 pt-0 pb-3" style="font-size: 13px;">${book.kategori}</li>
                    </ul>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `
            <div class="text-center w-100 py-5">
                <p style="color:#ff6b6b;">Gagal memuat data buku dari server.</p>
            </div>`;
    }
}

function bukaModalDetail(idBuku) {
    const book = dataBukuGlobal.find(b => b.id_buku == idBuku);
    
    if (book) {
        // Sesuaikan path fallback-nya juga di sini
        const coverPath = book.cover ? `http://localhost/backend-fapus/public/imgDB/${book.cover}` : '../../images/a.png';
        
        document.getElementById('detailCover').src = coverPath;
        
        // Tambahkan this.onerror=null juga di sini
        document.getElementById('detailCover').onerror = function() { 
            this.onerror = null; 
            this.src = '../../images/a.png'; 
        };
        
        document.getElementById('detailJudul').innerText = `: ${book.judul}`;
        document.getElementById('detailKategori').innerText = `: ${book.kategori}`;
        document.getElementById('detailPengarang').innerText = `: ${book.pengarang}`;
        document.getElementById('detailPenerbit').innerText = `: ${book.penerbit}`;
        document.getElementById('detailTahun').innerText = `: ${book.thn_terbit}`;
        document.getElementById('detailHalaman').innerText = `: ${book.jml_halaman}`;
        document.getElementById('detailDeskripsi').innerText = `: ${book.deskripsi}`;

        const modalEl = document.getElementById('modalDetailBuku');
        const detailModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        detailModal.show();
    }
}