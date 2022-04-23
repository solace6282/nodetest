# Run App
Install node dan jalankan ```node index.js``` di terminal, API ada pada localhost:3000/api/users/xxx dengan 'xxx' nama API (ex. localhost:3000/api/users/jobdetail)

# Node.js Backend Developer Test
## Login API
API Login ada di file routes/api/users.js route /login.<br>
DBMS menggunakan remotemysql.com (remotemysql punya limitasi melakukan putus koneksi jika tidak ada request dalam beberapa saat sehingga harus memulai server lagi jika terputus)

Login dapat dilakukan di https://webphpmyadmin.com/index.php dengan detail pada routes/api/users.js di const db

Implementasi JWT ada pada /login dengan JWT sign dan verifikasi ada pada fungsi verifyJWT

## Job List API
API Job List ada di file routes/api/users.js route /joblist.

API diimplementasi dengan asumsi default full_time adalah false.

Parameter api diletakkan dalam body. Contoh body:
```
{
    "description":"",
    "location":"",
    "full_time":"false",
    "page":"2"
}
```
JWT diperiksa dengan verifyJWT
## Job Detail API
API Job List ada di file routes/api/users.js route /jobdetail.

API diimplementasi dengan asumsi id pasti diberikan

Parameter api diletakkan dalam body. Contoh body:
```
{
    "id":"2e99bd71-9684-4182-bd59-28a634ec9dd7"
}
```
JWT diperiksa dengan verifyJWT

