var express = require('express');
const { NotExtended } = require('http-errors');
const { render } = require('../../app.js');
var router = express.Router();
var multer = require('multer');
var path = require('path');

const Anuncio = require('../../models/Anuncio.js');
const { FONT_SANS_10_BLACK } = require('jimp');
const { parse } = require('path');

/* Multer */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(__dirname, '../../public/images'))
        //cb(null, 'images') 
        //  destination: function (req, file, cb)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

/* GET /api/anuncios */
router.get('/', function (req, res, next) { 
    
    Anuncio.find({} , async (error) => {
        try {
            const name = req.query.name; // req.query catch information received in url 
            const price = req.query.price; // req.query received a string but the model indicates that age is a number, monggose do the conversion
            const tags = req.query.tags;
            const location = req.query.location;
            const limit = parseInt(req.query.limit); // limit is not in the model, we must parse it into a number
            const skip = parseInt(req.query.skip);
            const fields = req.query.fields; // http://localhost:3000/api/anuncios?fields=name%20-_id%20price
            const sort = req.query.sort;
            const photo = req.body.photo;
    
            const filtro = {};
    
            if (name) {
                filtro.name = new RegExp('^'+ req.query.name, "i"); // RegExp that allow to search by the start of the name
            }
            if (price) {
                filtro.price = price
            }
            if (tags) [
                filtro.tags = tags
            ]
            if (location) {
                filtro.location = location
            }
            
            const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
            res.locals.resultado = resultado;
            //res.json(resultado);
            res.render('anuncios');
        } catch {
            next (error);
        }
    });
    //res.render('anuncios');
});

//GET /api/anuncios:id
// Not need to indicate the route /api/anuncios because all request received on this router are connected to /api/anuncios - rutas de API en app.js
router.get('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id; // req.params is how it receive information from the URL
        const anuncio = await Anuncio.findOne({ _id: _id }); // same as Anuncio.findOne({_id}) both sides of the comparisson are the same
        if (!anuncio) {
            return res.status(404).json({ error: 'Not Found '}); 
        }
        res.json({ result: anuncio });
    } catch (error) {
        next(error);
    }
});

// POST /api/anuncios
router.post('/', async (req, res, next) => {
    console.log('post a api/anuncios')
    console.log('Response Body');
    console.log(req.body);
    
    try {
        var object = {
            name: req.body.name,
            price: parseInt(req.body.price),
            tags: req.body.tags,
            sale: req.body.sale,
            location: req.body.location,
            photo: req.body.photo // To save the file name into DB
        }
        const file = req.file;
        const anuncio = new Anuncio(object, file);
        //const anuncioData = req.body;
        //const anuncio = new Anuncio(anuncioData);
        await anuncio.onsale();
        const createdAnuncio = await anuncio.save();
    
        let upload = multer({storage}).single('photo')
        console.log('post a images')
        upload(req, res, function (error) {
            console.log(req)
            if(!req.file) {
                console.log(req.file)
                return res.status(400).json({ message: 'file is required' });
            } else if(error) {
                return res.status(400).json({ message: error })
            }
            return res.status(201);
        })

        res.status(201).json({result: createdAnuncio}); // Return the agent created. Status 201 - created is more exact than 200 - OK

    } catch {
        next();
    }
});

// PUT /api/anuncios/:id (body)
router.put('/:id', async (req, res, next) =>  { 
    try {
        const _id = req.params.id;
        const anuncioData = req.body;
        const updatedAnuncio = await Anuncio.findOneAndUpdate({_id}, anuncioData, {new: true, useFindAndModify: false }); // with {new:true} it returns the anuncio updated
        res.json({ result: updatedAnuncio }); // Response with the update of the anuncio
    } catch (error) {
        next(error);
    }
});

//DELETE /api/anuncios/:id
router.delete('/:id', async (req,res,next)=>{
    try {
        const _id = req.params.id;
        await Anuncio.deleteOne({_id});
        res.status(200).json(); // Status 200 - OK is a good option, there is no options more exacts for Delate
    } catch (error) {
        next(error);
    }
});

module.exports = router;