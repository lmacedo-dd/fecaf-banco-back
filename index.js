const express = require('express');
const path = require('path');
const config = require('config');
const bodyParser = require('body-parser');
const pg = require('pg');
const jwt = require("jsonwebtoken")

const app = express();
// CONFIGURAÇÃO DOS ARQUIVOS JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// CONFIGURAÇÃO DA PORTA DE CONEXÃO
const port = process.env.PORT || config.get('server.port')
app.set('port', port)
const pool = new pg.Pool({
  connectionString: 'postgres://cigeobjujpzkot:4b0ef45e09380752ad27d85e7e65cf12a1d08c2785eb7012291b2535e99d0426@ec2-107-21-10-179.compute-1.amazonaws.com:5432/d65kfvh2lhunke',
  ssl:{
    rejectUnauthorized: false
  }
})

// CHAVE A SECRETA
const JWT_SECRET = "DD341K324J23N4LJ4H24HIU32H4U34UH23UH32H324K23K22MM2M2M2M2N33"

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
    // PEDIDOS TABLE
    dropCreateTable = "DROP TABLE IF EXISTS pedidos;"
    dropCreateTable += " CREATE TABLE pedidos ("
    dropCreateTable += "cliente varchar(150), "
    dropCreateTable += "produto varchar(200), "
    dropCreateTable += "endereco varchar(200), "
    dropCreateTable += "observacoes varchar(60) "
    dropCreateTable += ");"
    // USUARIOS TABLE
    dropCreateTable = "DROP TABLE IF EXISTS usuarios;"
    dropCreateTable += " CREATE TABLE usuarios ("
    dropCreateTable += "usuario varchar(150), "
    dropCreateTable += "senha varchar(200), "
    dropCreateTable += "perfil varchar(200), "
    dropCreateTable += "nome varchar(60) "
    dropCreateTable += ");"
    dropCreateTable += "INSERT INTO usuarios (usuario,senha,perfil,nome) "
    dropCreateTable += "VALUES ('admin', '123456', 'ADMIN', 'Usuário Geral');"

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

// LOGIN
app.route('/login').post((req,res) =>{
  let qry = `SELECT * FROM usuarios WHERE usuario = '${req.body.usuario}' `;
  qry += `AND senha = '${req.body.senha}';`
  pool.query(qry,(err, dbres) =>{
    if(err){
      res.status(500).send(err)
    } else {
      if(dbres.rowCount > 0){
        const row = dbres.rows[0]
        const payload = {
          usuario: row.usuario,
          perfil: row.perfil,
          nome: row.nome
        }

        const token = jwt.sign(payload, JWT_SECRET)
        const objToken = token
        res.status(200).json(token)
      } else {
        res.status(401).send("Usuario ou senha inválidos")
      }
    }
  })
})

// SUBINDO SERVIDOR!
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