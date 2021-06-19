const express = require('express');
const router = express.Router();

router.get('/', hello);

function hello(request, response) 
{
  response.send('K0chis Api');
}

module.exports = router;
