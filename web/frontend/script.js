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
function categoryData(category){
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


// Post data
// Tampilkan form
function showPostForm() {
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
        hidePostForm();
        renderTable(result); // tampilkan data terbaru
    })
    .catch(error => {
        console.error('Error posting data:', error);
        alert("Terjadi kesalahan saat menambahkan data.");
    });
}
// Post data N

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
            </tr>
    `;

  data.data.forEach((item) => {
    table += `
            <tr>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>${item.category}</td>
            </tr>
        `;
  });

  table += "</table>";
  document.getElementById("urah").innerHTML = table;
}
// Fungsi tambahan untuk membuat tabel HTML N

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
  const query = document.getElementById("searchInput").value; // ambil teks dari input

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
