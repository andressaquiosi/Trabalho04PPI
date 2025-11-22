import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;

var listaProdutos = [];

const server = express();

server.use(session({
    secret: "Minh4Ch4v3S3cr3t4",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

function verificarusuariologado(requisicao, resposta, proximo) {
    if (requisicao.session?.dadoslogin?.usuariologado) {
        proximo();
    } else {
        resposta.redirect("/login");
    }
}

function gerarMenu() {
    return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Sistema de Produtos</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/cadastrar-produto">Cadastrar Produto</a>
                        </li>
                         <li class="nav-item">
                            <a class="nav-link" href="#">Listar Usuários</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/login">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    `;
}

server.get("/", (requisicao, resposta) => {
    let ultimoacesso = requisicao.cookies?.ultimoacesso;
    const data = new Date();
    resposta.cookie("ultimoacesso", data.toLocaleString());

    resposta.setHeader("Content-Type", "text/html; charset=utf-8");
    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        ${gerarMenu()}
        <div class="container-fluid">
            <div class="d-flex justify-content-end p-2">
                <p class="text-muted"><strong>Último acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
            </div>
        </div>
        <div class="container mt-5">
            <h1>Bem-vindo ao Sistema de Estoque</h1>
            <p>Utilize o menu para acessar o cadastro de produtos.</p>
            ${!requisicao.session?.dadoslogin?.usuariologado ? 
                '<div class="alert alert-warning">Você não está logado. Por favor, faça o <a href="/login">Login</a>.</div>' : 
                '<div class="alert alert-success">Você está logado como ' + requisicao.session.dadoslogin.nomeusuario + '.</div>'}
        </div>
    </body>
    </html>
    `);
    resposta.end();
});

server.get('/login', (requisicao, resposta) => {
    resposta.setHeader("Content-Type", "text/html; charset=utf-8");
    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        ${gerarMenu()}
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h2 class="mb-4">Autenticação</h2>
                    <form action="/login" method="POST">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário:</label>
                            <input type="text" class="form-control" id="usuario" name="usuario" required>
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha:</label>
                            <input type="password" class="form-control" id="senha" name="senha" required>
                        </div>
                        <button class="btn btn-success w-100" type="submit">Login</button>
                    </form>
                    <div class="mt-3 text-center">
                        <small>Usuário: <strong>admin</strong> | Senha: <strong>admin</strong></small>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
    resposta.end();
});

server.post('/login', (requisicao, resposta) => {
    const { usuario, senha } = requisicao.body;

    if (usuario === 'admin' && senha === 'admin') {
        requisicao.session.dadoslogin = {
            usuariologado: true,
            nomeusuario: "Administrador"
        };
        resposta.redirect("/");
    } else {
        resposta.setHeader("Content-Type", "text/html; charset=utf-8");
        resposta.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Login Inválido</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            ${gerarMenu()}
            <div class="container mt-5">
                <div class="alert alert-danger">Usuário ou senha inválidos! <a href="/login" class="alert-link">Tente novamente</a>.</div>
            </div>
        </body>
        </html>
        `);
        resposta.end();
    }
});

server.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

server.get("/cadastrar-produto", verificarusuariologado, (requisicao, resposta) => {
    let ultimoacesso = requisicao.cookies?.ultimoacesso;
    const data = new Date();
    resposta.cookie("ultimoacesso", data.toLocaleString());

    resposta.setHeader("Content-Type", "text/html; charset=utf-8");
    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Produto</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        ${gerarMenu()}
        
        <div class="container-fluid">
            <div class="d-flex justify-content-end p-2">
                <p class="text-muted"><strong>Último acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
            </div>
        </div>

        <div class="container mt-3">
            <h2 class="mb-4">Cadastro de Produto</h2>
            
            <form action="/cadastrar-produto" method="POST">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="codigoBarras" class="form-label">Código de Barras:</label>
                        <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="descricao" class="form-label">Descrição do Produto:</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label for="precoCusto" class="form-label">Preço de Custo:</label>
                        <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="precoVenda" class="form-label">Preço de Venda:</label>
                        <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="dataValidade" class="form-label">Data de Validade:</label>
                        <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="qtdEstoque" class="form-label">Qtd em Estoque:</label>
                        <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="nomeFabricante" class="form-label">Nome do Fabricante:</label>
                    <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
            </form>
            
            <hr class="mt-5">
            <h3 class="mb-4">Produtos Cadastrados</h3>
    `);

    if (listaProdutos.length > 0) {
        resposta.write(`
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Cód. Barras</th>
                            <th>Descrição</th>
                            <th>Custo</th>
                            <th>Venda</th>
                            <th>Validade</th>
                            <th>Estoque</th>
                            <th>Fabricante</th>
                        </tr>
                    </thead>
                    <tbody>
        `);
        for (const produto of listaProdutos) {
            resposta.write(`
                <tr>
                    <td>${produto.codigoBarras}</td>
                    <td>${produto.descricao}</td>
                    <td>R$ ${produto.precoCusto}</td>
                    <td>R$ ${produto.precoVenda}</td>
                    <td>${produto.dataValidade}</td>
                    <td>${produto.qtdEstoque}</td>
                    <td>${produto.nomeFabricante}</td>
                </tr>
            `);
        }
        resposta.write(`
                    </tbody>
                </table>
            </div>
        `);
    } else {
        resposta.write('<div class="alert alert-info">Nenhum produto cadastrado ainda.</div>');
    }

    resposta.write(`
        </div>
    </body>
    </html>
    `);
    resposta.end();
});

server.post('/cadastrar-produto', verificarusuariologado, (requisicao, resposta) => {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante } = requisicao.body;

    if (codigoBarras && descricao && precoCusto && precoVenda && dataValidade && qtdEstoque && nomeFabricante) {
        listaProdutos.push({ 
            codigoBarras, 
            descricao, 
            precoCusto, 
            precoVenda, 
            dataValidade, 
            qtdEstoque, 
            nomeFabricante 
        });
    }
    
    resposta.redirect('/cadastrar-produto');
});

server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});