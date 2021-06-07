const express = require('express');
const path = require('path');
const config = require('config');

const port = process.env.PORT || config.get('server.port')
const lancamentos = [
  {
    nome: 'Andre',
    endereco: 'Rua Armilda 201',
    email: 'andre@adon.com',
    cpf: '300981900',
    contato: '(11)95099-2211',
    nascimento: '11/01/2001'
  }
]

const app = express();

app.set('port', port)

app.route('/extrato').get(
  (req,res) =>{
    res.status(200).json(lancamentos)
  }
)

app.listen(port, ()=>{
  console.log("Servidor iniciado")
})