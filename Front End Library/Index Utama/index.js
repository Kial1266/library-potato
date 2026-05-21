// assets/js/home.js

const API_URL = "http://localhost:8080/api";
let dataBukuGlobal = []; 

document.addEventListener('DOMContentLoaded', () => {
    loadBuku();
});

async function loadBuku() {
    const container = document.getElementById('booksContainer');
    
    try {
        const response = await fetch(`${API_URL}/buku`);
        const data = await response.json();
        
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
            const coverPath = book.cover ? `http://localhost/backend-fapus/public/imgDB/${book.cover}` : '/images/a.png';
            
            const cardHTML = `
                <div class="card" style="width: 160px;" onclick="bukaModalDetail(${book.id_buku})">
                    <img src="${coverPath}" 
                         class="card-img-top" 
                         alt="Cover Buku" 
                         onerror="this.src='/images/a.png'">
                    <div class="card-body">
                        <h6 class="card-title">${book.judul}</h6>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${book.kategori}</li>
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
        const coverPath = book.cover ? `http://localhost/backend-fapus/public/imgDB/${book.cover}` : '/images/a.png';
        
        document.getElementById('detailCover').src = coverPath;
        document.getElementById('detailCover').onerror = function() { this.src = '/images/a.png'; };
        
        document.getElementById('detailJudul').innerText = `: ${book.judul}`;
        document.getElementById('detailKategori').innerText = `: ${book.kategori}`;
        document.getElementById('detailPengarang').innerText = `: ${book.pengarang}`;
        document.getElementById('detailPenerbit').innerText = `: ${book.penerbit}`;
        document.getElementById('detailTahun').innerText = `: ${book.thn_terbit}`;
        document.getElementById('detailHalaman').innerText = `: ${book.jml_halaman}`;
        document.getElementById('detailDeskripsi').innerText = `: ${book.deskripsi}`;

        const detailModal = new bootstrap.Modal(document.getElementById('modalDetailBuku'));
        detailModal.show();
    }
}