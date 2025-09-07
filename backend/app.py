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

@app.route("/produtores")
def lista_produtores():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, nome, whatsapp, localidade FROM produtores")
    produtores = c.fetchall()
    conn.close()
    return render_template("lista_produtores.html", produtores=produtores)

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
        return redirect("/produtores")
    return render_template("cadastro_produtor.html")

@app.route("/editar_produtor/<int:id>", methods=["GET", "POST"])
def editar_produtor(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    if request.method == "POST":
        nome = request.form["nome"]
        whatsapp = request.form["whatsapp"]
        localidade = request.form.get("localidade", "")
        c.execute("UPDATE produtores SET nome=?, whatsapp=?, localidade=? WHERE id=?",
                (nome, whatsapp, localidade, id))
        conn.commit()
        conn.close()
        flash("Produtor atualizado com sucesso!")
        return redirect("/produtores")

    c.execute("SELECT id, nome, whatsapp, localidade FROM produtores WHERE id=?", (id,))
    produtor = c.fetchone()
    conn.close()
    return render_template("editar_produtor.html", produtor=produtor)

@app.route("/deletar_produtor/<int:id>")
def deletar_produtor(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM produtores WHERE id=?", (id,))
    conn.commit()
    conn.close()
    flash("Produtor excluído com sucesso!")
    return redirect("/produtores")

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
        return redirect("/")

    return render_template("cadastro_produto.html", produtores=produtores)

@app.route("/produtos")
def lista_produtos():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        SELECT produtos.id, produtos.nome, produtos.preco, produtos.descricao, produtos.foto,
            produtores.nome
        FROM produtos
        JOIN produtores ON produtos.produtor_id = produtores.id
    ''')
    produtos = c.fetchall()
    conn.close()
    return render_template("lista_produtos.html", produtos=produtos)

@app.route("/editar_produto/<int:id>", methods=["GET", "POST"])
def editar_produto(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    if request.method == "POST":
        nome = request.form["nome"]
        preco = request.form["preco"]
        descricao = request.form.get("descricao", "")
        foto = request.form.get("foto", "")
        c.execute("UPDATE produtos SET nome=?, preco=?, descricao=?, foto=? WHERE id=?",
                (nome, preco, descricao, foto, id))
        conn.commit()
        conn.close()
        flash("Produto atualizado com sucesso!")
        return redirect("/produtos")

    c.execute("SELECT id, nome, preco, descricao, foto FROM produtos WHERE id=?", (id,))
    produto = c.fetchone()
    conn.close()
    return render_template("editar_produto.html", produto=produto)

@app.route("/deletar_produto/<int:id>")
def deletar_produto(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM produtos WHERE id=?", (id,))
    conn.commit()
    conn.close()
    flash("Produto excluído com sucesso!")
    return redirect("/produtos")

if __name__ == "__main__":
    app.run(debug=True)
