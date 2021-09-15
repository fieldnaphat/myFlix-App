const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    methodOverride = require('method-override'),
    ServerPort = 8010;


const app = express();

//Middleware functions
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};
//Use the Morgan middleware library to log all requests 
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(methodOverride());
// Use express.static to serve your “documentation.html”
app.use(express.static('public'));
app.use(express.static('__dirname'));
app.use(myLogger);

//List of Movie 
let topMovies = [
    {
        id: 1,
        year: 2017,
        title: 'Wonder Woman',
        poster_img: './public/Poster_images/wonder_woman 1984.jpg',
        genre: 
        [
            'Action',
            'Adventure'
        ],
        description: 'Before she was Wonder Woman (Gal Gadot), she was Diana, princess of the Amazons, trained to be an unconquerable warrior. Raised on a sheltered island paradise, Diana meets an American pilot (Chris Pine) who tells her about the massive conflict that is raging in the outside world. Convinced that she can stop the threat, Diana leaves her home for the first time. Fighting alongside men in a war to end all wars, she finally discovers her full powers and true destiny.',
        info: {
            directors: 
            [
                {name: 'Patty Jenkins'},
                {born: 'July 24, 1971'},
                {about: 'Patricia Lea Jenkins is an American film director, producer, and screenwriter. She has directed the feature films Monster, Wonder Woman, and Wonder Woman 1984'}
            ],
            release_date: 'June 2, 2017(USA)'
        }
    },
    {
        id: 2,
        year: 2020,
        title: 'Wonder Woman 1984',
        genre: [
            'Action',
            'Adventure'
        ],
        description: 'Diana Prince lives quietly among mortals in the vibrant, sleek 1980s -- an era of excess driven by the pursuit of having it all. Though she is come into her full powers, she maintains a low profile by curating ancient artifacts, and only performing heroic acts incognito. But soon, Diana will have to muster all of her strength, wisdom and courage as she finds herself squaring off against Maxwell Lord and the Cheetah, a villainess who possesses superhuman strength and agility.',
        info: {
            directors: 
            [
                {name: 'Patty Jenkins'},
                {born: 'July 24, 1971'},
                {about: 'Patricia Lea Jenkins is an American film director, producer, and screenwriter. She has directed the feature films Monster, Wonder Woman, and Wonder Woman 1984'}
            ],
            release_date: 'December 25, 2020 (USA)'
        }
    },
    {
        id: 3,
        year: 2020,
        title: 'Birds of Prey',
        genre: [
            'Action',
            'Superhero'
        ],
        description: 'It open season on Harley Quinn when her explosive breakup with the Joker puts a big fat target on her back. Unprotected and on the run, Quinn faces the wrath of narcissistic crime boss Black Mask, his right-hand man, Victor Zsasz, and every other thug in the city. But things soon even out for Harley when she becomes unexpected allies with three deadly women -- Huntress, Black Canary and Renee Montoya.',
        info: {
            directors: 
            [
                {name: 'Cathy Yan'},
                {born: '1986'},
                {about: 'Cathy Y. Yan is a Chinese-born American film director, screenwriter, and producer. Her films include the comedy-drama film Dead Pigs and Birds of Prey, the eighth installment of the DC Extended Universe.'}
            ],
            release_date: 'January 29, 2020'
        }
    },
    {
        id: 4,
        year: 2019,
        title: 'Joker',
        genre: [
            'Crime',
            'Drama'
        ],
        description: 'Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker.',
        info: {
            directors: 'Todd Phillips',
            directors: 
            [
                {name: 'Todd Phillips'},
                {born: 'December 20, 1970'},
                {about: 'Todd Phillips is an American filmmaker and occasional actor. Phillips began his career in 1993 and directed films in the 2000s such as Road Trip, Old School, Starsky & Hutch, and School for Scoundrels. He came to prominence in the early 2010s for directing The Hangover film series.'}
            ],
            release_date: 'October 4, 2019(USA)'
        }
    },
    {
        id: 5,
        year: 2012,
        title: 'The Dark Knight Rises',
        genre: [
            'Action',
            'Thriller'
        ],
        description: 'It has been eight years since Batman (Christian Bale), in collusion with Commissioner Gordon (Gary Oldman), vanished into the night. Assuming responsibility for the death of Harvey Dent, Batman sacrificed everything for what he and Gordon hoped would be the greater good. However, the arrival of a cunning cat burglar (Anne Hathaway) and a merciless terrorist named Bane (Tom Hardy) force Batman out of exile and into a battle he may not be able to win.',
        info: {
            directors: 
            [
                {name: 'Christopher Nolan'},
                {born: 'July 30, 1970'},
                {about: 'Christopher Edward Nolan CBE is a British-American film director, producer, and screenwriter. His directorial efforts have grossed more than US$5 billion worldwide, garnered 36 Oscar nominations and 11 wins. Born and raised in London, Nolan developed an interest in filmmaking from a young age.'}
            ],
            release_date: 'July 20, 2012(USA)'
        }
    },
    {
        id: 6,
        year: 2017,
        title: 'Justice League',
        genre: [
            'Action',
            'Adventure'
        ],
        description: 'Fuelled by his restored faith in humanity, and inspired by Supermanm selfless act, Bruce Wayne enlists newfound ally Diana Prince to face an even greater threat. Together, Batman and Wonder Woman work quickly to recruit a team to stand against this newly-awakened enemy. Despite the formation of an unprecedented league of heroes in Batman, Wonder Woman, Aquaman, Cyborg and the Flash, it may be too late to save the planet from an assault of catastrophic proportions.',
        info: {
            directors: 
            [
                {name: 'Zack Snyder'},
                {born: 'March 1, 1966'},
                {about: 'Zachary Edward Snyder is an American film director, producer, and screenwriter. He made his feature film debut in 2004 with Dawn of the Dead, a remake of the 1978 horror film of the same name'}
            ],
            release_date: 'November 16, 2017'
        }
    },
    {
        id: 7,
        year: 2017,
        title: 'Batman and Harley Quinn',
        genre: [
            'Action',
            'Adventure'
        ],
        description: 'Batman and Nightwing join forces with Harley Quinn to stop a global threat brought about by two supervillains who have stolen a formula that can transform humans into plant people.',
        info: {
            directors: 
            [
                {name: 'Sam Liu'},
                {born: 'N/A'},
                {about: 'Sam Liu is an American animation producer, director, storyboard artist and character designer. He is best known for directing animated superhero films at both Marvel Entertainment and Warner Bros. Animation.'}
            ],
            release_date: 'August 14, 2017'
        }
    },
    {
        id: 8,
        year: 2018,
        title: 'Avengers-Infinity War',
        genre: [
            'Action',
            'Sci-fi'
        ],
        description: 'Iron Man, Thor, the Hulk and the rest of the Avengers unite to battle their most powerful enemy yet -- the evil Thanos. On a mission to collect all six Infinity Stones, Thanos plans to use the artifacts to inflict his twisted will on reality. The fate of the planet and existence itself has never been more uncertain as everything the Avengers have fought for has led up to this moment.',
        info: {
          
            directors : 
            [
                {name: 'Anthony Russo'},
                {born: 'February 3, 1970'},
                {about: 'Anthony Russo and Joseph Russo, collectively known as the Russo brothers, are American directors, producers, screenwriters, and actors. They direct most of their work together.'},
            
    
                {name: 'Joe Russo'},
                {born: 'July 18, 1971'},
                {about: 'Cleveland, Ohio, U.S. Anthony Russo (born February 3, 1970) and Joseph Russo (born July 18, 1971), collectively known as the Russo brothers (ROO-so), are American directors, producers, screenwriters, and actors. They direct most of their work together.'}
            ],
            release_date: 'April 23, 2018'
        }
    },
    {
        id: 9,
        year: 2018,
        title: 'Black Panther',
        genre: [
            'Action',
            'Adventure'
        ],
        description: 'After the death of his father, T Challa returns home to the African nation of Wakanda to take his rightful place as king. When a powerful enemy suddenly reappears, T Challa s mettle as king -- and as Black Panther -- gets tested when he ss drawn into a conflict that puts the fate of Wakanda and the entire world at risk. Faced with treachery and danger, the young king must rally his allies and release the full power of Black Panther to defeat his foes and secure the safety of his people.',
        info: {
            directors: 
            [
                {name: 'Ryan Coogler'},
                {born: 'May 23, 1986'},
                {about: 'Ryan Kyle Coogler is an American film director, producer, and screenwriter. His first feature film, Fruitvale Station, won the top audience and grand jury awards in the U.S. dramatic competition at the 2013 Sundance Film Festival.'}
            ],
            release_date: 'February 16, 2018'
        }
    },
    {
        id: 10,
        year: 2018,
        title: 'Ant-Man and the Wasp',
        genre: [
            'Action',
            'Adventure'
        ],
        description: 'Scott Lang is grappling with the consequences of his choices as both a superhero and a father. Approached by Hope van Dyne and Dr. Hank Pym, Lang must once again don the Ant-Man suit and fight alongside the Wasp. The urgent mission soon leads to secret revelations from the past as the dynamic duo finds itself in an epic battle against a powerful new enemy.',
        info: {
            directors: 
            [
                {name: 'Peyton Reed'},
                {born: 'July 3, 1964'},
                {about: 'Peyton Tucker Reed is an American television and film director. He directed the comedy films Bring It On, Down with Love, The Break-Up, and Yes Man, as well as the superhero film Ant-Man and its sequels.'}
            ],
            release_date: 'July 4, 2018'
        }
    },



];


