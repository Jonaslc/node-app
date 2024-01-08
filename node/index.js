const express = require('express')
const mysql = require('mysql')
const casual = require('casual');

const app = express()
const port = 3000

const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const dbConnection = mysql.createConnection(dbConfig)

dbConnection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
});

app.get('/', (req, res) => {
    const createPeopleTableSQL = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)`;

    dbConnection.query(createPeopleTableSQL, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
            return res.status(500).send('Erro ao criar tabela');
        }
    });

    const insertPeopleSQL = 'INSERT INTO people (name) VALUES (?)';
    const peopleName = casual.name;

    dbConnection.query(insertPeopleSQL, [peopleName], (err) => {
        if (err) {
            console.error('Erro ao inserir pessoa:', err);
            return res.status(500).send('Erro ao inserir pessoa');
        }
    });

    const consultPeopleSQL = 'SELECT * FROM people';

    dbConnection.query(consultPeopleSQL, (err, results) => {
        if (err) {
            console.error('Erro ao listar pessoas:', err);
            return res.status(500).send('Erro ao listar pessoas');
        }

        if (results.length > 0) {
            const listPeoples = results.map((people) => {
                return `ID: ${people.id}, Nome: ${people.name}`;
            });
            res.send('<h1>Full Cycle Rocks!</h1><br>' + listPeoples.join('<br>'));
        }
    });
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})