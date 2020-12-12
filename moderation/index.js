const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  ({
    CommentCreated: async ({ id, content, postId }) => {
      const status = content.includes('orange') ? 'rejected' : 'approved';

      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: { id, postId, status, content },
      });

    },
  })?.[type]?.(data);


  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
