const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes/authRoutes.js')
const postRoutes = require('./src/routes/postRoutes/postRoutes.js')
const connectDB = require('./src/config/db/db.js')
const path = require('path');
const cookieParser = require('cookie-parser')
const csrf = require('csurf')


dotenv.config();

const app = express();
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser())

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);


connectDB();

app.use(cors())

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('auth/register.ejs')
});
app.get('/login', (req, res) => {
    res.render('auth/login.ejs')
});

app.use('/api/auth', authRoutes)
app.use('/home', postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


