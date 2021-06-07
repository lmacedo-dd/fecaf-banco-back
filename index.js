const express = require('express');
const path = require('path');
const config = require('config');

const app = express();

// const port = 80
const port = process.env.PORT || config.get('server.port')
app.set('port', port)
const clientes = [
  {
    nome: 'Andre',
    endereco: 'Rua Armilda 201',
    email: 'andre@adon.com',
    cpf: '300981900',
    contato: '(11)95099-2211',
    nascimento: '11/01/2001'
  }
]


app.route('/clientes').get(
  (req,res) =>{
    res.status(200).json(clientes)
  }
)

app.route('/newclientes').get(
  (req, res) => {
    res.status(200).send("Solicitou add cliente")
  }
)

app.listen(port, ()=>{
  console.log("Servidor iniciado")
})