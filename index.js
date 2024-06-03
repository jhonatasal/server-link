const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const port = process.env.PORT || 3000;
const userPostgres = process.env.USER_POSTGRES;
const passwordPostgres = process.env.PASSWORD_POSTGRES;
const hostPostgres = process.env.HOST_POSTGRES;
const databasePostgres = process.env.DATABASE_POSTGRES;

// Configurar a conexão com o banco de dados PostgreSQL
const db = pgp({
  user: userPostgres,
  password: passwordPostgres,
  host: hostPostgres,
  database: databasePostgres,
  ssl: false,
  port: 6543,
});

app.use(express.json()); // Middleware para fazer o parsing do JSON

// Rota para salvar o link via POST
app.post("/save-link", async (req, res) => {
  const { link } = req.body;

  if (link) {
    try {
      const result = await db.one(
        "INSERT INTO links (url) VALUES ($1) RETURNING id",
        [link]
      );
      res
        .status(200)
        .send({ message: "Link salvo com sucesso!", id: result.id });
    } catch (err) {
      console.error("Erro ao inserir link no banco de dados:", err);
      res.status(500).send({ message: "Erro ao salvar o link" });
    }
  } else {
    res.status(400).send({ message: "Nenhum link fornecido!" });
  }
});

// Rota para recuperar o link salvo via GET
app.get("/get-link", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      "SELECT url FROM links ORDER BY id DESC LIMIT 1"
    );

    if (result) {
      res.status(200).send({ link: result.url });
    } else {
      res.status(404).send({ message: "Nenhum link encontrado!" });
    }
  } catch (err) {
    console.error("Erro ao recuperar link do banco de dados:", err);
    res.status(500).send({ message: "Erro ao recuperar o link" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
