const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Conectar ao banco
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Conectado ao SQLite");
  }
});

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS livros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  autor TEXT,
  ano INTEGER,
  genero TEXT,
  idioma TEXT,
  preco REAL
)`);

// 📌 Rotas CRUD

// Listar todos
app.get("/api/livros", (req, res) => {
  db.all("SELECT * FROM livros", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar um
app.get("/api/livros/:id", (req, res) => {
  db.get("SELECT * FROM livros WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row);
  });
});

// Criar
app.post("/api/livros", (req, res) => {
  const { titulo, autor, ano, genero, idioma, preco } = req.body;
  db.run(
    "INSERT INTO livros (titulo, autor, ano, genero, idioma, preco) VALUES (?,?,?,?,?,?)",
    [titulo, autor, ano, genero, idioma, preco],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Editar
app.put("/api/livros/:id", (req, res) => {
  const { titulo, autor, ano, genero, idioma, preco } = req.body;
  db.run(
    "UPDATE livros SET titulo=?, autor=?, ano=?, genero=?, idioma=?, preco=? WHERE id=?",
    [titulo, autor, ano, genero, idioma, preco, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updatedID: req.params.id });
    }
  );
});

// Excluir
app.delete("/api/livros/:id", (req, res) => {
  db.run("DELETE FROM livros WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
