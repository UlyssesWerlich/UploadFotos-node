var express = require('express');
var app = express();
var fs = require("fs");

const filehelper = require('./app/util/file-helper');
const multer = require('./app/middleware/multer');

app.use(express.urlencoded({ extended: true }));
app.set('views', "./app/views");
app.use(express.static("./app/public"));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render('index.ejs', {message: false});
});

app.post('/', multer.single('image'), (req, res, next) => {
    if (req.file) {
        filehelper.compressImage(req.file, 500)
        .then(newPath => {
            res.render('index.ejs', {message: "Upload e compressão realizados com sucesso! O novo caminho é:" +newPath});
         })
        .catch(err => console.log(err));
    } else {
        res.render('index.ejs', {message: 'Houve erro no upload!'});
    }
});

app.get('/consultar', (req, res) =>{
    fs.readdir("./app/public/images", function(err, files){
        if (files.length >= 0){
            var images = [];
            files.forEach(file => {
                images.push({name: file, path: "/images/" + file})
            });
            res.render("consultar.ejs", {message: false, images: images})
        } else {
            res.render("consultar.ejs", {message: "Nenhuma imagem encontrada", images: false})
        }
    });
})

app.listen(3000);


