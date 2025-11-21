import express from "express";
const host = "0.0.0.0";
const porta = 3000;

var listaFornecedores = [];
var listaClientes = [];

const server = express();

server.use(express.urlencoded({ extended: true }));

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
server.get("/", (requisicao, resposta) => {
    let conteudo = `
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
                                <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a> - Cadastre empresas fornecedoras</li>
                                <li><a href="/cadastrar-cliente">Cadastrar Cliente</a> - Cadastre clientes no sistema</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-success text-white">
                            <h5>Acesso ao Sistema</h5>
                        </div>
                        <div class="card-body">
                            <ul>
                                <li><a href="/login">Login</a> - Fazer login no sistema</li>
                                <li><a href="/logout">Logout</a> - Sair do sistema</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
});
server.get("/cadastrar-fornecedor", (requisicao, resposta) => {
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
                        <input type="text" class="form-control" id="cnpj" name="cnpj" value="" placeholder="00.000.000/0000-00">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="razaoSocial" class="form-label">Razão Social:</label>
                        <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" value="" placeholder="Moraes & irmãos Ltda">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nomeFantasia" class="form-label">Nome Fantasia:</label>
                        <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" value="" placeholder="Loja do 1,99">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="telefone" class="form-label">Telefone:</label>
                        <input type="text" class="form-control" id="telefone" name="telefone" value="" placeholder="(00) 00000-0000">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="endereco" class="form-label">Endereço:</label>
                    <input type="text" class="form-control" id="endereco" name="endereco" value="" placeholder="Rua, Número, Bairro">
                </div>
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label for="cidade" class="form-label">Cidade:</label>
                        <input type="text" class="form-control" id="cidade" name="cidade" value="">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="uf" class="form-label">UF:</label>
                        <input type="text" class="form-control" id="uf" name="uf" value="" placeholder="SP" maxlength="2">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="cep" class="form-label">CEP:</label>
                        <input type="text" class="form-control" id="cep" name="cep" value="" placeholder="00000-000">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" name="email" value="" placeholder="contato@empresa.com">
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
server.post('/cadastrar-fornecedor', (requisicao, resposta) => {
    const { cnpj, razaoSocial, nomeFantasia, telefone, endereco, cidade, uf, cep, email } = requisicao.body;

    if (cnpj && razaoSocial && nomeFantasia && telefone && endereco && cidade && uf && cep && email) {
        listaFornecedores.push({ cnpj, razaoSocial, nomeFantasia, telefone, endereco, cidade, uf, cep, email });
        console.log("Fornecedor cadastrado com sucesso!");
        resposta.redirect('/cadastrar-fornecedor');
    } else {
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
                            <input type="text" class="form-control" id="cnpj" name="cnpj" value="${cnpj}" placeholder="00.000.000/0000-00">
        `;
        if (!cnpj) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o CNPJ</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="razaoSocial" class="form-label">Razão Social:</label>
                            <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" value="${razaoSocial}" placeholder="Moraes & irmãos Ltda">
        `;
        if (!razaoSocial) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe a Razão Social</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nomeFantasia" class="form-label">Nome Fantasia:</label>
                            <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" value="${nomeFantasia}" placeholder="Loja do 1,99">
        `;
        if (!nomeFantasia) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Nome Fantasia</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="telefone" class="form-label">Telefone:</label>
                            <input type="text" class="form-control" id="telefone" name="telefone" value="${telefone}" placeholder="(00) 00000-0000">
        `;
        if (!telefone) {
            conteudo += `
                        <div>
                            <p class="text-danger">Por favor, informe o Telefone</p>
                        </div>
            `;
        }
        conteudo += `
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="endereco" class="form-label">Endereço:</label>
                        <input type="text" class="form-control" id="endereco" name="endereco" value="${endereco}" placeholder="Rua, Número, Bairro">
        `;
        if (!endereco) {
            conteudo += `
                        <div>
                            <p class="text-danger">Por favor, informe o Endereço</p>
                        </div>
            `;
        }
        conteudo += `
                    </div>
                    
                    <div class="row">
                        <div class="col-md-5 mb-3">
                            <label for="cidade" class="form-label">Cidade:</label>
                            <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
        `;
        if (!cidade) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe a Cidade</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="uf" class="form-label">UF:</label>
                            <input type="text" class="form-control" id="uf" name="uf" value="${uf}" placeholder="SP" maxlength="2">
        `;
        if (!uf) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o UF</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="cep" class="form-label">CEP:</label>
                            <input type="text" class="form-control" id="cep" name="cep" value="${cep}" placeholder="00000-000">
        `;
        if (!cep) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o CEP</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="email" name="email" value="${email}" placeholder="contato@empresa.com">
        `;
        if (!email) {
            conteudo += `
                        <div>
                            <p class="text-danger">Por favor, informe o Email</p>
                        </div>
            `;
        }
        conteudo += `
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
    }
});
server.get("/cadastrar-cliente", (requisicao, resposta) => {
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

server.post('/cadastrar-cliente', (requisicao, resposta) => {
    const { nome, email, cpf, telefone, dataNascimento, endereco, cidade, uf, cep } = requisicao.body;

    if (nome && email && cpf && telefone && dataNascimento && endereco && cidade && uf && cep) {
        listaClientes.push({ nome, email, cpf, telefone, dataNascimento, endereco, cidade, uf, cep });
        console.log("Cliente cadastrado com sucesso!");
        resposta.redirect('/cadastrar-cliente');
    } else {
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
            <div class="container mt-5">
                <h2 class="mb-4">Formulário de Cadastro de Cliente</h2>
                
                <form action="/cadastrar-cliente" method="POST">
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nome" class="form-label">Nome Completo:</label>
                            <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
        `;
        if (!nome) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Nome Completo</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" class="form-control" id="email" name="email" value="${email}">
        `;
        if (!email) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Email</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label for="cpf" class="form-label">CPF:</label>
                            <input type="text" class="form-control" id="cpf" name="cpf" value="${cpf}" placeholder="000.000.000-00">
        `;
        if (!cpf) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o CPF</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="telefone" class="form-label">Telefone:</label>
                            <input type="text" class="form-control" id="telefone" name="telefone" value="${telefone}" placeholder="(00) 00000-0000">
        `;
        if (!telefone) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Telefone</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="dataNascimento" class="form-label">Data de Nascimento:</label>
                            <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" value="${dataNascimento}">
        `;
        if (!dataNascimento) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe a Data de Nascimento</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="endereco" class="form-label">Endereço:</label>
                        <input type="text" class="form-control" id="endereco" name="endereco" value="${endereco}">
        `;
        if (!endereco) {
            conteudo += `
                        <div>
                            <p class="text-danger">Por favor, informe o Endereço</p>
                        </div>
            `;
        }
        conteudo += `
                    </div>
                    
                    <div class="row">
                        <div class="col-md-5 mb-3">
                            <label for="cidade" class="form-label">Cidade:</label>
                            <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
        `;
        if (!cidade) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe a Cidade</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="uf" class="form-label">UF:</label>
                            <input type="text" class="form-control" id="uf" name="uf" value="${uf}" placeholder="SC" maxlength="2">
        `;
        if (!uf) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o UF</p>
                            </div>
            `;
        }
        conteudo += `
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="cep" class="form-label">CEP:</label>
                            <input type="text" class="form-control" id="cep" name="cep" value="${cep}" placeholder="00000-000">
        `;
        if (!cep) {
            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o CEP</p>
                            </div>
            `;
        }
        conteudo += `
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
    }
});
server.get('/login', (requisicao, resposta) => {
    let conteudo = `
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
                    <h2 class="mb-4">Login</h2>
                    <form action="/login" method="POST">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário:</label>
                            <input type="text" class="form-control" id="usuario" name="usuario" value="" placeholder="Digite seu usuário">
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha:</label>
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha">
                        </div>
                        <button type="submit" class="btn btn-success">Entrar</button>
                    </form>
                    <div class="mt-3">
                        <p class="text-muted"><small>Login: usuário: <strong>admin</strong> | senha: <strong>123</strong></small></p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
});
server.post('/login', (requisicao, resposta) => {
    const { usuario, senha } = requisicao.body;

    let conteudo = `
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
                    <h2 class="mb-4">Login</h2>
                    <form action="/login" method="POST">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário:</label>
                            <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}" placeholder="Digite seu usuário">
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha:</label>
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha">
                        </div>
                        <button type="submit" class="btn btn-success">Entrar</button>
                    </form>
    `;
    if (usuario === 'admin' && senha === '123') {
        conteudo += `
                    <div class="alert alert-success mt-4" role="alert">
                        <h4 class="alert-heading">Login efetuado com sucesso!</h4>
                        <p>Bem-vindo ao sistema, <strong>${usuario}</strong>!</p>
                        <hr>
                        <p class="mb-0">Use o menu acima para navegar pelas funcionalidades.</p>
                    </div>
        `;
    } else {
        conteudo += `
                    <div class="alert alert-danger mt-4" role="alert">
                        <h4 class="alert-heading">Falha no login!</h4>
                        <p>Usuário ou senha inválidos. Por favor, tente novamente.</p>
                    </div>
                    <div class="mt-3">
                        <p class="text-muted"><small>logiN: usuário: <strong>admin</strong> | senha: <strong>123</strong></small></p>
                    </div>
        `;
    }
    conteudo += `
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    resposta.send(conteudo);
});
server.get('/logout', (requisicao, resposta) => {
    let conteudo = `
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
                        <hr>
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
    `;
    resposta.send(conteudo);
});
server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});