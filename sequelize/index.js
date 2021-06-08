const Sequelize = require('sequelize');

require('dotenv').config();

// need to add this so I can create a
// pull requests for this spefic file

const {
  DATABASE,
  USER_NAME,
  USER_PASSWORD,
  HOST,
  DB_PORT,
} = process.env;

const db = new Sequelize({
  database: DATABASE,
  username: USER_NAME,
  password: USER_PASSWORD,
  host: HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: true,
});

// creating the table for the user
const User = db.define('user', {
  username: Sequelize.STRING,
  googleId: Sequelize.STRING,
  isQuizzed: Sequelize.BOOLEAN,
});

// creating the table for the books api informations
const Book = db.define('book', {
  isbn: {
    type: Sequelize.STRING,
    unique: true,
  },
  title: {
    type: Sequelize.STRING,
    unique: true,
  },
  author: Sequelize.STRING,
  description: {
    type: Sequelize.TEXT,
    unique: true,
  },
  coverURL: {
    type: Sequelize.STRING,
    unique: true,
  },
  buyLink: {
    type: Sequelize.STRING,
    unique: true,
  },
  genre: Sequelize.STRING,
  urlSnippet: Sequelize.STRING,
  availability: Sequelize.STRING,
});

// creating the field on the table
const UserFollower = db.define('user_follower', {
  userID: {
    type: Sequelize.INTEGER,
  },
  followerID: {
    type: Sequelize.INTEGER,
  },
});

const UserBlocked = db.define('user_blocked', {
  userID: Sequelize.INTEGER, // User ID
  blockedID: Sequelize.INTEGER, // ID of user blocked by User ID
});

// creating the fields on the table
const UserBook = db.define('user_book', {
  userID: {
    type: Sequelize.INTEGER,
  },
  isbn: {
    type: Sequelize.STRING,
  },
  is_interested: Sequelize.BOOLEAN,
});

const UserPreference = db.define('user_preference', {
  userID: Sequelize.INTEGER,
  comedy: Sequelize.FLOAT,
  thriller: Sequelize.FLOAT,
  fantasy: Sequelize.FLOAT,
  romance: Sequelize.FLOAT,
});

// { force: true } add into sync if db change is made
db.sync({ force: true }).then(() => {
  console.log('connected to database');
}).catch((err) => { console.log(err); });

module.exports.User = User;
module.exports.Book = Book;
module.exports.UserFollower = UserFollower;
module.exports.UserBlocked = UserBlocked;
module.exports.UserBook = UserBook;
module.exports.UserPreference = UserPreference;
