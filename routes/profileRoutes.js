

const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/', profileController.profileGet);
router.post('/', profileController.profilePost);

////
// app.post('/api/user/login', (req, res) => {
//     const { email, password } = req.body;
//     const user = User.findOne({ email });
//     if (!user || !user.matchPassword(password)) {
//       res.render('login.ejs', {
//         error: 'Invalid email or password',
//       });
//       return;
//     }
  
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
//     res.cookie('token', token);
//     res.redirect('/profile');
//   });
  
//   // api/user/register
//   app.post('/api/user/register', (req, res) => {
//     const { firstName, email, password } = req.body;
//     const user = new User({ firstName, email, password });
//     user.save();
  
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
//     res.cookie('token', token);
//     res.redirect('/profile');
//   });
  
//   // api/user/profile
//   app.get('/api/user/profile', (req, res) => {
//     const token = req.cookies.token;
//     const userId = jwt.verify(token, process.env.JWT_SECRET).userId;
  
//     const user = User.findById(userId);
//     if (!user) {
//       res.render('401.ejs');
//       return;
//     }
  
//     res.render('profile.ejs', {
//       user,
//     });
//   });

module.exports = router;