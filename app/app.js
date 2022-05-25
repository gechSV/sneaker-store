const express = require('express');
const { render, redirect } = require('express/lib/response');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');// алгоритм хеширования 
const crypto = require('crypto');
const saltCookie = 10;//соль для создания хеш ключей куки
const cookieParser = require('cookie-parser');
//подключаем mysql модуль 
const mysql = require('mysql');
const Pool = require('mysql/lib/Pool');
const { json } = require('body-parser');
const { promise } = require('bcrypt/promises');
//настраиваем модуль 
const con = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "root",
    database: 'market'
});

app.use(cookieParser());
//public - имя папки, где хранится статика
app.use(express.static('public'));
app.use(express.urlencoded());
//задаём шаблонизатор
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//говорим серверу слушать 8000 порт
app.listen(8000, function () {
    console.log('node express work on 8000');
});


//функция генерации токена входа 
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

let cookieToken = generateAuthToken();

//хранение состояния авторизации


app.get('/', function (req, res) {
    if (req.cookies.U1 == null) {
        res.cookie('U1', cookieToken, { maxAge: 600000000 });
        console.log('Присвоение нового значения куки:' + cookieToken);
    }
    else {
        console.log('Текущее значение куки:' + req.cookies.U1);
    }
//======получаем куки файлы от браузера
    let cookTok = req.cookies.U1;
    console.log('Токен:' + cookTok);
    let cookMail = req.cookies.mail;
    console.log('Почта:' + cookMail);

//======Проверяем авторизован ли пользователь(Запрос в бд)
    let checkAuthorization = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and cookie = ?)  AS flag',
        [cookMail, cookTok], function (err, result) {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });

    Promise.all([checkAuthorization]).then(function (value) {
        if (value[0][0].flag > 0){
            let goodsPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goods",
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });

            let userData = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT id, email, name, secondName FROM market.users where email = ?",
                    [cookMail], function (err, result) {
                        if (err) reject(err);
                        console.log(result);
                        resolve(result);
                    }
                );
            });
        
            Promise.all([goodsPromise, userData]).then(function (value) {
                res.render('main.pug', {
                    goods: JSON.parse(JSON.stringify(value[0])),
                    user: JSON.parse(JSON.stringify(value[1])),
                    authorized: true
                });
                //console.log(JSON.parse(JSON.stringify(value)));
                console.log('load /');
            });
        }
        else
        {
            let goodsPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goods",
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        
            Promise.all([goodsPromise]).then(function (value) {
                res.render('main.pug', {
                    goods: JSON.parse(JSON.stringify(value[0])),
                    authorized: false
                });
                //console.log(JSON.parse(JSON.stringify(value)));
                console.log('load /');
            });
        } 
    });
});

app.get('/goods', function (req, res) {
    if (req.cookies.U1 == null) {
        res.cookie('U1', cookieToken, { maxAge: 600000000 });
        console.log('Присвоение нового значения куки:' + cookieToken);
    }
    else {
        console.log('Текущее значение куки:' + req.cookies.U1);
    }
//======получаем куки файлы от браузера
    let cookTok = req.cookies.U1;
    console.log('Токен:' + cookTok);
    let cookMail = req.cookies.mail;
    console.log('Почта:' + cookMail);

//======Проверяем авторизован ли пользователь(Запрос в бд)
    let checkAuthorization = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and cookie = ?)  AS flag',
        [cookMail, cookTok], function (err, result) {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });


    Promise.all([checkAuthorization]).then(function (value) {
        if (value[0][0].flag > 0){
            let goodsPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goods WHERE id =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        
            let PhotoPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goodsphoto WHERE id =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });

            let goodsSize = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM market.goodssize where idGoods =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        
            Promise.all([goodsPromise, PhotoPromise, goodsSize]).then(function (value) {
                res.render('goods.pug', {
                    item: JSON.parse(JSON.stringify(value[0])),
                    photo: JSON.parse(JSON.stringify(value[1])),
                    size: JSON.parse(JSON.stringify(value[2])),
                    authorized: true
                });
                //console.log(JSON.parse(JSON.stringify(value)));
                console.log('load /goods?id=' + req.query.id);
            })
        } 
        else 
        {
            let goodsPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goods WHERE id =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        
            let PhotoPromise = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM goodsphoto WHERE id =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });

            
            let goodsSize = new Promise(function (resolve, reject) {
                con.query(
                    "SELECT * FROM market.goodssize where idGoods =" + req.query.id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        
            Promise.all([goodsPromise, PhotoPromise, goodsSize]).then(function (value) {
                res.render('goods.pug', {
                    item: JSON.parse(JSON.stringify(value[0])),
                    photo: JSON.parse(JSON.stringify(value[1])),
                    size: JSON.parse(JSON.stringify(value[2])),
                    authorized:false
                });
                //console.log(JSON.parse(JSON.stringify(value)));
                console.log('load /goods?id=' + req.query.id);
            })
        }
    })
});