//Reture a Movie list to home page


// Welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my movie database!');
});


//Return movie list
app.get('/movies', (req, res) => {
    res.send(JSON.stringify(topMovies));
});


// Gets the data about a single movies, by name
app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find((movie) => {
        return movie.title === req.params.title
    }));
});


// Adds data for a new movie to our list of movies.
app.post('/movies', (req, res) => {

    let newMovie = req.body;

    if (!newMovie.title) {
        const message = 'Missing movie title in request body';
        res.status(400).send(message);
    } else {
        newMovie.id = uuid.v4();
        topMovies.push(newMovie);
        res.status(201).send(newMovie);
    }
});


// Update the information in movie by title
app.put('/movies/:title', function (req, res) {

    let movie = topMovies.find((movie) => {
        return movie.title === req.params.title;
    });
    if (movie) {
        topMovies = topMovies.filter((obj) => {
            return obj.title !== req.params.title;
        });
        res.status(201).send("Movie with the ID of " + req.params.title + " was update");
    } else {
        res.status(404).send(`Movie with the id ${req.params.title} was not found.`);
    }
});


// Delete a movie from the list by Movie Name
app.delete("/movies/:title", (req, res) => {
    let movie = topMovies.find((movie) => {
        return movie.title === req.params.title;
    });

    if (movie) {
        topMovies = topMovies.filter((obj) => {
            return obj.title !== req.params.title;
        });
        res.status(201).send("Movie name: " + req.params.title + " was deleted.");
    } else {
        res.status(404).send(`Movie name: ${req.params.title} was not found.`);
    }

});


