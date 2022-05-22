const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { options } = require('request');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//API key
//b163179c6b5edc657050d6e1ab325fde-us12
// list id
// a83005870f
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = 'https://us12.api.mailchimp.com/3.0/lists/a83005870f';
  const options = {
    method: 'POST',
    auth: 'jueon:b163179c6b5edc657050d6e1ab325fde-us12',
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
