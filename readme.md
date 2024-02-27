#Como executar a API:
*Clone o reposítório
*Utilize o comando npm install para instalar as dependências
*Utilize o comando npm run typeorm migration:run -- -d ./src/data-source para rodar as migrações
*criar o arquivo .env e preencher com base no .env.example
*Para iniciar o servidor, utilize o npm run dev

###Como utilizar a rota de recuperação de senha
*acesse sua conta do Gmail e clique em Gerenciar sua conta do Google
*Clique em Segurança
*Habilite a Verificação em duas etapas
*Clique em Senhas de app
*Clique em Selecionar app -> escolha Outro (nome personalizado)
*Escolha um nome de sua escolha (ex: Django E-mail) e clique em GERAR
*Copie a chave que aparecerá na tela para usarmos no .env

##Documentação da API em: <https://biraki.github.io/API-contacts-documentation/>.