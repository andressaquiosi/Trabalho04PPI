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
        resposta.redirect("/login?erro=naologado");
    }
}

function gerarMenu(usuarioLogado = "Visitante") {
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
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/cadastrar-produto">Cadastro de Produtos</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                ${usuarioLogado}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownUser">
                                ${usuarioLogado !== "Visitante"
                                    ? `<li><a class="dropdown-item" href="/logout">Logout</a></li>`
                                    : `<li><a class="dropdown-item" href="/login">Login</a></li>`
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    `;
}
server.get("/", (requisicao, resposta) => {
    let nomeUsuario = requisicao.session?.dadoslogin?.nomeusuario || "Visitante";
    let estaLogado = requisicao.session?.dadoslogin?.usuariologado;

    resposta.setHeader("Content-Type", "text/html; charset=utf-8");

    let corpo;

    if (estaLogado) {
        corpo = `
            <div class="container mt-5">
                <div class="alert alert-success text-center py-5" role="alert">
                    <h1 class="display-4">Dashboard Principal</h1>
                    <p class="lead">Bem-vindo(a), ${nomeUsuario}!</p>
                    <hr class="my-4">
                    <p>Você está logado e pode acessar todas as funcionalidades do sistema.</p>
                    <a class="btn btn-primary btn-lg" href="/cadastrar-produto" role="button">Ir para Cadastro de Produtos</a>
                </div>
                <div class="alert alert-info mt-4" role="alert">
                    <h4 class="alert-heading">Requisitos da Atividade</h4>
                    <p><strong>Login/Sessão:</strong> Credenciais de teste: Usuário: <code>admin</code> | Senha: <code>admin</code></p>
                    <p><strong>Cadastro de Produtos:</strong> Rota protegida por login/sessão.</p>
                    <p class="mb-0"><strong>Último Acesso (Cookies):</strong> Implementado na página de Cadastro de Produtos.</p>
                </div>
            </div>
        `;
    } else {
        corpo = `
            <div class="container mt-5">
                <div class="hero-section text-center">
                    <h1 class="display-4">Bem-vindo(a) ao Sistema de Cadastro!</h1>
                    <p class="lead">Aqui você pode gerenciar seus produtos de forma segura, com controle de sessão e cookies.</p>
                    <hr class="my-4">
                    <p>
                        Para cadastrar produtos, você precisa fazer o login.
                    </p>
                    <a class="btn btn-primary btn-lg" href="/login" role="button">Fazer Login</a>
                </div>
                
                <div class="alert alert-info mt-4" role="alert">
                    <h4 class="alert-heading">Requisitos da Atividade</h4>
                    <p><strong>Login/Sessão:</strong> Credenciais de teste: Usuário: <code>admin</code> | Senha: <code>admin</code></p>
                    <p><strong>Cadastro de Produtos:</strong> Rota protegida por login/sessão.</p>
                    <p class="mb-0"><strong>Último Acesso (Cookies):</strong> Implementado na página de Cadastro de Produtos.</p>
                </div>
            </div>
        `;
    }

    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home - Sistema de Produtos</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; }
            .hero-section { background-color: #e9ecef; padding: 4rem 0; border-radius: 0.5rem; }
        </style>
    </head>
    <body>
        ${gerarMenu(nomeUsuario)}
        ${corpo}
    </body>
    </html>
    `);
    resposta.end();
});

server.get('/login', (requisicao, resposta) => {
    if (requisicao.session?.dadoslogin?.usuariologado) {
        return resposta.redirect("/");
    }

    const erro = requisicao.query.erro;

    resposta.setHeader("Content-Type", "text/html; charset=utf-8");

    resposta.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Sistema</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; }
            .login-card { border: none; border-radius: 1rem; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); }
        </style>
    </head>
    <body>
        ${gerarMenu()}
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card login-card p-4">
                        <h2 class="card-title text-center mb-4 text-primary">Autenticação do Sistema</h2>
                        
                        ${erro === 'invalido' ? `
                            <div class="alert alert-danger" role="alert">
                                Usuário ou senha inválidos. Tente novamente.
                            </div>
                        ` : ''}
                        
                        ${erro === 'naologado' ? `
                            <div class="alert alert-warning" role="alert">
                                Você precisa estar logado para acessar a área de cadastro.
                            </div>
                        ` : ''}

                        <form action="/login" method="POST">
                            <div class="mb-3">
                                <label for="usuario" class="form-label">Usuário:</label>
                                <input type="text" class="form-control" id="usuario" name="usuario" placeholder="admin" required>
                            </div>
                            <div class="mb-4">
                                <label for="senha" class="form-label">Senha:</label>
                                <input type="password" class="form-control" id="senha" name="senha" placeholder="admin" required>
                            </div>
                            <div class="d-grid">
                                <button class="btn btn-success btn-lg" type="submit">Login</button>
                            </div>
                        </form>
                        <div class="mt-3 text-center">
                            <small class="text-muted">Credenciais de Teste: <strong>admin</strong> / <strong>admin</strong></small>
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

