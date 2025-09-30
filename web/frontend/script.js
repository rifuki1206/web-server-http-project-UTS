// Jalankan pencarian ketika user tekan Enter di search bar
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                searchData();
            }
        });
    }
});
// Jalankan pencarian ketika user tekan Enter di search bar N

// Toggle hamburger menu
function toggleMenu() {
    document.getElementById("navbarMenu").classList.toggle("show");
}

// Fungsi kategori
function categoryData(category) {
  hidePostForm();
  hideEditForm();
  const menu = document.getElementById("navbarMenu");
    if (menu && menu.classList.contains("show")) menu.classList.remove("show");
    fetch(`/?tag=${category}`)
        .then(response => response.json())
        .then(data => {
            renderTable(data); // tampilkan hasil dalam tabel
        })
        .catch(error => {
            console.error('Error fetching category data:', error);
            document.getElementById("urah").innerText = "Gagal memuat data kategori.";
        });
}
// Toggle hamburger menu N

// Tutup panel ketika klik di luar
document.addEventListener('click', function(event) {
    const menu = document.getElementById("navbarMenu");
    const hamburger = document.querySelector('.hamburger');
    if (!menu || !hamburger) return;

    if (menu.classList.contains('show')) {
        // jika klik bukan di menu dan bukan di hamburger maka tutup
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            menu.classList.remove('show');
        }
    }
});
// Tutup panel ketika klik di luar

// mapping kategori (teks) ke nama class CSS badge
const CATEGORY_CLASS_MAP = {
  "Algoritma dan Pemrograman": "category-algoritma",
  "Pendidikan Agama": "category-pendidikan-agama",
  "Bahasa Pemrograman I": "category-bahasa-1",
  "Sistem Digital": "category-sistem-digital",
  "Matematika Diskrit": "category-matematika-diskrit",
  "Teknologi dan Transformasi Digital": "category-teknologi-transformasi",
  "Kalkulus": "category-kalkulus",
  "Dasar Dasar Pemrograman": "category-dasar-pemrograman"
};

// Toggle Light/Dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const switchModeBtn = document.getElementById("switchMode");
  if (switchModeBtn) {
    switchModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
    });
  }
});


// Fungsi tambahan untuk membuat tabel HTML
function renderTable(data) {
  if (!data || !data.data) {
    document.getElementById("urah").innerText = "Tidak ada data ditemukan.";
    return;
  }

  let table = `
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>TITLE</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
            </tr>
    `;

  data.data.forEach((item) => {
    const badgeClass = CATEGORY_CLASS_MAP[item.category] || 'category-generic';
    table += `
          <tr>
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td><span class="category-badge ${badgeClass}">${item.category}</span></td>
            <td>
              <button class="action-btn action-edit" onclick='editItem(${JSON.stringify(item)})'><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="action-btn action-delete" onclick='deleteItem(${JSON.stringify(item.title)})'><i class="fa-regular fa-trash-can"></i></button>
            </td>
          </tr>
        `;
  });

  table += "</table>";
  document.getElementById("urah").innerHTML = table;
}
// Fungsi tambahan untuk membuat tabel HTML N

// Post data
// Tampilkan form
function showPostForm() {
  hideEditForm();

    const titleEl = document.getElementById("postTitle");
    const descEl = document.getElementById("postDescription");
    const catEl = document.getElementById("postCategory");

    if (titleEl) titleEl.value = "";
    if (descEl) descEl.value = "";
    if (catEl) catEl.selectedIndex = 0; // pilih opsi pertama

    // if (catEl) catEl.value = "basic"; // set default category jika ingin

    document.getElementById("postForm").style.display = "block";
}

// Sembunyikan form
function hidePostForm() {
    document.getElementById("postForm").style.display = "none";
}

// Kirim data ke server
function submitPost() {
    const title = document.getElementById("postTitle").value;
    const description = document.getElementById("postDescription").value;
    const category = document.getElementById("postCategory").value;

    if (!title || !description || !category) {
        alert("Semua field harus diisi!");
        return;
    }

    const data = {
        title: title,
        description: description,
        category: category
    };

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert("Data berhasil ditambahkan!");

        // reset field setelah sukses
      const titleEl = document.getElementById("postTitle");
      const descEl = document.getElementById("postDescription");
      const catEl = document.getElementById("postCategory");

      if (titleEl) titleEl.value = "";
      if (descEl) descEl.value = "";
      if (catEl) catEl.value = "basic";
      // if (catEl) catEl.value = "basic";

        hidePostForm();
        fetchData();
        renderTable(result); // tampilkan data terbaru
    })
    .catch(error => {
        console.error('Error posting data:', error);
        alert("Terjadi kesalahan saat menambahkan data.");
    });
}
// Post data N

