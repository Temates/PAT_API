var express = require('express');
var fs = require("fs");
var app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { checkSchema } = require('express-validator');
var datetime = new Date();



app.use(express.static('public'));
app.use(bodyParser.json());
const conn = mysql.createConnection({
    
    host: 'localhost',
    user: 'mext',
    password: 'nando2001',
    database: 'PAT',
    dateStrings: true
});

conn.connect((err)=>{
    if (err) throw err;    
    
    console.log('Mysql Connected...');  
        
});

app.get('/',function(req,res){//Blunder~
    console.log("Got a GET request");
    res.send('Selamat datang di Express framework --> GET');
});
//Area Android. untuk bagian search data digunakan universal
app.post('/login_android',(req,res)=>{   //Login + menambahkan user lewat android
    console.log("Login Android"); 
    let username = {Username: req.body.Username};
    let email = {Email: req.body.Email};
    let obj = {};
    obj.Username = username.Username;
    obj.Email = email.Email;
    console.log("Got a Post request data="+JSON.stringify(obj));
    let sql_check = "SELECT * FROM akun WHERE Email = ?";
    let query_check = conn.query(sql_check,email.Email,(err,result)=>{
        if (err) throw err;
            if (result != ''){          
                var id = {};   
                Object.values(result).forEach(function(key) {
                    //id = result[key];
                    console.log(key);                    
                    res.send(''+key.id_akun);
                    
                    });     
                                       
                
                console.log("Login Sukses");                    
            }else{
                let sql_insert = "INSERT INTO akun SET ?";
                let query_insert = conn.query(sql_insert,obj,(err,result)=>{
                    if (err) throw err;
                    //res.send("Berhasil Mendaftarkan Akun!");
                    console.log("Berhasil Mendaftarkan Akun!");
                });
                let sql_check = "SELECT * FROM akun WHERE Email = ?";
                let query_check = conn.query(sql_check,email.Email,(err,result)=>{
                    if (err) throw err;                                 
                            var id = {};   
                            Object.values(result).forEach(function(key) {
                                //id = result[key];
                                console.log(key);                    
                                res.send(''+key.id_akun);                                
                                });                                                        
                            });                     
            }        
    });
    console.log("--------------------------------------------------------------------------------");
});

// app.post('/postattend/checkin',(req,res)=>{   //menambahkan absensi dan cek
//     console.log("Absen Check in Android");
//     let check_date = "SELECT CURRENT_DATE";//ngambil tanggal buat dibandingkan
//             let query_date = conn.query(check_date,(err,result)=>{
//             if (err) throw err;
//             var date;
//             date = result;            
//         });
         
//         let email = {Email: req.body.Email};
//         let sql_check = "SELECT id_akun FROM akun WHERE Email = ?";//ambil id
//         let query_check = conn.query(sql_check,email.Email,(err,result)=>{
//             if (err) throw err;         
//             let id_akun = result;          
//             let sql_get = "SELECT id_akun FROM checkin WHERE Date = "+"'"+date+"'"+" and id_akun = ?";//ambil id buat di cek dengan id awal
//             let query_get = conn.query(sql_get,id_akun,(err,result)=>{
//                 if (err) throw err;                                     
//                         if(JSON.stringify(id_akun) == JSON.stringify(result) ){//id sama
//                             res.send("Sudah Absensi !");
//                             console.log("Sudah Absensi !");                            
//                        }
//                         else {//id tidak sama
//                             let sql_insert = "INSERT INTO checkin SET ?";// insert absensi
//                             let query_insert = conn.query(sql_insert,id_akun,(err,result)=>{
//                             if (err) throw err;
//                                 res.send("Absensi Berhasil!");
//                                 console.log("Absensi Berhasil!");
//                             });                              
//                          }
//                  });                                     
//             });                     
//     console.log("--------------------------------------------------------------------------------");
//     });

