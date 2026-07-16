# Raylib & node-raylib PT-BR Documentation

Um site de documentação moderno, responsivo e totalmente traduzido para Português Brasileiro, cobrindo as funções da biblioteca **Raylib** (C/C++) e do seu wrapper **node-raylib** (Node.js/JavaScript).

## 🚀 Funcionalidades

* **Duas Linguagens em Um Lugar**: Acesse as assinaturas de C e JS (node-raylib) alternando facilmente com abas dinâmicas.
* **Busca Rápida**: Pressione `Ctrl+K` para buscar rapidamente por funções (fuzzy search instantânea no cliente).
* **Tradução via NLP**: Os arquivos Markdown base da Raylib são convertidos e traduzidos dinamicamente por um script (RegExp/NLP), permitindo gerar a documentação a qualquer momento sem "hardcoding".
* **Dark Mode Nativo**: Tema escuro por padrão, com suporte a "glassmorphism" e alternador Light/Dark.
* **Exemplos de Código**: Exemplos práticos integrados nas funções principais para iniciantes (`InitWindow`, `DrawText`, etc).

## 📁 Estrutura de Pastas

* `/src/`: Contém os arquivos Markdown brutos originais do repositório da Raylib (`.md`).
* `/scripts/`: Contém `build_data.js` (o parser) e `translator.js` (dicionário RegExp PT-BR) responsáveis por gerar a base de dados.
* `/public/`: Contém o site (HTML, CSS, JS estáticos). É o diretório ideal para hospedar em plataformas como GitHub Pages ou Vercel.

## 🛠️ Como Gerar os Dados (Build)

Se você atualizar os arquivos em `src/` ou as regras de tradução em `scripts/translator.js`, precisará regerar o banco de dados que alimenta o site.
Para fazer isso, é necessário ter o Node.js instalado e rodar:

```bash
node scripts/build_data.js
```
Isso irá recriar o arquivo `public/data.js`.

## 🌐 Como Rodar o Site

Como o site é puramente front-end estático sem dependências e o motor de busca roda direto no navegador, não é preciso nenhum servidor.

Basta abrir `public/index.html` em qualquer navegador!

## 📜 Créditos e Direitos Autorais

Todos os direitos e créditos são para:

* **Documentação Oficial Raylib e seus criadores**: https://www.raylib.com/
* **Node-raylib (Porte para Node.js)**: [@RobLoach/node-raylib](https://github.com/RobLoach/node-raylib)

Este projeto é uma tradução simplificada e reorganização da documentação oficial para o português brasileiro. Toda a propriedade intelectual, conceitos e conteúdo original pertencem aos criadores e mantenedores do Raylib.
