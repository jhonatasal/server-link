const express = require('express');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm');
const { pgTable, serial, text } = require('drizzle-orm/pg');


const port = process.env.PORT || 3000;
const userPostgres = process.env.USER_POSTGRES;
const passwordPostgres = process.env.PASSWORD_POSTGRES;
const hostPostgres = process.env.HOST_POSTGRES;
const databasePostgres = process.env.DATABASE_POSTGRES;

// Configurar a conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: userPostgres,
  password: passwordPostgres,
  host: hostPostgres,
  database: databasePostgres,
  ssl: false,
  port: 6543,
});

const linksTable = pgTable('links', {
  id: serial('id').primaryKey(),
  url: text('url').notNull()
});

// Inicializar o Drizzle ORM
const db = drizzle(pool);

app.use(express.json()); // Middleware para fazer o parsing do JSON

// Rota para salvar o link via POST
app.post('/save-link', async (req, res) => {
  const { link } = req.body;

  if (link) {
      try {
          const result = await db.insert(linksTable).values({ url: link }).returning('id');
          res.status(200).send({ message: 'Link salvo com sucesso!', id: result[0].id });
      } catch (err) {
          console.error('Erro ao inserir link no banco de dados:', err);
          res.status(500).send({ message: 'Erro ao salvar o link' });
      }
  } else {
      res.status(400).send({ message: 'Nenhum link fornecido!' });
  }
});

// Rota para recuperar o link salvo via GET
app.get('/get-link', async (req, res) => {
  try {
      const result = await db.select(linksTable).orderBy(linksTable.id.desc()).limit(1);
      if (result.length > 0) {
          res.status(200).send({ link: result[0].url });
      } else {
          res.status(404).send({ message: 'Nenhum link encontrado!' });
      }
  } catch (err) {
      console.error('Erro ao recuperar link do banco de dados:', err);
      res.status(500).send({ message: 'Erro ao recuperar o link' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});