app.post('/postattend',(req,res)=>{   //menambahkan absensi di check in atau checkout
        console.log("Absen Check Out Android");        
        let check = {check: req.body.check};
        let email = {Email: req.body.Email};
        let check_date = "SELECT CURRENT_DATE";//ngambil tanggal buat dibandingkan
        let query_date = conn.query(check_date,(err,result)=>{
            if (err) throw err;  
            let data;          
            let date={Date:{}};            
            Object.values(result).map(function(key) {                
                date.Date = key.CURRENT_DATE;
                });            
            let sql_check = "SELECT id_akun FROM akun WHERE Email = ?";//ambil id
            let query_check = conn.query(sql_check,email.Email,(err,result)=>{
                if (err) throw err;
                let id_akun = {};
                Object.values(result).map(function(key) {                
                    id_akun.id_akun = key.id_akun;                    
                    });              
                let sql_get = "SELECT id_akun FROM "+check.check+" WHERE Date = "+"'"+date.Date+"'"+" and ?";//ambil id buat di cek dengan id awal
                let query_get = conn.query(sql_get,id_akun,(err,result)=>{
                    if (err) throw err;
                    let data = {};
                    Object.values(result).map(function(key) {                
                        data.id_akun = key.id_akun;                    
                        });                    
                            if(JSON.stringify(id_akun) == JSON.stringify(data) ){//id sama
                                res.send("Sudah Absensi !");
                                console.log("Sudah Absensi !");
                                console.log("--------------------------------------------------------------------------------");                            
                        }
                            else {//id tidak sama
                                let sql_insert = "INSERT INTO "+check.check+" SET ?";// insert absensi                            
                                let query_insert = conn.query(sql_insert,id_akun,(err,result)=>{                                   
                                if (err) throw err;
                                    res.send("Absensi Berhasil!");
                                    console.log("Absensi Berhasil!");
                                    console.log("--------------------------------------------------------------------------------");
                                });                              
                            }
                    });                                     
            });   
                       
        });
                           
        
        });    
 
app.get('/list_user/:id',function(req,res){ //menampilkan data dari attendance dan salary
    console.log("menampilkan data check in dan check out");
    var data = {
        checkin:[{

        }],
        checkout:[{

        }]
    };
    let sql = "SELECT * FROM checkin WHERE id_akun="+req.params.id;    
    let query = conn.query(sql,(err,result)=>{
        if (err) throw err;        
        data.checkin = result;
            let sql1 = "SELECT * FROM checkout WHERE id_akun="+req.params.id;    
            let query1 = conn.query(sql1,(err,result)=>{
                if (err) throw err;                
                data.checkout = result;
                res.send(data);
                //console.log(data);                           
            });            
    }); 
    console.log("--------------------------------------------------------------------------------");       
});

// Batas kode Android
// Selanjutnya Kode Desktop

app.get('/Table',(req,res)=>{   //menampilkan semua user
    console.log("menampilakan isi table akun");
    let sql = "SELECT * FROM akun";
    let query = conn.query(sql,(err,result)=>{
        if (err) throw err;
        res.send(result)
    });
    console.log("--------------------------------------------------------------------------------");
});

app.post('/insert_akun',(req,res)=>{   //menambahkan user
    console.log("menambahkan user ke table akun");
    let username = {Username: req.body.Username};
    let email= {Email: req.body.Email};
    let section = {Section :req.body.Section};
    let data = {};
    if(req.body.Section === Object && Object.keys(req.body).length === 0){
        data.Username = username.Username;
        data.Email = email.Email;
    }else{
        data.Username = username.Username;
        data.Email = email.Email;
        data.Section = section.Section;
    }
    let sql = "INSERT INTO akun SET ?";
    let query = conn.query(sql,data,(err,result)=>{
        if (err) throw err;
        console.log(result);
        res.send("Berhasil Menambahkan!");
    });
    console.log("--------------------------------------------------------------------------------");
});

app.post('/search_user',function(req,res){//searching user
    console.log("search user!");
    let id = {id_akun: req.body.id_akun};
    console.log("mencari user dari table akun id=" + id);
    let sql = "SELECT * FROM akun WHERE ?";
    let query = conn.query(sql,id,(err,result)=>{
        if (err) throw err;
        console.log(result);
        res.send(result);
        
    });
    console.log("--------------------------------------------------------------------------------");
});

