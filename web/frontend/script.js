// Jalankan pencarian ketika user tekan Enter di search bar
document.addEventListener("DOMContentLoaded", () => {
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

// Fungsi tambahan untuk membuat tabel HTML
function renderTable(data) {
  if (!data || !data.data) {
    document.getElementById("urah").innerText = "Tidak ada data ditemukan.";
    return;
  }

  let table = `
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Actions</th>
            </tr>
    `;

  data.data.forEach((item) => {
    table += `
            <tr>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>${item.category}</td>
                <td>
                    <button onclick='editItem(${JSON.stringify(item)})'>Edit</button>
                    <button onclick='deleteItem(${JSON.stringify(item.title)})'>Delete</button>
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
    if (catEl) catEl.value = "basic"; // set default category jika ingin

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

        hidePostForm();
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
//form edit data N

// 🔥 Delete data QQQQQ
function deleteItem(title) {
  if (!confirm(`Hapus item "${title}"?`)) return;

  fetch(encodeURIComponent(`delete/${title}`), {
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
        fetchData(); // Refresh tabel
    })
    .catch(err => {
        console.error('Gagal menghapus:', err);
        alert('Gagal menghapus item. Cek console untuk detail.');
    });
}
// Delete data N

// 🔒 Escape untuk keamanan (mencegah XSS)QQQQQ
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, function(m){ return map[m]; });
}
// 🔒 Escape untuk keamanan (mencegah XSS) N

//fetchData baru
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
//fetchData baru N

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

//searchData baru
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
//searchData baru N

function postData() {
  const data = {
    title: "pantea",
    description: "Description for item pantea",
    category: "basic",
  }; // Ganti dengan data yang ingin dikirim
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
      // Lakukan sesuatu dengan data yang diterima
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
}
function putData() {
  const data = {
    title: "pantea",
    description: "Updated description for item pantea",
    category: "basic",
  };
  fetch("/update/pantea", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
      // Lakukan sesuatu dengan data yang diterima
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
}
function deleteData() {
  fetch("/delete/pantea", {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
      // Lakukan sesuatu dengan data yang diterima
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
}
