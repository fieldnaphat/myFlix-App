const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    year: Date,
    title: {type: String, require: true},
    ImagePath: String,
    genre: {
        name: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}]
    },
    description: {type: String, require: true},
    directors: {
        name: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director'}]

    },
    actors: [String],
    release_date: Date,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    birth_date: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
  
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


  
let genreSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});


let directorSchema = mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    birth: { type: String, required: true },
    death: { type: String }
});



let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);


module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
