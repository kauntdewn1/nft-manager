# 🚀 NEØ.MINT - NFT Manager Completo

Sistema completo para criação, gerenciamento e mint de NFTs com integração IPFS real e blockchain.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalidades

- ✅ **Criação de NFTs** com interface web moderna
- ✅ **Upload real para IPFS** (daemon local)
- ✅ **Gerenciamento de metadados** e atributos
- ✅ **Mint na blockchain** (Polygon, Ethereum, Base)
- ✅ **Scripts CLI** para automação completa
- ✅ **Smart Contract ERC-721** incluído
- ✅ **Interface MetaMask** integrada

## 🎯 Demonstração

Acesse [http://localhost:3000](http://localhost:3000) após iniciar o servidor.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- IPFS instalado (`brew install ipfs`)
- MetaMask (para mint)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/kauntdewn1/nft-manager.git
cd nft-manager

# Instalar dependências
npm install

# Inicializar IPFS (primeira vez)
ipfs init

# Iniciar IPFS daemon (em outro terminal)
ipfs daemon
```

### Executar

```bash
# Iniciar frontend + backend
npm run dev:full

# Ou separadamente:
npm run dev      # Frontend (porta 3000)
npm run server   # Backend (porta 3001)
```

## 📋 Uso

### Criar NFT via Interface Web

1. Preencha o formulário de criação
2. Faça upload da imagem
3. Adicione atributos (opcional)
4. Clique em "Criar NFT no IPFS"
5. Copie o CID dos metadados
6. Use na interface de Mint para mintar na blockchain

### Criar NFT via CLI

```bash
# 1. Criar draft JSON
cp drafts/template.json drafts/minha-nft.json
# Edite o arquivo com seus dados

# 2. Executar mint completo
npm run mint -- --file=drafts/minha-nft.json --network=mumbai
```

### Fazer Mint na Blockchain

1. Acesse a aba "Mint NFT na Blockchain"
2. Conecte sua MetaMask
3. Escolha a rede (Mumbai para teste)
4. Cole o Token URI (CID IPFS)
5. Configure o endereço do contrato
6. Clique em "Mintar NFT"

## 🌐 Redes Suportadas

- **Mumbai** (Polygon Testnet) - Teste grátis
- **Polygon Mainnet** - Barato (~$0.01)
- **Base** - Barato
- **Ethereum Mainnet** - Caro (~$50-200)

## 📁 Estrutura do Projeto

```
tech-neo-nft/
├── src/
│   ├── components/
│   │   ├── NFTManager.jsx      # Interface principal
│   │   └── MintInterface.jsx   # Interface de mint
│   └── main.jsx
├── server/
│   └── index.js                # Backend Express + IPFS
├── scripts/
│   ├── mint.js                 # Script CLI de mint
│   ├── ipfs-client.js          # Cliente IPFS
│   ├── cli-upload.js           # CLI de upload
│   └── contracts/
│       └── NFT.sol             # Smart Contract ERC-721
├── drafts/                     # Templates JSON
│   ├── template.json
│   └── flowreborn-exemplo.json
└── outputs/                    # Resultados salvos
```

## 🔧 Scripts Disponíveis

```bash
npm run dev           # Iniciar frontend
npm run server        # Iniciar backend
npm run dev:full      # Frontend + Backend
npm run ipfs:check    # Verificar conexão IPFS
npm run ipfs:upload   # Upload via CLI
npm run mint          # Mint completo via CLI
```

## 📚 Documentação

- [README_MINT.md](./README_MINT.md) - Guia completo de mint
- [scripts/MINT_README.md](./scripts/MINT_README.md) - Documentação técnica
- [scripts/README.md](./scripts/README.md) - Scripts CLI

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Express.js, IPFS HTTP Client
- **Blockchain**: Ethers.js, Solidity
- **Storage**: IPFS (daemon local)

## 📝 Smart Contract

O projeto inclui um contrato ERC-721 completo em `scripts/contracts/NFT.sol`.

**Deploy:**
1. Abra [Remix IDE](https://remix.ethereum.org)
2. Cole o código do contrato
3. Compile e deploy na rede desejada
4. Configure o endereço no sistema

## 🔄 Fluxo Completo

```
1. Criar Draft JSON (drafts/)
   ↓
2. Upload Imagem → IPFS
   ↓
3. Criar Metadata → IPFS
   ↓
4. Receber Token URI
   ↓
5. Mint na Blockchain
   ↓
6. NFT na sua Wallet! 🎉
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**NEØ** - [GitHub](https://github.com/kauntdewn1)

## 🙏 Agradecimentos

- IPFS por armazenamento descentralizado
- OpenZeppelin pelos contratos base
- Comunidade web3

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