server.post("/login", (requisicao, resposta) => {
    const { usuario, senha } = requisicao.body;
    if (usuario === "admin" && senha === "admin") {
        requisicao.session.dadoslogin = {
            usuariologado: true,
            nomeusuario: "Administrador"
        };
        resposta.redirect("/");
    } else {
        resposta.redirect("/login?erro=invalido");
    }
});

server.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy((err) => {
        if (err) {
            console.log("Erro ao destruir a sessão:", err);
        }
        resposta.redirect("/");
    });
});

server.get("/cadastrar-produto", verificarusuariologado, (requisicao, resposta) => {
    
    let ultimoacesso = requisicao.cookies?.ultimoacesso;
    const data = new Date();
    
    resposta.cookie("ultimoacesso", data.toLocaleString("pt-BR"), { maxAge: 900000, httpOnly: true });

    let nomeUsuario = requisicao.session?.dadoslogin?.nomeusuario || "Usuário Logado";
    
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
        ${gerarMenu(nomeUsuario)}
        <div class="container-fluid">
            <div class="d-flex justify-content-between p-3 bg-light border-bottom">
                <p class="mb-0 text-dark"><strong>Usuário:</strong> ${nomeUsuario}</p>
                <!-- Exibição do Cookie de Último Acesso -->
                <p class="mb-0 text-secondary"><strong>Último Acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
            </div>
        </div>
        <div class="container mt-4">
            <h2 class="mb-4 text-primary">Cadastro de Novo Produto</h2>
            
            <form action="/cadastrar-produto" method="POST" class="row g-3">
                
                <div class="col-md-6">
                    <label for="codigoBarras" class="form-label">Código de Barras:</label>
                    <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required placeholder="Ex: 7891234567890">
                </div>
                <div class="col-md-6">
                    <label for="descricao" class="form-label">Descrição do Produto:</label>
                    <input type="text" class="form-control" id="descricao" name="descricao" required placeholder="Ex: Notebook Gamer">
                </div>

                <div class="col-md-3">
                    <label for="precoCusto" class="form-label">Preço de Custo (R$):</label>
                    <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required placeholder="0.00">
                </div>
                <div class="col-md-3">
                    <label for="precoVenda" class="form-label">Preço de Venda (R$):</label>
                    <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required placeholder="0.00">
                </div>
                <div class="col-md-3">
                    <label for="dataValidade" class="form-label">Data de Validade:</label>
                    <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                </div>
                <div class="col-md-3">
                    <label for="qtdEstoque" class="form-label">Qtd em Estoque:</label>
                    <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required placeholder="0">
                </div>

                <div class="col-12">
                    <label for="nomeFabricante" class="form-label">Nome do Fabricante:</label>
                    <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required placeholder="Ex: Sony, Samsung, etc.">
                </div>
                
                <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-success btn-lg">Cadastrar Produto</button>
                </div>
            </form>
            <hr class="my-5">

            <h3 class="mb-4 text-secondary">Produtos Cadastrados</h3>
    `);
    if (listaProdutos.length > 0) {
        resposta.write(`
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Cód. Barras</th>
                            <th>Descrição</th>
                            <th>Preço Custo</th>
                            <th>Preço Venda</th>
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
                    <td>R$ ${parseFloat(produto.precoCusto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>R$ ${parseFloat(produto.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
        listaProdutos.push({ codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante });
        console.log("Produto cadastrado com sucesso!");
        resposta.redirect('/cadastrar-produto');
    } else {
        let ultimoacesso = requisicao.cookies?.ultimoacesso;
        const data = new Date();
        resposta.cookie("ultimoacesso", data.toLocaleString("pt-BR"), { maxAge: 900000, httpOnly: true });

        let nomeUsuario = requisicao.session?.dadoslogin?.nomeusuario || "Usuário Logado";
        
        resposta.setHeader("Content-Type", "text/html; charset=utf-8");
    
        resposta.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro no Cadastro</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            ${gerarMenu(nomeUsuario)}
            <div class="container-fluid">
                <div class="d-flex justify-content-between p-3 bg-light border-bottom">
                    <p class="mb-0 text-dark"><strong>Usuário:</strong> ${nomeUsuario}</p>
                    <p class="mb-0 text-secondary"><strong>Último Acesso:</strong> ${ultimoacesso || "Primeiro acesso"}</p>
                </div>
            </div>
            <div class="container mt-4">
                <div class="alert alert-danger" role="alert">
                    <strong>Erro:</strong> Todos os campos do formulário são obrigatórios. Por favor, preencha-os.
                </div>
                <h2 class="mb-4 text-primary">Cadastro de Novo Produto</h2>
                
                <form action="/cadastrar-produto" method="POST" class="row g-3">
                    
                    <div class="col-md-6">
                        <label for="codigoBarras" class="form-label">Código de Barras:</label>
                        <input type="text" class="form-control ${!codigoBarras ? 'is-invalid' : ''}" id="codigoBarras" name="codigoBarras" value="${codigoBarras || ''}" required placeholder="Ex: 7891234567890">
                    </div>
                    <div class="col-md-6">
                        <label for="descricao" class="form-label">Descrição do Produto:</label>
                        <input type="text" class="form-control ${!descricao ? 'is-invalid' : ''}" id="descricao" name="descricao" value="${descricao || ''}" required placeholder="Ex: Notebook Gamer">
                    </div>

                    <div class="col-md-3">
                        <label for="precoCusto" class="form-label">Preço de Custo (R$):</label>
                        <input type="number" step="0.01" class="form-control ${!precoCusto ? 'is-invalid' : ''}" id="precoCusto" name="precoCusto" value="${precoCusto || ''}" required placeholder="0.00">
                    </div>
                    <div class="col-md-3">
                        <label for="precoVenda" class="form-label">Preço de Venda (R$):</label>
                        <input type="number" step="0.01" class="form-control ${!precoVenda ? 'is-invalid' : ''}" id="precoVenda" name="precoVenda" value="${precoVenda || ''}" required placeholder="0.00">
                    </div>
                    <div class="col-md-3">
                        <label for="dataValidade" class="form-label">Data de Validade:</label>
                        <input type="date" class="form-control ${!dataValidade ? 'is-invalid' : ''}" id="dataValidade" name="dataValidade" value="${dataValidade || ''}" required>
                    </div>
                    <div class="col-md-3">
                        <label for="qtdEstoque" class="form-label">Qtd em Estoque:</label>
                        <input type="number" class="form-control ${!qtdEstoque ? 'is-invalid' : ''}" id="qtdEstoque" name="qtdEstoque" value="${qtdEstoque || ''}" required placeholder="0">
                    </div>

                    <div class="col-12">
                        <label for="nomeFabricante" class="form-label">Nome do Fabricante:</label>
                        <input type="text" class="form-control ${!nomeFabricante ? 'is-invalid' : ''}" id="nomeFabricante" name="nomeFabricante" value="${nomeFabricante || ''}" required placeholder="Ex: Sony, Samsung, etc.">
                    </div>
                    
                    <div class="col-12 mt-4">
                        <button type="submit" class="btn btn-success btn-lg">Cadastrar Produto</button>
                    </div>
                </form>

                <hr class="my-5">
                <h3 class="mb-4 text-secondary">Produtos Cadastrados (Exibição)</h3>
        `);
        if (listaProdutos.length > 0) {
            resposta.write(`
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th>Cód. Barras</th>
                                <th>Descrição</th>
                                <th>Preço Custo</th>
                                <th>Preço Venda</th>
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
                        <td>R$ ${parseFloat(produto.precoCusto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ ${parseFloat(produto.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
    }
});
server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
    console.log(`Faça login em http://${host}:${porta}/login com: admin/admin`);
});