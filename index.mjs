import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', async(req, res) => {
    
    let randomImageResponse = await fetch('https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=solar%20system')
    let randomImageData = await randomImageResponse.json();
    //let randomImageURL = randomImageData.hits[0].previewURL;

    let index = Math.floor(Math.random() * randomImageData.hits.length)
    let randomImageURL = randomImageData.hits[index].previewURL
    //don't put things after render
    res.render('home.ejs', { image:randomImageURL });
});

app.get('/planetInfo', (req, res) => {
    let planet = req.query.planet;
    let planetInfo = planets[`get${ planet }`]();
    console.log(planetInfo);
    res.render('planetInfo.ejs', { planetInfo, planet });
});

app.get('/nasapod', async(req, res) => {
    
    let nasaImageResponse = await fetch('https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2026-03-11')
    let nasaImageData = await nasaImageResponse.json();
    let nasaImageURL = nasaImageData.url;

    //don't put things after render
    res.render('nasapod.ejs', { image:nasaImageURL });
});

/* app.get('/mercury', (req, res) => {
    let mercuryInfo = planets.getMercury();
    console.log(mercuryInfo);
    res.render('mercury.ejs', {mercuryInfo});
}); */

app.listen(3000, () => {
    console.log('server started');
});
