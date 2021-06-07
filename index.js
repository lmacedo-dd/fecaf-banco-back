const express = require('express');
const path = require('path');
const config = require('config');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



const port = process.env.PORT || config.get('server.port')
app.set('port', port)
const pool = new pg.Pool({
  connectionString: 'postgres://cigeobjujpzkot:4b0ef45e09380752ad27d85e7e65cf12a1d08c2785eb7012291b2535e99d0426@ec2-107-21-10-179.compute-1.amazonaws.com:5432/d65kfvh2lhunke',
  ssl:{
    rejectUnauthorized: false
  }
})


// RESET 

app.route('/reset').get(
  (req, res) => {
    // CLIENTES TABLE
    let dropCreateTable = "DROP TABLE IF EXISTS clientes;"
    dropCreateTable += " CREATE TABLE clientes ("
    dropCreateTable += "nome varchar(150), "
    dropCreateTable += "endereco varchar(200), "
    dropCreateTable += "email varchar(200), "
    dropCreateTable += "cpf varchar(60), "
    dropCreateTable += "contato varchar(60), "
    dropCreateTable += "nascimento varchar(20) "
    dropCreateTable += ");"
    dropCreateTable = "DROP TABLE IF EXISTS pedidos;"
    dropCreateTable += " CREATE TABLE pedidos ("
    dropCreateTable += "cliente varchar(150), "
    dropCreateTable += "produto varchar(200), "
    dropCreateTable += "endereco varchar(200), "
    dropCreateTable += "observacoes varchar(60) "
    dropCreateTable += ");"

    pool.query(dropCreateTable, (err, dbres) => {
      if (err) throw err;
      res.status(200).send("BANCO DE DADOS RESETADO!")
    });
});


// ROTAS
app.route('/clientes').get(
  (req,res) =>{
    let qry = "SELECT * FROM clientes;"
    pool.query(qry, (err, dbres) => {
      res.status(200).json(dbres.rows)
    });
});

app.route('/newclientes').post(
  (req, res) => {
    console.log(req.body)
      let qry = "INSERT INTO clientes (nome,endereco,email,cpf,contato,nascimento) VALUES ";
      qry += `('${req.body.nome}', '${req.body.endereco}', '${req.body.email}', '${req.body.cpf}', '${req.body.contato}', '${req.body.nascimento}');`
      pool.query(qry, (err, dbres) => {
        res.status(200).send("INSERT CONFIRMADO")
      });
  }
)

// PEDIDOS


app.route('/pedidos').get(
  (req,res) =>{
    let qry = "SELECT * FROM pedidos;"
    pool.query(qry, (err, dbres) => {
      res.status(200).json(dbres.rows)
    });
});

app.route('/newpedidos').post(
  (req, res) => {
    console.log(req.body)
    let qry = "INSERT INTO pedidos (cliente,produto,endereco,observacoes) VALUES ";
    qry += `('${req.body.cliente}', '${req.body.produto}', '${req.body.endereco}', '${req.body.observacoes}');`
    pool.query(qry, (err, dbres) => {
      res.status(200).send("INSERT CONFIRMADO")
    });
  }
)

app.listen(port, ()=>{
  console.log(port)
  console.log("Servidor iniciado")
})


// const clientes = [
//   {
//     nome: 'Andre',
//     endereco: 'Rua Armilda 201',
//     email: 'andre@adon.com',
//     cpf: '300981900',
//     contato: '(11)95099-2211',
//     nascimento: '11/01/2001'
//   }
// ]