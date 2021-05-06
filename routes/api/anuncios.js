var express = require('express');
const { NotExtended } = require('http-errors');
const { render } = require('../../app.js');
var router = express.Router();

const Anuncio = require('../../models/Anuncio.js');

/* GET /api/anuncios */
router.get('/', async function(req, res, next) { 
    try {
        const name = req.query.name; // req.query catch information received in url 
        const price = req.query.price; // req.query received a string but the model indicates that age is a number, monggose do the conversion
        const tags = req.query.tags;
        const location = req.query.location;
        const limit = parseInt(req.query.limit); // limit is not in the model, we must parse it into a number
        const skip = parseInt(req.query.skip);
        const fields = req.query.fields; // http://localhost:3000/api/anuncios?fields=name%20-_id%20price
        const sort = req.query.sort;
        const photo = req.query.photo;

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
        if (photo) {
            filtro.photo = photo
        }

        
        const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
        res.locals.resultado = resultado;
        //res.json(resultado);
        res.render('anuncios');
    } catch (error) {
        next (error);
    }
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
    try {
        const anuncioData = req.body;// Do not call it anuncio because anuncio will be the instance of the information received
        const anuncio = new Anuncio(anuncioData); // Using the model Anuncio
        const createdAnuncio = await anuncio.save(); // createdAnuncio save the promise (object) that save return. Save the new anuncio in BBDD
        await anuncio.onsale();
        // Wait till the promise returned by onsale is resolved
        res.status(201).json({result: createdAnuncio}); // Return the agent created. Status 201 - created is more exact than 200 - OK
    } catch (error) {
        next(error);
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