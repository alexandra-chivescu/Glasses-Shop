const express = require("express");                                 
const fs = require("fs");     
const sharp = require("sharp");                                                   
const { extname } = require("path");
app=express();                                                      
app.set("view engine", "ejs")   
                                                   
app.use("/resources",express.static(__dirname+"/resources"));
app.use("/node_modules",express.static(__dirname+"/node_modules"));

const sass = require("sass");
var cssBootstrap = sass.compile(__dirname+"/resources/scss/bootstrap-custom.scss", {sourceMap:true});
fs.writeFileSync(__dirname+"/resources/css/libraries/bootstrap-custom.css", cssBootstrap.css);

const {Client} = require("pg");
var client = new Client({
    database:"glasses_shop", 
    user: "alexandra_glasses_shop_db",
    password:"alexa2000",
    host:"localhost",
    port:5432 
});
client.connect();

obGlobal = {
    errors: null,
    imagini: null
}

function createImages(){
    var continutFisier=fs.readFileSync(__dirname+"/resources/json/galery.json").toString("utf8");
    var obiect=JSON.parse(continutFisier);
    var dim_mediu = 200;
    var dim_mic = 100;

    obGlobal.imagini=obiect.imagini;

    obGlobal.imagini.forEach(function (elem){
        [numeFisier, extensie] = elem.fisier.split(".")

        if(!fs.existsSync(obiect.cale_galerie + "/mediu/")) {
            fs.mkdirSync(obiect.cale_galerie + "/mediu/");
        }
        if(!fs.existsSync(obiect.cale_galerie + "/mic/")) {
            fs.mkdirSync(obiect.cale_galerie + "/mic/");
        }

        elem.fisier_mediu = obiect.cale_galerie + "/mediu/" + numeFisier + ".webp";
        elem.fisier_mic = obiect.cale_galerie + "/mic/" + numeFisier + ".webp";

        elem.fisier = obiect.cale_galerie + "/" + elem.fisier;
        
        sharp(__dirname+"/"+elem.fisier)
        .resize(dim_mediu)
        .toFile(__dirname+"/"+elem.fisier_mediu);

        sharp(__dirname+"/"+elem.fisier)
        .resize(dim_mic)
        .toFile(__dirname+"/"+elem.fisier_mic);
    });
}
createImages();

function createErrors() {
    var fileContent = fs.readFileSync(__dirname+"/resources/json/errors.json").toString("utf8");
    obGlobal.errors = JSON.parse(fileContent);
}
createErrors();

function renderError(res, identificator, titlu, text, image) {
    var error = obGlobal.errors.info_erori.find(function(elem) { 
        return elem.identificator == identificator;
    })
    console.log(__dirname+"\\"+obGlobal.errors.cale_baza+"\\"+obGlobal.errors.eroare_default.image)
    titlu = titlu || (error && error.titlu) || obGlobal.errors.eroare_default.titlu;
    text = text || (error && error.text) || obGlobal.errors.eroare_default.text;
    image= image || (error && obGlobal.errors.cale_baza+"\\"+error.image) || obGlobal.errors.cale_baza+"\\"+obGlobal.errors.eroare_default.image;

    if(error && error.status) {
        res.status(identificator).render("pagini/error", {titlu:titlu, text:text, image:image})
    } else {
        res.render("pagini/error", {titlu:titlu, text:text, image:image})
    }
}

app.get(["/","/index","/home"],function(req, res){
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.imagini});
}); 

app.get("/produse",function(req, res){
    client.query("select * from unnest(enum_range(null::frame_types))", function(err, rezCateg) {

        continuareQuery = ""

        if(req.query.category)
            continuareQuery += ` and category='${req.query.category}'`
        client.query("select * from glasses where 1=1"+ continuareQuery, function(err, rez) {
            if(err) {
                console.log(err);
                renderError(res, 2);
            }
            else
            {
                res.render("pagini/produse", {produse:rez.rows, optiuni:rezCateg.rows});
            }
        });
    });
}); 

app.get("/produs/:id",function(req, res){
    client.query("select * from glasses where id="+req.params.id, function(err, rez) {
        if(err) {
            console.log(err);
            renderError(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rez.rows[0]});
    });
}); 

app.get("/about_us",function(req, res){
    res.render("pagini/about_us"); 
}); 

app.get("/men-glasses",function(req, res){
    res.render("pagini/men-glasses"); 
});  
 
app.get("/men-sunglasses",function(req, res){
    res.render("pagini/men-sunglasses"); 
}); 

app.get("/*",function(req,res) {
    res.render("pagini"+req.url, function(err,rezRandare) {
        var extension = extname(req.url);
        if(extension === ".ejs")
            renderError(res, 403);
        if(err) {
            if(err.message.includes("Failed to lookup view"))
                renderError(res, 404);
        } else
        {
            res.send(rezRandare);
        }
    });
});


app.listen(8080);
console.log("The server has started.");

