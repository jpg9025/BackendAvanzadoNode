### Backend with Node - III Module of X Bootcamp Fullstackweb ###

## Start the database with MongoDB ##
Create a data folder
Create a db folder inside of data folder
- New terminal window -
use: mongod --dbpath ./data/db - (Unix) start mongo at that folder

- New terminal window -
use: mongo on the route where mongo is installed 
use: show dbs - show all basedata in that folder
use: use anuncios - anuncios is the name for the collection

## Start the application ##
use: npm install / npm i - (Unix) install all the dependencies includes in the package.json to run the app
npm run dev - start the API

## Clear all the information in database and charge samples ##
From the browser:
http://localhost:3000/api/installdb - This route is programmed to drop all data in the collection anuncios and charge the samples
http://localhost:3000/api/anuncios - Anuncio samples from anuncios.json

## Thumbnail creator service - miniature of the pics ##
- Terminal window -
npm run thumbnailService
### API Methods ###

## GET api/anuncios ##
For getting a list of anuncios there are two options:

From mongo terminal window:
use: db.anuncios.find()

From the browser:
http://localhost:3000/api/anuncios

## SORT api/anuncios ##
For sorting the list there are two options:

From mongo terminal window
Sort by increasing price: db.anuncios.find().sort({price:1})
Sort by decreasing price: db.anuncios.find().sort({price:-1})
Sort by tags, lifestyle: db.anuncios.find({tags:'lifestyle'})
Sort by tags, lifestyle and mobile: db.anuncios.find({$and:[{ tags:"motor"},{tags:"lifestyle"}]})
Sort by tags, lifestyle or mobile: db.anuncios.find({$or:[{ tags:"motor"},{tags:"lifestyle"}]})
Sort by name (a-z): db.anuncios.find().sort({name:1})
Sort by decreasing name (z-a) and increasing price: db.anuncios.find().sort({name:-1},{price:1})
Sort by price (10-25): db.anuncios.find({ price: { $gt: 10, $lt: 25}})

From browser url:
Sort by increasing price: http://localhost:3000/api/anuncios?sort=price
Sort by decreasing price: http://localhost:3000/api/anuncios?sort=-price
Sort by tags, lifystyle: http://localhost:3000/api/anuncios?tags=lifestyle
Sort by tags, lifestyle and mobile: http://localhost:3000/api/anuncios?tags=lifestyle&tags=mobile
Sort by tags, lifestyle or mobile: http://localhost:3000/api/anuncios?tags=lifestyle&mobile
Sort by name (a-z): http://localhost:3000/api/anuncios?sort=name
Sort by decreasing name (z-a) and increasing price: http://localhost:3000/api/anuncios?sort=-name&price

## POST api/anuncios ##
For posting new anuncios there are two options:

From mongo terminal window:
db.anuncios.insert({"name": "Motocicleta","sale": false,"price": 50.00,"photo": "motormotorbike.jpg","tags": [ "lifestyle", "motor"]})
Include the picture of the product in /public/images to see the details in http://localhost:3000/imagenes?image=(Product) 
Example: http://localhost:3000/imagenes?image=Beats

From browser url:
Use postman app, specify the url http://localhost:3000/api/anuncios type of Body and all the parameters
! File name must be exactly the same as the file pasted into public/images folder. Sensible to lower and upper cases

## DELETE api/anuncios/:id ##
From mongo terminal window: 
db.anuncios.remove({"_id":ObjectId("Copy-and-paste-the-id-here")})

From browser url:
Use postman app, specify the url http://localhost:3000/api/anuncios/copy-and-paste-the-id-here 

## View anuncio's photos ##
To see the pictures of the productos: 
Copy the name of the product from http://localhost:3000/api/anuncios
Paste the name on the url http://localhost:3000/imagenes?image= (Car) and visit the url http://localhost:3000/imagenes?image=Car