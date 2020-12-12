const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  ({
    PostCreated: ({ id, title }) =>
      posts[id] = { id, title,  comments: [] },
    CommentCreated: ({ id, content, postId, status }) =>
    posts[postId].comments.push({ id, content, status }),
    CommentUpdated: ({ id, content, postId, status }) => {
      const comment = posts[postId].comments.find(c => c.id === id);
      comment.status = status;
      comment.content = content;
    },
  })?.[type]?.(data);
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  const res = await axios.get('http://event-bus-srv:4005/events');
  res.data.forEach(({ type, data}) => {
    console.log('Process event', type);

    handleEvent(type, data);
  });
});