app.get('/registration', function (req, res) {
    res.render('registration.pug');
    console.log('load /registration');
});


app.post('/registration', function (req, res) {

    let data = [req.body.email, req.body.password, req.body.name, req.body.secondName,
    req.body.birthday];
    console.log(data);

    if ((data[0].length == 0) || (data[1].length == 0) || (data[2].length == 0) ||
        (data[3].length == 0) || (data[4].length == 0)) {
        console.log('Error: incorrect data')
        res.status(400).json({
            message: 'Такой E-Mail уже используется'
        })
    }
    else {
        let checkMail = new Promise(function (resolve, reject) {
            con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ?)  AS flag', req.body.email, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });

        Promise.all([checkMail]).then(function (value) {
            if (value[0][0].flag > 0) {
                res.status(409).json({
                    message: 'Такой E-Mail уже используется'
                })
            }
            else {
                let addUser = new Promise(function (resolve, reject) {
                    con.query('INSERT INTO `users` (`email`, `password`, `name`, `secondName`, `birthday`) VALUES (?, ?, ?, ?, ?)',
                        data, function (err, result) {
                            if (err) reject(err);
                            console.log('add to bd user:' + data[0])
                            resolve(result);
                        })
                })
                Promise.all([addUser]).then(function (value) {
                    res.status(200).json({
                        message: 'add to bd user:' + data[0]
                    })
                });
            }
        });
    }
});

app.post('/login', function (req, res) {

    //Обработка полученных данных от пользователя
    let data = [req.body.email, req.body.password];
    //TODO: если куки значений будет больше, то мб не будет работать...
    let cook = req.body.cookies.split(';');
    for (let i = 0; i < cook.length; i++) {
        if (cook[i].includes('U1')) {
            cook = cook[i].split('=');
            cook = cook[1];
            break;
        }
    }
    // console.log('-----' + cook);

    // let cookMail = req.body.cookies.split(';');
    // for (let i = 0; i < cookMail.length; i++) {
    //     if (cookMail[i].includes('mail')) {
    //         cookMail = cookMail[i].split('=');
    //         cookMail = cookMail[1];
    //         break;
    //     }
    // }

    console.log('Получены куки от браузера:' + cook);



    let checkUser = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and password = ?)  AS flag',
            data, function (err, result) {
                if (err) reject(err);
                resolve(result);
            })
    })


    Promise.all([checkUser]).then(function (value) {
        console.log('Пользователь с данными:' + data + '. Ответ DB:' + value[0][0].flag);
        if (value[0][0].flag > 0) {
            console.log('Существует');
            let setCookie = new Promise(function (resolve, reject) {
                con.query('UPDATE market.users SET cookie = ? WHERE email = ?',
                    [cook, data[0]], function (err, result) {
                        if (err) reject(err);
                        //Куки файл пользователя обновлён
                        console.log('*Куки файл пользователя обновлён');
                        resolve(result);
                    });
            });
            Promise.all([setCookie]).then(function (value) {
                res.status(200).json({
                    message: 'Всё ок'
                })
            });
        }
        else {
            console.log('Не существует')
            res.status(409).json({
                message: 'Пароль либо логин введены неправильно'
            })
        }
    });

});

