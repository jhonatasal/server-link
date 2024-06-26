const express = require("express");
const app = express();

const version = "ad1917b9-c404-4792-90cc-b88c531fe326";

// Porta a ser usada pelo servidor, definida pela variável de ambiente PORT ou padrão 3000
const port = process.env.PORT || 3000;

let linkStore = ""; // Variável em memória para armazenar o link

app.use(express.json()); // Middleware para fazer o parsing do JSON

// Rota para salvar o link via POST
app.post("/save-link", (req, res) => {
  const { link } = req.body;

  if (link) {
    linkStore = link;
    res.status(200).send({ message: "Link salvo com sucesso!" });
  } else {
    res.status(400).send({ message: "Nenhum link fornecido!" });
  }
});

// Rota para recuperar o link salvo via GET
app.get("/get-link", (req, res) => {
  if (linkStore) {
    res.status(200).send({ link: linkStore });
  } else {
    res.status(404).send({ message: "Nenhum link encontrado!" });
  }
});

app.get("/get-version", (req, res) => {
  res.status(200).send({ version: version });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
