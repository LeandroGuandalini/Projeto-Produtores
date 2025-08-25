from flask import Flask, render_template, request, redirect, flash
import sqlite3
import os

app = Flask(__name__, template_folder="../public")
app.secret_key = "uma_chave_secreta"  

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "banco.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS produtores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            localidade TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produtor_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT,
            foto TEXT,
            FOREIGN KEY (produtor_id) REFERENCES produtores(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route("/produtores")
def lista_produtores():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, nome, whatsapp, localidade FROM produtores")
    produtores = c.fetchall()
    conn.close()
    return render_template("lista_produtores.html", produtores=produtores)


@app.route("/")
def index():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        SELECT produtos.id, produtos.nome, produtos.preco, produtos.descricao, produtos.foto,
            produtores.nome, produtores.whatsapp
        FROM produtos
        JOIN produtores ON produtos.produtor_id = produtores.id
    ''')
    produtos = c.fetchall()
    conn.close()
    return render_template("index.html", produtos=produtos)

@app.route("/cadastro_produtor", methods=["GET", "POST"])
def cadastro_produtor():
    if request.method == "POST":
        nome = request.form["nome"]
        whatsapp = request.form["whatsapp"]
        localidade = request.form.get("localidade", "")
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO produtores (nome, whatsapp, localidade) VALUES (?, ?, ?)",
                  (nome, whatsapp, localidade))
        conn.commit()
        conn.close()
        flash("Produtor cadastrado com sucesso!")
        return redirect("/cadastro_produtor")
    return render_template("cadastro_produtor.html")

@app.route("/cadastro_produto", methods=["GET", "POST"])
def cadastro_produto():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, nome FROM produtores")
    produtores = c.fetchall()
    conn.close()

    if request.method == "POST":
        produtor_id = request.form["produtor_id"]
        nome = request.form["nome"]
        preco = request.form["preco"]
        descricao = request.form.get("descricao", "")
        foto = request.form.get("foto", "")
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO produtos (produtor_id, nome, preco, descricao, foto) VALUES (?, ?, ?, ?, ?)",
                  (produtor_id, nome, preco, descricao, foto))
        conn.commit()
        conn.close()
        flash("Produto cadastrado com sucesso!")
        return redirect("/cadastro_produto")
    
    return render_template("cadastro_produto.html", produtores=produtores)

if __name__ == "__main__":
    app.run(debug=True)
