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

// alert modal
function showAlertModal(message) {
  const alertModal = document.getElementById("alertModal");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message; 
  alertModal.style.display = "block";

  document.getElementById("closeAlertBtn").onclick = function () {
    alertModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === alertModal) {
      alertModal.style.display = "none";
    }
  };
}

// Delete data
let itemToDelete = null;

function deleteItem(title) {
  itemToDelete = title;
  const modal = document.getElementById("deleteModal");
  const message = document.getElementById("deleteMessage");

  // Update teks modal dengan judul item
  message.innerHTML = `
    Apakah anda yakin ingin menghapus item ini?
    <br>Item yang dihapus tidak bisa dipulihkan!
    <br><div class="delete-title">${title}</div>
  `;

  modal.classList.add("show");
}


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const closeBtn = document.getElementById("xMark");
  const cancelBtn = document.getElementById("cancelDeleteBtn");

  confirmBtn.addEventListener("click", () => {
    if (itemToDelete) {
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

  closeBtn.addEventListener("click", () => {
    itemToDelete = null;
    modal.classList.remove("show");   // tutup modal tanpa hapus
  });

  cancelBtn.addEventListener("click", () => {
    itemToDelete = null;
    modal.classList.remove("show");   // tutup modal tanpa hapus
  });
});
// Delete data N

// Search if enter and switch mode
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    const searchInput = document.getElementById("searchInput");
    const switchModeBtn = document.getElementById("switchMode");
    if (searchInput) {
        searchInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                searchData();
            }
        });
    }
    if (switchModeBtn) {
      switchModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
      });
    }
});
//  Search if enter and switch modeN

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

// Fungsi untuk membuat tabel HTML
function renderTable(data) {
  if (!data || !data.data) {
    document.getElementById("urah").innerText = "Tidak ada data ditemukan, klik tombol + untuk menambahkan data.";
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
// Fungsi untuk membuat tabel HTML N


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
// Tutup panel ketika klik di luar N

//searchData
function searchData() {
  hidePostForm();
  hideEditForm();
  
  const query = document.getElementById("searchInput").value.toLowerCase(); // BARUBARUBARU ambil teks dari input

  if (!query) {
    showAlertModal("Silakan ketik kata kunci terlebih dahulu!");
    return;
  }

  fetch(`/?search=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      renderTable(data); 
    })
    .catch((error) => {
      console.error("Error searching data:", error);
      document.getElementById("urah").innerText =
        "Terjadi kesalahan saat mencari data.";
    });
}
//searchData N

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

  document.getElementById("postForm").style.display = "block";
    //Scroll ke form
  document.getElementById("postForm").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
    window.scrollBy(0, -200); // ubah sesuai tinggi topbar (misal 70–100)
  }, 480);
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
        showAlertModal("Semua bagian harus diisi!");
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
    .then(() => {
        showAlertModal("data berhasil ditambahkan!");

      // reset field setelah sukses
      const titleEl = document.getElementById("postTitle");
      const descEl = document.getElementById("postDescription");
      const catEl = document.getElementById("postCategory");

      if (titleEl) titleEl.value = "";
      if (descEl) descEl.value = "";
      if (catEl) catEl.selectedIndex = 0;

        hidePostForm();
        fetchData();
    })
    .catch(error => {
        console.error('Error posting data:', error);
        alert("Terjadi kesalahan saat menambahkan data.");
    });
}
// Post data N

//edit data
function editItem(item) {
  hidePostForm();
    const menu = document.getElementById("navbarMenu");
    if (menu && menu.classList.contains("show")) menu.classList.remove("show");
    document.getElementById("editForm").style.display = "block";
    document.getElementById("editTitle").value = item.title;
    document.getElementById("editDescription").value = item.description;
    document.getElementById("editCategory").value = item.category;
    document.getElementById("editForm").dataset.originalTitle = item.title;
      //Scroll ke form
    document.getElementById("editForm").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
      window.scrollBy(0, -200); // ubah sesuai tinggi topbar (misal 70–100)
    }, 480);
  }

function hideEditForm() {
  document.getElementById("editForm").style.display = "none";
}

//Kirim update ke server
function submitEdit() {
  const originalTitle = document.getElementById("editForm").dataset.originalTitle;
  const newTitle = document.getElementById("editTitle").value;
  const newDescription = document.getElementById("editDescription").value;
  const newCategory = document.getElementById("editCategory").value;

  if (!newTitle || !newDescription || !newCategory) {
    showAlertModal("Semua bagian harus diisi!");
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
    showAlertModal("data berhasil diubah!");
    hideEditForm();
    fetchData(); // refresh tabel
  })
  .catch(err => {
    console.error(err);
    alert("Terjadi kesalahan saat mengubah data.");
  });
}
//edit data N





