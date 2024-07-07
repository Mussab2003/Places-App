import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
const port = 4000;

const api_key = process.env.key;
const url = "https://api.content.tripadvisor.com/api/v1/location";

var search;
var location_id;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/submit', (req, res) => {
    search = req.body.data;
    console.log("Inside this function");
    console.log(search);
    res.render('test.ejs', {content : "Hello world"});
});

app.get('/search-result', async(req, res) => {
    try{
        console.log("Inside another function");
        console.log(search);
        const response = await axios.get(url + `/search?language=en&key=${api_key}&searchQuery=${search}`);
        //console.log(response.data.data);
        const data = response.data.data;
        var photos_url = [];
        for(let i=0; i<data.length; i++)
        {
            console.log("Location Id: " + data[0].location_id);
            const photo = await axios.get(url + `/${data[i].location_id}/photos?language=en&limit=1&key=${api_key}`);
            console.log(photo.data.data[0].images.medium.url);
            const photo_url = photo.data.data[0].images.medium.url;
            photos_url.push(photo_url);
        }
        res.render('index.ejs', {content : data, images: photos_url});
    }
    catch(error){
        console.log(error.message);
    }
});

app.post('/detail', (req, res) => {
    location_id = req.body.data;
    console.log(location_id);
    res.render('test.ejs', {content : "Hello World"});
});

app.get('/detail-page', async(req, res) => {
    try{
        var photos = [];
        //location_id = 155008;
        const response = await axios.get(url + `/${location_id}/photos?language=en&limit=5&key=${api_key}`);
        for(let i=0; i<response.data.data.length; i++){
            photos.push(response.data.data[i].images.large.url);
        }
        const response_detail = await axios.get(url + `/${location_id}/details?language=en&key=${api_key}`);
        console.log(response_detail.data);
        const details = response_detail.data;
        const data = {
            name : details.name,
            location : {lat: details.latitude, long : details.longitude},
            address : {
                street1 : details.address_obj.street1 ? details.address_obj.street1 : null, 
                street2 : details.address_obj.street2 ? details.address_obj.street2 : null,
                city : details.address_obj.city ? details.address_obj.city : null,
                country : details.address_obj.country ? details.address_obj.country : null,
            },
            photos_more : details.see_all_photos,
            website : details.website ?  details.website : null,
            phone : details.phone ? details.phone : null,
            rating : details.rating,
        }
        res.render('details.ejs', {data : data, photos : photos});

    }
    catch(error){
        console.log(error.message);
    }
});

app.listen(port, (req, res) => {
    console.log(`running at port ${port}`);
})