const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replacetemplate');


////////////////////////////////////
// SERVER 



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8'); // read data from a json file
const dataObj = JSON.parse(data); 





const server = http.createServer( (req, res) => {

    const {query, pathname} = url.parse(req.url,true);

    //overview page
    if(pathname == '/' || pathname == '/overview'){
        //call the overview template
        res.writeHead(200,{'content-type' : 'text/html'});


        // loop to the data object which holds all info adn with each eitherations we replace the cards which is el
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //join to all d elements to a sting
        
        //console.log(cardsHtml); cardsHtml will returl all d cards as per d data in d array
        // rempace the cards
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);

        //product page
    } else if(pathname == '/product'){
        res.writeHead(200,{'content-type' : 'text/html'});
        const product = dataObj[query.id]; // get id from the url of a product
        const output = replaceTemplate(tempProduct, product); 
        res.end(output);

        //api
    }else if (pathname == '/api'){
        res.writeHead(200,{'content-type' : 'application/json'});
        res.end(data);

        //not found
    }else{
        res.writeHead(404,{
            'content-type':'text/html',
            'my-own-header' : 'hello world'
        });
        res.end('<h1> PAGE NOT  FOUND </h1>')
    }
});

server.listen(8000, '127.0.0.1',() => {
    console.log("Listening to request on port 8000");
});


