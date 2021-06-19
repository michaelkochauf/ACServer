const express = require('express');
const router = express.Router();
const db = require('../src/database');
const Status = require('../src/Status');
let statusCollection = db.getCollection('status');
let userCollection = db.getCollection('users');
const bcrypt = require('bcrypt');

router.get('/:id', showItem);
function showItem(request, response) 
{
  checkCollection();
  let id = request.params.id;

  let status = statusCollection.get(id);


  let date = new Date();
  let nextRQ = 60000;
  if(date.getUTCHours() >= 20 || date.getUTCHours() < 10)
  {
    nextRQ = nextRQ*30;
  }

  status.nextRequest = nextRQ;
  response.json(status);
}

router.put('/:id', updateItem);
function updateItem(request, response) 
{
  checkCollection();

  let username = request.body.username;
  let password = request.body.password;
  
  if(!checkUser(username, password))
  {
    response.sendStatus(403);
    return;
  }

  let id = request.params.id;

  let status = statusCollection.get(id);

  status.hasChanged=false;
  statusCollection.update(status);

  response.json(status);
}

router.post('/:id', setItem);
function setItem(request, response) 
{
  checkCollection();

  let username = request.body.username;
  let password = request.body.password;
  if(!checkUser(username, password))
  {
    response.send(403);
    return;
  }

  let id = request.params.id;
  let newStatus = request.body.status;

  let status = statusCollection.get(id);

  status.hasChanged=true;
  status.isOn = newStatus;

  statusCollection.update(status);

  response.json(status);
}


router.get('/', listItems);
function listItems(request, response) 
{
  checkCollection();
  let users = statusCollection.find();

  response.json(users);
}

function checkCollection(){
  if(statusCollection === null)
  {
    statusCollection = db.getCollection('status');
  }

  if(userCollection === null)
  {
    userCollection = db.getCollection('users');
  }
}

function checkUser(username, password)
{
  let user = userCollection.findOne({username:username});

  if(user === null)
  {
    return false;
  }
  
  let hash = bcrypt.hashSync(password,"$2b$10$/Vq1VxVzNIJMqiOIJk/wse");
  if(hash !== user.password)
  {
    return false;
  }

  return true;
}

module.exports = router;
