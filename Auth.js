import express from "express"; // Express seria facilitar a criaçao de rotas - Instalação dele e feita atraves do node express
import 'dotenv/config'; // Importa variaveis de ambiente do arquivo .env - como codigos de chave de acesso secreta da API para não ficar conectada no front 
import axios from "axios"; // Biblioteca para fazer requisições HTTP - Instalação via npm axios
import qs from "querystring"; // Para montar o corpo x-www-form-urlencoded - usado quando voce envia via POST para apis que não aceitam JSON
import crypto from "crypto";  // Para gerar o parâmetro 'state' aleatório - usado para segurança na autenticação OAuth. Gerar dados seguros e numeros aleatórios de segurança
//_____ROTA DE AUTORIZAÇÃO__COMEÇO DA ROTA//
//Json JSON significa JavaScript Object Notation.
//  É um formato de texto usado pra trocar dados entre sistemas (como cliente ↔ servidor, ou entre APIs).
// Em outras palavras:

//JSON é uma forma padronizada de representar dados de forma leve, legível e fácil de processar por qualquer linguagem.
 

const app = express(); // Cria uma instância do aplicativo Express assignando-a à constante app
const PORT = process.env.PORT || 3000; // Define a porta do servidor a partir da variável de ambiente ou usa a porta 3000 como padrão

// app = é o servidor express que criamos que seria const app = express(); - OBS: PRECISO ENTENDER MELHOR ESSE CODIGO APP *********
//ATENÇÃO NA INFORMAÇÃO ABAIXO SOBRE O app.get

// get → define que essa rota responde a requisições do tipo GET (ou seja, quando o navegador acessa a URL).
//"/authorition" → é o caminho da rota. Quem coloca esse caminho é você, e ele pode ser qualquer coisa que faça sentido para sua aplicação.
//(req, res) → são os objetos de requisição (req) e resposta (res) do Express. req contém informações sobre a requisição feita pelo cliente, e res é usado para enviar a resposta de volta ao cliente.
// => { ... } → é a função que será executada quando essa rota for acessada. Dentro dessa função, você pode colocar o código que define o que deve acontecer quando alguém acessa essa rota.
app.get("/Bling", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = `${process.env.AUTH_URL}?response_type=code&client_id=${process.env.CLIENT_ID}&state=${state}&redirect_uri=${process.env.REDIRECT_URI}`;


  console.log("🔗 Redirecionando para:", authUrl);
  res.redirect(authUrl);
});

//Informações sobre o codgio acima
// o que seria AUTHURL - ATENÇÃO ESTUDAR SOBRE ISSO
// AUTHURL SERIA URL DA BLING DE AUTORIZAÇÃO(EXEMPLO): https://bling.com.br/Authorization
//Declara uma constante chamada authUrl - Armazena dentro dela um valor (no caso, uma URL)
//Você está criando uma variável com nome authUrl Essa variável não pode ser reatribuída (por causa do const) O valor que ficará armazenado dentro dela representa uma URL de autenticação (auth + url → authUrl)
// LINHA N° 27 DO CODIGO SIGNIFICA  Essa linha monta a URL de autorização da API do Bling (ou outro serviço OAuth2).

//Vamos quebrar ela:

//process.env.TOKEN_URL → vem do arquivo .env, onde você guarda variáveis de ambiente (seguras e privadas).
//Exemplo:

//TOKEN_URL=https://bling.com.br/Authorization
//CLIENT_ID=1234567890abcdef


//response_type=code → informa ao servidor do Bling que você quer um authorization code (código temporário usado para obter o token de acesso).

//client_id=${process.env.CLIENT_ID} → identifica seu aplicativo registrado no Bling.

//state=${state} → é o token aleatório de segurança gerado acima.

//Em resumo:
//Essa linha monta a URL completa para redirecionar o usuário ao Bling, passando todos os parâmetros necessários.


//_____ROTA DE AUTORIZAÇÃO__FIM DA ROTA//






app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
}); // Inicia o servidor na porta definida e exibe uma mensagem no console indicando que o servidor está rodando