app.get('/profile', function (req, res) {
    if (req.cookies.U1 == null) {
        res.cookie('U1', cookieToken, { maxAge: 600000000 });
        console.log('Присвоение нового значения куки:' + cookieToken);
    }
    else {
        console.log('Текущее значение куки:' + req.cookies.U1);
    }
//======получаем куки файлы от браузера
    let cookTok = req.cookies.U1;
    console.log('Токен:' + cookTok);
    let cookMail = req.cookies.mail;
    console.log('Почта:' + cookMail);

//======Проверяем авторизован ли пользователь(Запрос в бд)
    let checkAuthorization = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and cookie = ?)  AS flag',
        [cookMail, cookTok], function (err, result) {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });

    Promise.all([checkAuthorization]).then(function (value) {
        if (value[0][0].flag > 0){
        //======Запрос информации о пользователе
            let userInfo = new Promise (function (resolve, reject){
                con.query(
                    "SELECT id, email, name, secondName FROM market.users where email = ?",
                    [cookMail], function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });

            Promise.all([userInfo]).then(function (value2) {
                console.log('Данные пользователя:');
                console.log(value2[0][0]);
                res.render('profile.pug',{
                    authorized: true,
                    user: JSON.parse(JSON.stringify(value2[0][0])),
                    userLogo: 'images/const_img/user-logo-profile.svg'
                });
                console.log('load /profile');
            })
        }
        else {
            //перевод на гл страницу к регистрации 
        }
    });
});


app.post('/setGoodsCart', function (req, res) {
//======получаем куки файлы от браузера
    let autorizCookiMail;
    let autorizCookiToken;
    
    if(req.body.cookies.indexOf('U1')==-1 || req.body.cookies.indexOf('mail')==-1){
        //пользоватнель не авторизован 
        res.status(401).json({
            message: 'Пользователь не авторизован'
        })
    }
    else
    {
        console.log('Найдено');
        let cookieReq = req.body.cookies;
        cookieReq = cookieReq.split('; ');

        autorizCookiMail = cookieReq[1].split('=');
        autorizCookiToken = cookieReq[0].split('=');

        autorizCookiMail = autorizCookiMail[1];
        autorizCookiToken = autorizCookiToken[1];

        console.log(autorizCookiMail);
        console.log(autorizCookiToken);

        //======Проверяем авторизован ли пользователь(Запрос в бд)
        //не будет работать, если порядок куки нарушен
    let checkAuthorization = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and cookie = ?)  AS flag',
        [autorizCookiMail, autorizCookiToken], function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });

    Promise.all([checkAuthorization]).then(function (value) {
        if (value[0][0].flag < 0){
            res.status(409).json({
                message: 'Конфликт данных пользователя(авторизации)'
            })
        }
        else
        {   
            let getIdUser = new Promise(function(resolve,reject){
                con.query('SELECT id FROM market.users where email = ?', [autorizCookiMail] ,
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });

            Promise.all([getIdUser]).then(function (value2) {
                console.log('ssssssssssssssssss');  
               console.log( value2[0][0]);
                let addCart = new Promise(function(resolve,reject){
                     con.query('INSERT INTO market.cart (idUser, idGoods, quantity, size) VALUES (?,?,?,?)',
                    [value2[0][0].id, Number(req.body.id), 1,  req.body.size], 
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    })
                });
                Promise.all([addCart]).then(function (value3){
                    res.status(200).json({
                    message: 'Всё ок'
                    })  
                });
            });
        };
    })};
});