// Delete a movie from the list by id
app.delete("/movies/:id", (req, res) => {
    let movie = topMovies.find((movie) => {
        return movie.id === req.params.id;
    });

    if (movie) {
        topMovies = topMovies.filter((obj) => {
            return obj.id !== req.params.id;
        });
        res.status(201).send("Movie with the ID of " + req.params.id + " was deleted.");
    } else {
        res.status(404).send(`Movie with the id ${req.params.id} was not found.`);
    }
});



// User Section

//New Array for users list
let UserLists = [];

// Register New user
app.post('/register-new-user', function (req, res) {

    //Check if all fields are provided and are valid:
    if (!req.body.name ||
        !req.body.username ||
        !req.body.email ||
        !req.body.password) {

        res.status(400);
        res.send(`Can't register new user!!!`);
        // res.json({message: "Can't register new user!!!"});
    } else {

        let newUser = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        newUser.id = uuid.v4();
        UserLists.push(newUser);
        //   req.session.user = newUser;
        res.send(`registered new user successfully!`);
        res.redirect('/');
    }

});

//Return users list
app.get('/users', (req, res) => {
    res.send(JSON.stringify(UserLists));
});

// Get a user by username
app.get('/users/:username', (req, res) => {
    // res.send('Successful POST request creating a new user');
    res.json(UserLists.find((user) => {
        return user.username === req.params.username
    }));
});

//Account user page
app.get('/account/:user/:id', function (req, res) {
    res.send('Account Page');
});

//Change a user by username
app.put('/users/:username', (req, res) => {

    let user = UserLists.find((user) => {
        return user.username === req.params.username
    });

    if (user) {
        user.username[req.params.username] === req.params.username;
        res.status(201).send('User ' + req.params.username + ' was update username to ' + req.params.username + ' already.');
    } else {
        res.status(404).send('User ' + req.params.username + ' was not found.');
    }


});

// Delete a user by username
app.delete('/users/:username', (req, res) => {

    let user = UserLists.find((user) => {
        return user.username === req.params.username;
    });

    if (user) {
        UserLists = UserLists.filter((obj) => {
            return obj.username !== req.params.username;
        });
        res.status(201).send("Account with " + req.params.username + " was deleted.");
    } else {
        res.status(404).send(`Movie with the id ${req.params.username} was not found.`);
    }
});


//Delete user account by ID
app.delete('/account/:user/:id', (req, res) => {

    let user = UserLists.find((user) => {
        return user.id === req.params.id;
    });

    if (user) {
        UserLists = UserLists.filter((obj) => {
            return obj.id !== req.params.id;
        });
        res.status(201).send("Account with " + req.params.id + " was deleted.");
    } else {
        res.status(404).send(`Movie with the id ${req.params.id} was not found.`);
    }
});


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    res.send('Successful add new movie to your list');
});

// Dalete a movie to a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    res.send('Successful DELETE movie from your list');
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