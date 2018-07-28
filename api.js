const User = require('./db/user');
const Words = require('./db/words');
const session = require('express-session');


module.exports = function(router) {
  router.get('/user', (req, res) => {
    if (req.session.user) {
      res.json({ success: true, user: req.session.user });
    } else {
      res.json({ success: false, message: 'No user' });
    }
  });

  router.post('/register', (req, res) => {
    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    if (req.body.username === '' || req.body.username === undefined || req.body.email === '' || req.body.email === undefined || req.body.password === '' || req.body.password === undefined) {
      res.json({ success: false, message: 'Must provide username, email, and password' });
    } else {
      user.save(function(err) {
        if (err) {
          if (err.message.slice(0, 6) === 'E11000') {
            if(err.message.slice(61, 66) === 'email') {
              res.json({ success: false, message: 'There is already an account associated with that email address.' });
            } else {
              res.json({ success: false, message: 'That username is already taken. Try a different username.' });  
            }
          } else {
            res.json({ success: false, message: err.message });
          }
        } else {
          req.session.user = {
            username: user.username,
            email: user.email,
            score: user.score
          }
          res.json({ success: true, message: 'user added to database', username: user.username, email: user.email });
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).select('email username password score').exec(function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Could not find an account with that email address' });
      } else if (user) {
        if (req.body.password) {
          var validPassword = user.comparePassword(req.body.password);
        } else {
          res.json({ success: false, message: 'No password provided' });
        }
        
        if (!validPassword) {
          res.json({ success: false, message: 'Incorrect password' });
        } else {
          req.session.user = {
            username: user.username,
            email: user.email,
            score: user.score
          }
          res.json({ success: true, message: 'User authenticated' });
        }
      }
    });
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.end();
  });

  router.post('/answer', (req, res) => {
    let { user, correct, level, word } = req.body;
    user.score[level].attempts++;
    if (req.body.correct) {
      Words.findOneAndUpdate({ word }, { $inc: { correct: 1 } }, function(err, results) {
        if (err) throw err;
        if (!results) {
          createWordEntry(word, correct);
        }
      });
      user.score[level].correct++;
      if (level === 'Hard') {
        user.score[level].points += 100000;
      } else if (level === 'Medium') {
        user.score[level].points += 100;
      } else if (level === 'Easy') {
        user.score[level].points++;
      }
    } else { // set word: word
      Words.findOneAndUpdate({ word }, { $inc: { incorrect: 1 } }, function(err, results) {
        if (err) throw err;
        if (!results) {
          createWordEntry(word, correct);
        }
      });
    }


    User.findOneAndUpdate({ username: user.username}, { $set: { score: user.score }}, { new: true }, function(err, results) {
      if (err) throw err;
      req.session.user = {
        username: results.username,
        email: results.email,
        score: results.score
      }
      res.json({ score: results.score });
    })
  });

  router.get('/profile', (req, res) => {
    const { name } = req.query;
    User.findOne({ username: name }, (err, user) => {
      if (err) throw err;
      res.json({ username: user.username, score: user.score });
    })
  });

  router.get('/leaderboard', (req, res) => {
    User.find({}, { username: true, score: true }, (err, users) => {
      if (err) throw err;
      let leaders = users.map((person) => {
        var username = person.username;
        var points = person.score.Easy.points + person.score.Medium.points + person.score.Hard.points;
        return { username, points };
      });
      leaders.sort((a, b) => {
        if (a.points < b.points) {
          return 1;
        } else {
          return -1;
        }
      });
      res.json({ users, leaders });
    })
  });

  return router;
}

function createWordEntry(word, correct) {
  var item = new Words();
  item.word = word;
  if (correct) {
    item.correct = 1;
    item.incorrect = 0;
  } else {
    item.incorrect = 1;
    item.correct = 0;
  }
  item.save(function(err) {
    if (err) {
      console.log('error: ', err);
    }
  });
}