// 🔄 form edit data
function editItem(item) {
  hidePostForm();
  // tutup panel kategori agar UI bersih
    const menu = document.getElementById("navbarMenu");
    if (menu && menu.classList.contains("show")) menu.classList.remove("show");
    document.getElementById("editForm").style.display = "block";
    document.getElementById("editTitle").value = item.title;
    document.getElementById("editDescription").value = item.description;
    document.getElementById("editCategory").value = item.category;
    // simpan judul lama untuk request PUT
    document.getElementById("editForm").dataset.originalTitle = item.title;
}

function hideEditForm() {
  document.getElementById("editForm").style.display = "none";
}

// 🔄 Kirim update ke server
function submitEdit() {
  const originalTitle = document.getElementById("editForm").dataset.originalTitle;
  const newTitle = document.getElementById("editTitle").value;
  const newDescription = document.getElementById("editDescription").value;
  const newCategory = document.getElementById("editCategory").value;

  if (!newTitle || !newDescription || !newCategory) {
    alert("Semua field harus diisi!");
    return;
  }

  const updatedData = {
    title: newTitle,
    description: newDescription,
    category: newCategory
  };

  fetch(`/update/${encodeURIComponent(originalTitle)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
  .then(res => {
    if (!res.ok) throw new Error("Update gagal");
    return res.json();
  })
  .then(() => {
    alert("Data berhasil diubah!");
    hideEditForm();
    fetchData(); // refresh tabel
  })
  .catch(err => {
    console.error(err);
    alert("Terjadi kesalahan saat mengubah data.");
  });
}
//🔄form edit data N

// Delete data
let itemToDelete = null;

function deleteItem(title) {
  itemToDelete = title;
  const modal = document.getElementById("deleteModal");
  const message = document.getElementById("deleteMessage");

  // Update teks modal dengan judul item
  message.innerHTML = `
    Apakah anda yakin ingin menghapus data <strong>"${title}"</strong>? 
    <br><strong>Data yang dihapus tidak bisa dipulihkan!</strong>
  `;

  modal.classList.add("show");
}


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");

  confirmBtn.addEventListener("click", () => {
    if (itemToDelete) {
      // pindahkan logika fetch delete lama ke sini
      fetch(encodeURIComponent(`delete/${itemToDelete}`), {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Server error ' + response.status);
          }
          return response.json();
        })
        .then(result => {
          if (result.message) {
            alert(result.message);
          } else {
            alert('Item berhasil dihapus');
          }
          fetchData(); // refresh tabel
        })
        .catch(err => {
          console.error('Gagal menghapus:', err);
          alert('Gagal menghapus item. Cek console untuk detail.');
        });
    }

    itemToDelete = null;              // reset judul
    modal.classList.remove("show");   // tutup modal
  });

  cancelBtn.addEventListener("click", () => {
    itemToDelete = null;
    modal.classList.remove("show");   // tutup modal tanpa hapus
  });
});


// function deleteItem(title) {
//   if (!confirm(`Hapus item "${title}"?`)) return;

//   fetch(encodeURIComponent(`delete/${title}`), {
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Server error ' + response.status);
//         }
//         return response.json();
//     })
//     .then(result => {
//         if (result.message) {
//             alert(result.message);
//         } else {
//             alert('Item berhasil dihapus');
//         }
//         fetchData(); // Refresh tabel
//     })
//     .catch(err => {
//         console.error('Gagal menghapus:', err);
//         alert('Gagal menghapus item. Cek console untuk detail.');
//     });
// }
// Delete data N

// 🔒 Escape untuk keamanan (mencegah XSS)QQQQQ
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, function(m){ return map[m]; });
}
// 🔒 Escape untuk keamanan (mencegah XSS) N

//fetchData
function fetchData() {
  fetch("/?")
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
//fetchData  N

function fetchtest() {
  fetch("/?tag=basic&?search=a")
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
      // Lakukan sesuatu dengan data yang diterima
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//searchData
function searchData() {
  hidePostForm();
  hideEditForm();
  
  const query = document.getElementById("searchInput").value.toLowerCase(); // BARUBARUBARU ambil teks dari input

  if (!query) {
    alert("Silakan ketik kata kunci terlebih dahulu!");
    return;
  }

  fetch(`/?search=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      renderTable(data); // ✅ gunakan tabel, bukan innerText
    })
    .catch((error) => {
      console.error("Error searching data:", error);
      document.getElementById("urah").innerText =
        "Terjadi kesalahan saat mencari data.";
    });
}
//searchData N
