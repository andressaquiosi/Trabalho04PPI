import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;

var listaFornecedores = [];
var listaClientes = [];
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
                <a class="navbar-brand" href="/">Sistema de Cadastro</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownCadastros" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastros
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownCadastros">
                                <li><a class="dropdown-item" href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                                <li><a class="dropdown-item" href="/cadastrar-cliente">Cadastrar Cliente</a></li>
                                <li><a class="dropdown-item" href="/cadastrar-produto">Cadastrar Produto</a></li>
                            </ul>
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
                    <h2 class="mb-4">Autenticação do Sistema</h2>
                    <form action="/login" method="POST" class="needs-validation" novalidate>
                        <fieldset class="border p-4">
                            <legend class="mb-3">Login</legend>
                            <div class="mb-3">
                                <label for="usuario" class="form-label">Usuário:</label>
                                <input type="text" class="form-control" id="usuario" name="usuario" placeholder="Digite seu usuário" required>
                            </div>
                            <div class="mb-3">
                                <label for="senha" class="form-label">Senha:</label>
                                <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" type="submit">Login</button>
                            </div>
                        </fieldset>
                    </form>
                    <div class="mt-3">
                        <p class="text-muted text-center"><small>Credenciais de teste: <strong>admin</strong> | senha: <strong>123</strong></small></p>
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

    if (usuario === 'admin' && senha === '123') {
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            ${gerarMenu()}
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="alert alert-danger" role="alert">
                            <h4 class="alert-heading">Falha no Login!</h4>
                            <p>Usuário ou senha inválidos. Por favor, tente novamente.</p>
                        </div>
                        <h2 class="mb-4">Autenticação do Sistema</h2>
                        <form action="/login" method="POST" class="needs-validation" novalidate>
                            <fieldset class="border p-4">
                                <legend class="mb-3">Login</legend>
                                <div class="mb-3">
                                    <label for="usuario" class="form-label">Usuário:</label>
                                    <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario || ''}" placeholder="Digite seu usuário" required>
                                </div>
                                <div class="mb-3">
                                    <label for="senha" class="form-label">Senha:</label>
                                    <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha" required>
                                </div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-success" type="submit">Login</button>
                                </div>
                            </fieldset>
                        </form>
                        <div class="mt-3">
                            <p class="text-muted text-center"><small>Credenciais de teste: <strong>admin</strong> | senha: <strong>123</strong></small></p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `);
        resposta.end();
    }
});
server.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy((err) => {
        if (err) {
            console.log("Erro ao destruir a sessão:", err);
        }
    });

    resposta.setHeader("Content-Type", "text/html; charset=utf-8");
    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logout</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        ${gerarMenu()}
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">Logout efetuado com sucesso!</h4>
                        <p>Você foi desconectado do sistema.</p>
                        <hr>
                        <p class="mb-0">Até logo!</p>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                        <a href="/" class="btn btn-primary">Voltar para Home</a>
                        <a href="/login" class="btn btn-success">Fazer Login Novamente</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
    resposta.end();
});
server.get("/", verificarusuariologado, (requisicao, resposta) => {
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
        <title>Sistema de Gerenciamento</title>
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
            <h1>Página Inicial</h1>
            <p>Bem-vindo ao sistema de gerenciamento.</p>
            <p>Funcionalidades disponíveis no sistema:</p>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-primary text-white">
                            <h5>Cadastros</h5>
                        </div>
                        <div class="card-body">
                            <ul>
                                <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                                <li><a href="/cadastrar-cliente">Cadastrar Cliente</a></li>
                                <li><a href="/cadastrar-produto">Cadastrar Produto</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-success text-white">
                            <h5>Sessão</h5>
                        </div>
                        <div class="card-body">
                            <ul>
                                <li><a href="/logout">Logout (Sair)</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
    resposta.end();
});
server.get("/cadastrar-fornecedor", verificarusuariologado, (requisicao, resposta) => {
    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Fornecedor</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        ${gerarMenu()}
        <div class="container mt-5">
            <h2 class="mb-4">Cadastro de Fornecedor</h2>
            
            <form action="/cadastrar-fornecedor" method="POST">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="cnpj" class="form-label">CNPJ:</label>
                        <input type="text" class="form-control" id="cnpj" name="cnpj" placeholder="00.000.000/0000-00">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="razaoSocial" class="form-label">Razão Social:</label>
                        <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" placeholder="Razão Social">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nomeFantasia" class="form-label">Nome Fantasia:</label>
                        <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" placeholder="Nome Fantasia">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="telefone" class="form-label">Telefone:</label>
                        <input type="text" class="form-control" id="telefone" name="telefone" placeholder="(00) 00000-0000">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="endereco" class="form-label">Endereço:</label>
                    <input type="text" class="form-control" id="endereco" name="endereco" placeholder="Rua, Número, Bairro">
                </div>
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label for="cidade" class="form-label">Cidade:</label>
                        <input type="text" class="form-control" id="cidade" name="cidade">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="uf" class="form-label">UF:</label>
                        <input type="text" class="form-control" id="uf" name="uf" placeholder="UF" maxlength="2">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="cep" class="form-label">CEP:</label>
                        <input type="text" class="form-control" id="cep" name="cep" placeholder="00000-000">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="contato@empresa.com">
                </div>
                <button type="submit" class="btn btn-primary">Cadastrar</button>
            </form>
            <hr class="mt-5">
            <h3 class="mb-4">Fornecedores Cadastrados</h3>
    `;
    if (listaFornecedores.length > 0) {
        conteudo += `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>CNPJ</th>
                            <th>Razão Social</th>
                            <th>Nome Fantasia</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Endereço</th>
                            <th>Cidade/UF</th>
                            <th>CEP</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (const fornecedor of listaFornecedores) {
            conteudo += `
                <tr>
                    <td>${fornecedor.cnpj}</td>
                    <td>${fornecedor.razaoSocial}</td>
                    <td>${fornecedor.nomeFantasia}</td>
                    <td>${fornecedor.telefone}</td>
                    <td>${fornecedor.email}</td>
                    <td>${fornecedor.endereco}</td>
                    <td>${fornecedor.cidade}/${fornecedor.uf}</td>
                    <td>${fornecedor.cep}</td>
                </tr>
            `;
        }
        conteudo += `
                    </tbody>
                </table>
            </div>
        `;
    } else {
        conteudo += '<p class="alert alert-info">Nenhum fornecedor cadastrado ainda.</p>';
    }
    conteudo += `
        </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
});
server.post('/cadastrar-fornecedor', verificarusuariologado, (requisicao, resposta) => {
    const { cnpj, razaoSocial, nomeFantasia, telefone, endereco, cidade, uf, cep, email } = requisicao.body;

    if (cnpj && razaoSocial && nomeFantasia && telefone && endereco && cidade && uf && cep && email) {
        listaFornecedores.push({ cnpj, razaoSocial, nomeFantasia, telefone, endereco, cidade, uf, cep, email });
        console.log("Fornecedor cadastrado com sucesso!");
        resposta.redirect('/cadastrar-fornecedor');
    } else {
        resposta.send("Erro: Preencha todos os campos!");
    }
});
server.get("/cadastrar-cliente", verificarusuariologado, (requisicao, resposta) => {
    let ultimoacesso = requisicao.cookies?.ultimoacesso;
    
    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Cliente</title>
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
            <h2 class="mb-4">Formulário de Cadastro de Cliente</h2>
            
            <form action="/cadastrar-cliente" method="POST">
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nome" class="form-label">Nome Completo:</label>
                        <input type="text" class="form-control" id="nome" name="nome" value="">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="email" name="email" value="">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="cpf" class="form-label">CPF:</label>
                        <input type="text" class="form-control" id="cpf" name="cpf" value="" placeholder="000.000.000-00">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="telefone" class="form-label">Telefone:</label>
                        <input type="text" class="form-control" id="telefone" name="telefone" value="" placeholder="(00) 00000-0000">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="dataNascimento" class="form-label">Data de Nascimento:</label>
                        <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" value="">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="endereco" class="form-label">Endereço:</label>
                    <input type="text" class="form-control" id="endereco" name="endereco" value="">
                </div>
                
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label for="cidade" class="form-label">Cidade:</label>
                        <input type="text" class="form-control" id="cidade" name="cidade" value="">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="uf" class="form-label">UF:</label>
                        <input type="text" class="form-control" id="uf" name="uf" value="" placeholder="SC" maxlength="2">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="cep" class="form-label">CEP:</label>
                        <input type="text" class="form-control" id="cep" name="cep" value="" placeholder="00000-000">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">Cadastrar</button>
            </form>
            <hr class="mt-5">

            <h3 class="mb-4">Clientes Cadastrados</h3>
    `;
    if (listaClientes.length > 0) {
        conteudo += `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Data Nasc.</th>
                            <th>Cidade/UF</th>
                            <th>CEP</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (const cliente of listaClientes) {
            conteudo += `
                <tr>
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.dataNascimento}</td>
                    <td>${cliente.cidade}/${cliente.uf}</td>
                    <td>${cliente.cep}</td>
                </tr>
            `;
        }
        conteudo += `
                    </tbody>
                </table>
            </div>
        `;
    } else {
        conteudo += '<p class="alert alert-info">Nenhum cliente cadastrado ainda.</p>';
    }
    conteudo += `
        </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
});
server.post('/cadastrar-cliente', verificarusuariologado, (requisicao, resposta) => {
    const { nome, email, cpf, telefone, dataNascimento, endereco, cidade, uf, cep } = requisicao.body;

    if (nome && email && cpf && telefone && dataNascimento && endereco && cidade && uf && cep) {
        listaClientes.push({ nome, email, cpf, telefone, dataNascimento, endereco, cidade, uf, cep });
        console.log("Cliente cadastrado com sucesso!");
        resposta.redirect('/cadastrar-cliente');
    } else {
        resposta.send("Erro: Preencha todos os campos!");
    }
});
server.get("/cadastrar-produto", verificarusuariologado, (requisicao, resposta) => {
    let ultimoacesso = requisicao.cookies?.ultimoacesso;
    let nomeUsuario = requisicao.session?.dadoslogin?.nomeusuario || "Usuário";

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
            <div class="d-flex justify-content-between p-2">
                <p class="text-muted"><strong>Usuário logado:</strong> ${nomeUsuario}</p>
                <p class="text-muted"><strong>Último acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
            </div>
        </div>
        <div class="container mt-5">
            <h2 class="mb-4">Cadastro de Produto</h2>
            
            <form action="/cadastrar-produto" method="POST">
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="codigoBarras" class="form-label">Código de Barras:</label>
                        <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="" placeholder="7891234567890">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="descricao" class="form-label">Descrição do Produto:</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" value="" placeholder="Ex: Notebook Dell Inspiron">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label for="precoCusto" class="form-label">Preço de Custo:</label>
                        <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" value="" placeholder="0.00">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="precoVenda" class="form-label">Preço de Venda:</label>
                        <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" value="" placeholder="0.00">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="dataValidade" class="form-label">Data de Validade:</label>
                        <input type="date" class="form-control" id="dataValidade" name="dataValidade" value="">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="qtdEstoque" class="form-label">Qtd em Estoque:</label>
                        <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" value="" placeholder="0">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="nomeFabricante" class="form-label">Nome do Fabricante:</label>
                    <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" value="" placeholder="Ex: Dell Inc.">
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
                    <thead>
                        <tr>
                            <th>Código de Barras</th>
                            <th>Descrição</th>
                            <th>Preço Custo</th>
                            <th>Preço Venda</th>
                            <th>Data Validade</th>
                            <th>Qtd Estoque</th>
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
                    <td>R$ ${parseFloat(produto.precoCusto).toFixed(2)}</td>
                    <td>R$ ${parseFloat(produto.precoVenda).toFixed(2)}</td>
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
        resposta.write('<p class="alert alert-info">Nenhum produto cadastrado ainda.</p>');
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
        listaProdutos.push({ codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante });
        console.log("Produto cadastrado com sucesso!");
        resposta.redirect('/cadastrar-produto');
    } else {
        let ultimoacesso = requisicao.cookies?.ultimoacesso;
        let nomeUsuario = requisicao.session?.dadoslogin?.nomeusuario || "Usuário";

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
                <div class="d-flex justify-content-between p-2">
                    <p class="text-muted"><strong>Usuário logado:</strong> ${nomeUsuario}</p>
                    <p class="text-muted"><strong>Último acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
                </div>
            </div>
            <div class="container mt-5">
                <div class="alert alert-danger" role="alert">
                    <strong>Erro!</strong> Por favor, preencha todos os campos obrigatórios.
                </div>
                <h2 class="mb-4">Cadastro de Produto</h2>
                
                <form action="/cadastrar-produto" method="POST">
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="codigoBarras" class="form-label">Código de Barras:</label>
                            <input type="text" class="form-control ${!codigoBarras ? 'is-invalid' : ''}" id="codigoBarras" name="codigoBarras" value="${codigoBarras || ''}" placeholder="7891234567890">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="descricao" class="form-label">Descrição do Produto:</label>
                            <input type="text" class="form-control ${!descricao ? 'is-invalid' : ''}" id="descricao" name="descricao" value="${descricao || ''}" placeholder="Ex: Notebook Dell Inspiron">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <label for="precoCusto" class="form-label">Preço de Custo:</label>
                            <input type="number" step="0.01" class="form-control ${!precoCusto ? 'is-invalid' : ''}" id="precoCusto" name="precoCusto" value="${precoCusto || ''}" placeholder="0.00">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="precoVenda" class="form-label">Preço de Venda:</label>
                            <input type="number" step="0.01" class="form-control ${!precoVenda ? 'is-invalid' : ''}" id="precoVenda" name="precoVenda" value="${precoVenda || ''}" placeholder="0.00">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="dataValidade" class="form-label">Data de Validade:</label>
                            <input type="date" class="form-control ${!dataValidade ? 'is-invalid' : ''}" id="dataValidade" name="dataValidade" value="${dataValidade || ''}">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="qtdEstoque" class="form-label">Qtd em Estoque:</label>
                            <input type="number" class="form-control ${!qtdEstoque ? 'is-invalid' : ''}" id="qtdEstoque" name="qtdEstoque" value="${qtdEstoque || ''}" placeholder="0">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="nomeFabricante" class="form-label">Nome do Fabricante:</label>
                        <input type="text" class="form-control ${!nomeFabricante ? 'is-invalid' : ''}" id="nomeFabricante" name="nomeFabricante" value="${nomeFabricante || ''}" placeholder="Ex: Dell Inc.">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                </form>
            </div>
        </body>
        </html>
        `);
        resposta.end();
    }
});

server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});