app.post('/update_akun',(req,res)=>{   //edit user
    console.log("Update akun!");
    let id = {id_akun: req.body.id_akun};
    let username = {Username: req.body.Username};
    let email= {Email: req.body.Email};
    let section = {Section :req.body.Section};
    let data = {};
    console.log("update user dari table akun id=" + id.id_akun);
    if(req.body.Section === Object && Object.keys(req.body).length === 0){
        data.Username = username.Username;
        data.Email = email.Email;
        let sql = "UPDATE akun SET ? WHERE id_akun = "+"'"+id.id_akun+"'";
        let query = conn.query(sql,data,(err,result)=>{
        console.log(query);
        if (err) throw err;
        console.log(result);
        res.send("Update Data Berhasil!");
    });
    }else{
        data.Username = username.Username;
        data.Email = email.Email;
        data.Section = section.Section;
        let sql = "UPDATE akun SET ? WHERE id_akun = "+"'"+id.id_akun+"'";
        let query = conn.query(sql,data,(err,result)=>{
        if (err) throw err;
        
        console.log(result);
        res.send("Update Data Berhasil!");
    }
    
    );
    }
    console.log("--------------------------------------------------------------------------------");
});

app.post('/login',function(req,res){    //login desktop
    console.log("Got a POST request");
        // let data = {Username: req.body.nama, Password : req.body.pass};
        // console.log("Got a Post request data="+JSON.stringify(data));
        let username = {Username: req.body.username};        
        console.log("Got a Post request data="+JSON.stringify(username.Username));
        let password = {Password: req.body.password};
        console.log("Got a Post request data="+JSON.stringify(password.Password));
        let sql = "SELECT * FROM user WHERE Username = ?";
        //let sql = "SELECT Password FROM user WHERE Username = 'Nando'";
        let query = conn.query(sql,username.Username,(err,result)=>{
            console.log(JSON.stringify(
                {"status" : 200, "error" : null, "response" : result}
                ));
            if (err) throw err;
                if (result != ''){                    
                    Object.keys(result).forEach(function(key) {
                        var psw = result[key];
                        console.log(psw.Password)
                        if (password.Password == psw.Password ){
                            res.send("Login Sukses");
                            console.log("Login Sukses");
                        }else {
                            res.send("Login Gagal");
                            console.log("Login Gagal");
                        }    
                        });
                }else{
                    res.send("Login Gagal");
                            console.log("Login Gagal");
                }
        });
        console.log("--------------------------------------------------------------------------------");
});

app.delete('/delete_user',function(req,res){
    console.log("Delete User dari table akun");
    let id = {id_akun: req.body.id_akun};
    
    let sql = "DELETE FROM akun WHERE id_akun ="+"'"+id.id_akun+"'";
    let query = conn.query(sql,(err,result)=>{
        if (err) throw err;
        console.log(result);
        console.log("Delete Berhasil");
        res.send("Delete Berhasil");        
    });
    console.log("--------------------------------------------------------------------------------");
});

app.get('/postsalary/:id',(req,res)=>{   //menambahkan absensi dan cek
    console.log("Menambahkan absensi!");
    
    let sql = "INSERT INTO salary SET id_akun="+req.params.id;         
    let query = conn.query(sql,(err,result)=>{
        if (err) throw err;          
        res.send("Berhasil Menambahkan Data Salary!");
        console.log("Berhasil Menambahkan Data Salary!");          
    });
    console.log("--------------------------------------------------------------------------------"); 
});    
app.get('/list/:id',function(req,res){ //menampilkan data dari attendance dan salary
    console.log("menampilkan data check in dan check out");
    var data = {
        checkin:[{

        }],
        checkout:[{

        }]
    };
    let sql = "SELECT * FROM checkin WHERE id_akun="+req.params.id;    
    let query = conn.query(sql,(err,result)=>{
        if (err) throw err;        
        data.checkin = result;
            let sql1 = "SELECT * FROM checkout WHERE id_akun="+req.params.id;    
            let query1 = conn.query(sql1,(err,result)=>{
                if (err) throw err;                
                data.checkout = result;
                res.send(data);
                //console.log(data);                           
            });            
    }); 
    console.log("--------------------------------------------------------------------------------");       
});     

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Express app listening at http://%s:%s",host,port);
});