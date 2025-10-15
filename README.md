# software http simple 
## set up
-unduh main.exe dari release
-buat folder baru lalu masukan main.exe ke dalam nya
-buat 2 folder di dalam folder itu dengan nama database dan frontend
-buat file index.html di folder front end
ket:
  anda bisa melihat contohnya di repositori ini
## cara membuild nya sendiri
unduh source code dari repositori ini 
pastikan anda memiliki compiler c++
pastikan anda sudah memasuki folder web
-untuk pengguna msvc ketik command berikut di developer command prompt
```cmd
cl main.cpp /EHsc
```
-untuk pengguna mingw ketik command berikut di cmd
```cmd
g++ main.cpp -o main.exe -lws2_32
```
kemudian anda bisa jalankan file executeable yg berhasil di build
