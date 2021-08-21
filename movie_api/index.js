const   express = require('express'),
        morgan = require('morgan'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        ServerPort = 8080;


const app = express();

//Middleware functions
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};
//Use the Morgan middleware library to log all requests 
app.use(morgan('common'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
// Use express.static to serve your “documentation.html”
app.use(express.static('./public'));
app.use(myLogger);

//List of Movie 
let topMovies = [

    {
        "year": 2017,
        "title": "Wonder Woman",
        "description": "Before she was Wonder Woman (Gal Gadot), she was Diana, princess of the Amazons, trained to be an unconquerable warrior. Raised on a sheltered island paradise, Diana meets an American pilot (Chris Pine) who tells her about the massive conflict that's raging in the outside world. Convinced that she can stop the threat, Diana leaves her home for the first time. Fighting alongside men in a war to end all wars, she finally discovers her full powers and true destiny.",
        "info": {
            "directors": "Patty Jenkins",
            "release_date": "June 2, 2017(USA)"
        }
    },
    {
        "year": 2020,
        "title": "Wonder Woman 1984",
        "description": "Diana Prince lives quietly among mortals in the vibrant, sleek 1980s -- an era of excess driven by the pursuit of having it all. Though she's come into her full powers, she maintains a low profile by curating ancient artifacts, and only performing heroic acts incognito. But soon, Diana will have to muster all of her strength, wisdom and courage as she finds herself squaring off against Maxwell Lord and the Cheetah, a villainess who possesses superhuman strength and agility.",
        "info": {
            "directors": "Patty Jenkins",
            "release_date": "December 25, 2020 (USA)"
        }
    },
    {
        "year": 2020,
        "title": "Birds of Prey",
        "description": "It's open season on Harley Quinn when her explosive breakup with the Joker puts a big fat target on her back. Unprotected and on the run, Quinn faces the wrath of narcissistic crime boss Black Mask, his right-hand man, Victor Zsasz, and every other thug in the city. But things soon even out for Harley when she becomes unexpected allies with three deadly women -- Huntress, Black Canary and Renee Montoya.",
        "info": {
            "directors": "Cathy Yan",
            "release_date": "January 29, 2020"
        }
    },
    {

        "year": 2019,
        "title": "Joker",
        "description": "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker.",
        "info": {
            "directors": "Todd Phillips",
            "release_date": "October 4, 2019(USA)"
        }
    },
    {

        "year": 2012,
        "title": "The Dark Knight Rises",
        "description": "It has been eight years since Batman (Christian Bale), in collusion with Commissioner Gordon (Gary Oldman), vanished into the night. Assuming responsibility for the death of Harvey Dent, Batman sacrificed everything for what he and Gordon hoped would be the greater good. However, the arrival of a cunning cat burglar (Anne Hathaway) and a merciless terrorist named Bane (Tom Hardy) force Batman out of exile and into a battle he may not be able to win.",
        "info": {
            "directors": "Christopher Nolan",
            "release_date": "July 20, 2012(USA)"
        }
    },
    {
        "year": 2017,
        "title": "Justice League",
        "description": "Fuelled by his restored faith in humanity, and inspired by Superman's selfless act, Bruce Wayne enlists newfound ally Diana Prince to face an even greater threat. Together, Batman and Wonder Woman work quickly to recruit a team to stand against this newly-awakened enemy. Despite the formation of an unprecedented league of heroes in Batman, Wonder Woman, Aquaman, Cyborg and the Flash, it may be too late to save the planet from an assault of catastrophic proportions.",
        "info": {
            "directors": "Zack Snyder",
            "release_date": "November 16, 2017"
        }
    },
    {
        "year": 2017,
        "title": "Batman and Harley Quinn",
        "description": "Batman and Nightwing join forces with Harley Quinn to stop a global threat brought about by two supervillains who have stolen a formula that can transform humans into plant people.",
        "info": {
            "directors": "Sam Liu",
            "release_date": "August 14, 2017 "
        }
    },
    {
        "year": 2018,
        "title": "Avengers: Infinity War",
        "description": "Iron Man, Thor, the Hulk and the rest of the Avengers unite to battle their most powerful enemy yet -- the evil Thanos. On a mission to collect all six Infinity Stones, Thanos plans to use the artifacts to inflict his twisted will on reality. The fate of the planet and existence itself has never been more uncertain as everything the Avengers have fought for has led up to this moment.",
        "info": {
            "directors": [
                "Anthony Russo",
                "Joe Russo"
            ],
            "release_date": "April 23, 2018"
        }
    },
    {
        "year": 2018,
        "title": "Black Panther",
        "description": "After the death of his father, T'Challa returns home to the African nation of Wakanda to take his rightful place as king. When a powerful enemy suddenly reappears, T'Challa's mettle as king -- and as Black Panther -- gets tested when he's drawn into a conflict that puts the fate of Wakanda and the entire world at risk. Faced with treachery and danger, the young king must rally his allies and release the full power of Black Panther to defeat his foes and secure the safety of his people.",
        "info": {
            "directors": "Ryan Coogler",
            "release_date": "February 16, 2018"
        }
    },
    {
        "year": 2018,
        "title": "Ant-Man and the Wasp ",
        "description": "Scott Lang is grappling with the consequences of his choices as both a superhero and a father. Approached by Hope van Dyne and Dr. Hank Pym, Lang must once again don the Ant-Man suit and fight alongside the Wasp. The urgent mission soon leads to secret revelations from the past as the dynamic duo finds itself in an epic battle against a powerful new enemy.",
        "info": {
            "directors": "Peyton Reed",
            "release_date": "July 4, 2018"
        }
    },

];

//Return welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

//Return movie list
app.get('/movie', (req, res) => {
    res.json(topMovies);
});

/* error-handling middleware function that will log all application-level
errors to the terminal */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Error!!!');
});

// listen for requests
app.listen(ServerPort, () => {
    console.log(`Your app is listening on port ${ServerPort}`);
});