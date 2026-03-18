import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const PIXABAY_KEY = "20426927-497d14db9c234faf7d0df8317";
const NASA_KEY = "DEMO_KEY";

app.get('/', async (req, res) => {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&per_page=50&orientation=horizontal&q=solar%20system`);
        const data = await response.json();

        let randomImageURL = "";
        if (data.hits && data.hits.length > 0) {
            const index = Math.floor(Math.random() * data.hits.length);
            randomImageURL = data.hits[index].webformatURL || data.hits[index].previewURL;
        }

        res.render('home.ejs', { image: randomImageURL });
    } catch (error) {
        console.log("Home route error:", error);
        res.render('home.ejs', { image: "" });
    }
});

app.get('/planetInfo', (req, res) => {
    try {
        const planet = req.query.planet;

        if (!planet) {
            return res.status(400).send("Missing planet name.");
        }

        const functionName = `get${planet}`;

        if (typeof planets[functionName] !== "function") {
            return res.status(404).send("Planet not found.");
        }

        const planetInfo = planets[functionName]();

        // IMPORTANT: make sure this matches your actual filename exactly
        res.render('planetinfo.ejs', { planet, planetInfo });
    } catch (error) {
        console.log("Planet route error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/nasapod', async (req, res) => {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
        const data = await response.json();

        res.render('nasapod.ejs', {
            title: data.title,
            image: data.url,
            explanation: data.explanation,
            date: data.date
        });
    } catch (error) {
        console.log("NASA POD error:", error);
        res.status(500).send("Could not load NASA POD.");
    }
});

app.get('/asteroids', async (req, res) => {
    try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${NASA_KEY}`);
        const data = await response.json();

        const dateKeys = Object.keys(data.near_earth_objects);
        const today = dateKeys[0];
        const asteroids = data.near_earth_objects[today];

        res.render('asteroids.ejs', { asteroids, date: today });
    } catch (error) {
        console.log("Asteroids error:", error);
        res.status(500).send("Could not load asteroids.");
    }
});

app.get('/comets', (req, res) => {
    const comets = [
        {
            name: "Halley's Comet",
            description: "A famous short-period comet that becomes visible from Earth about every 75 to 76 years."
        },
        {
            name: "Hale-Bopp",
            description: "One of the brightest and most widely observed comets of the twentieth century."
        },
        {
            name: "Encke",
            description: "A periodic comet known for having one of the shortest orbital periods."
        }
    ];

    res.render('comets.ejs', { comets });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});