app.get('/cart', function (req, res) {
    let goods = [];
    let photo = [];
    if (req.cookies.U1 == null) {
        res.cookie('U1', cookieToken, { maxAge: 600000000 });
        console.log('Присвоение нового значения куки:' + cookieToken);
    }
    else {
        console.log('Текущее значение куки:' + req.cookies.U1);
    }
//======получаем куки файлы от браузера
    let cookTok = req.cookies.U1;
    console.log('Токен:' + cookTok);
    let cookMail = req.cookies.mail;
    console.log('Почта:' + cookMail);

//======Проверяем авторизован ли пользователь(Запрос в бд)
    let checkAuthorization = new Promise(function (resolve, reject) {
        con.query('SELECT EXISTS(SELECT * FROM market.users WHERE email = ? and cookie = ?)  AS flag',
        [cookMail, cookTok], function (err, result) {
            if (err) reject(err);
            console.log(result);
            resolve(result);
        });
    });


    Promise.all([checkAuthorization]).then(function (value) {
        if (value[0][0].flag > 0){
            //Авторизован
            let getIdUser = new Promise(function(resolve,reject){
                con.query('SELECT id FROM market.users where email = ?', [cookMail] ,
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });

            Promise.all([getIdUser]).then(function (value2) {
                // console.log(value2[0][0].id);  
                let getCartUser = new Promise(function(resolve, reject){
                    con.query(`with aboba2 as(with aboba as (SELECT users.id, cart.idGoods, cart.quantity, cart.size  
                        from 
                        users join cart 
                        on users.id = cart.idUser and users.id = ?) 
                        
                        select aboba.id, aboba.idGoods, aboba.quantity, aboba.size, goodsphoto.image1,
                        goodsphoto.image2, goodsphoto.image3, goodsphoto.image4, goodsphoto.cartImage  from 
                        aboba join goodsphoto
                        on aboba.idGoods = goodsphoto.id)
                        
                        select * from
                        aboba2 join goods 
                        on aboba2.idGoods = goods.id;`,
                        value2[0][0].id,
                    function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                Promise.all([getCartUser]).then(function (value3) {
                    console.log(value3);
                    let total = 0;
                    for(i=0; i<value3[0].length; i++){
                        total = total+value3[0][i].price;
                    }
                    console.log(total);
                    res.render('cart.pug', {
                        goods: JSON.parse(JSON.stringify(value3[0])),
                        total: total,
                        authorized: false
                    });
                    console.log('load /cart');
                })
                
               
                
            });
        } 
        else 
        {
            //Не авторизован
            
        }
    })
});

app.get('/admin', function(req, res){
    let getGoods = new Promise(function (resolve, reject) {
        con.query(`SELECT goods.id, goods.name, 
        goods.brand, goods.category, goods.sex, 
        goods.description, goods.image, goods.price, goodsphoto.image1,
        goodsphoto.image2, goodsphoto.image3, 
        goodsphoto.image4, goodsphoto.cartImage 
         FROM market.goods join market.goodsphoto
        on goods.id = goodsphoto.id;`,
        function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
    

    Promise.all([getGoods]).then(function (value1) {
        console.log(value1[0]);

        res.render('admin.pug', {
            goods: JSON.parse(JSON.stringify(value1[0]))
        });
        console.log('load /admin');
    })
});


app.post('/addGoodsAdmin', function (req, res) {

    let data = req.body;
    console.log(data);

    let addGoods = new Promise(function(resolve, reject){
        con.query(`INSERT INTO market.goods (id, name, brand, category, sex, description, 
            image, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [req.body.id, req.body.name, req.body.brand, req.body.category, req.body.sex, 
            req.body.description, req.body.mainImg, req.body.price],
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    let addGoodsPhoto = new Promise(function(resolve, reject){
        con.query(`INSERT INTO market.goodsphoto (id, image1, image2, image3, image4, cartImage)
         VALUES (?, ?, ?, ?, ?, ?)`, 
        [req.body.id, req.body.img1, req.body.img2, req.body.img3, req.body.img4, req.body.imgCart] ,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });



    Promise.all([addGoods, addGoodsPhoto]).then(function (value){
        console.log('gg');
        res.status(200).json({
            message: 'GoodsAdd'
        })
    })
});


app.post('/deleteGoodsAdmin', function (req, res) {

    let deleteGoods = new Promise(function(resolve, reject){
        con.query(`DELETE FROM market.goods WHERE (id = ?)`, 
        [req.body.id],
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    let deleteGoodsPhoto = new Promise(function(resolve, reject){
        con.query(`DELETE FROM market.goodsphoto WHERE (id = ?)`, 
        [req.body.id] ,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    Promise.all([deleteGoods, deleteGoodsPhoto]).then(function (value){
        console.log('gg');
        res.status(200).json({
            message: 'GoodsDelete'
        })
    })
});

app.post('/editGoodsAdmin', function (req, res) {

    console.log(req.body);
    let editGoods = new Promise(function(resolve, reject){
        con.query(`UPDATE market.goods SET name = ?, brand = ?, 
        category = ?, sex = ?, description = ?, 
        image = ?, price = ? WHERE (id = ?)`, 
        [req.body.name, req.body.brand, req.body.category, req.body.sex,
            req.body.description, req.body.image, req.body.price, req.body.id],
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    let editGoodsPhoto = new Promise(function(resolve, reject){
        con.query(`UPDATE market.goodsphoto SET image1 = ?, 
        image2 = ?, image3 = ?, image4 = ?, cartImage = ? 
        WHERE (id = ?)`, 
        [req.body.img1, req.body.img2, req.body.img3, req.body.img4, 
            req.body.imgCart, req.body.id] ,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });

    Promise.all([editGoods, editGoodsPhoto]).then(function (value){
        console.log('gg');
        res.status(200).json({
            message: 'GoodsEdit'
        })
    })
});


app.use(function (req, res, next) {
    res.status(404);

    res.format({
        html: function () {
            res.render('404', { url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});

