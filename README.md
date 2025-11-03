# NFT Manager - Sistema de Gerenciamento de NFTs

Sistema completo para criação e gerenciamento de NFTs com integração IPFS.

## 🚀 Tecnologias

- **React 18** - Framework frontend
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização moderna
- **Lucide React** - Ícones
- **IPFS** - Armazenamento descentralizado (simulado inicialmente)

## 📦 Instalação

```bash
npm install
```

## 🎯 Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Funcionalidades

- ✅ Criação de NFTs com metadados
- ✅ Upload de arquivos (imagens/vídeos)
- ✅ Sistema de atributos customizáveis
- ✅ Armazenamento local (simulado)
- ✅ Gerenciamento de NFTs criadas
- ✅ Interface moderna e responsiva

## 📝 Integração com IPFS Real

O projeto inclui scripts CLI para integração com IPFS daemon local:

### Pré-requisitos

1. **Instalar IPFS no Mac:**
   ```bash
   brew install ipfs
   ```

2. **Inicializar IPFS (apenas primeira vez):**
   ```bash
   ipfs init
   ```

3. **Iniciar IPFS daemon:**
   ```bash
   ipfs daemon
   ```

### Usar os Scripts CLI

```bash
# Verificar conexão
npm run ipfs:check

# Upload de arquivo
npm run ipfs:upload file ./caminho/para/arquivo.jpg

# Upload de JSON
npm run ipfs:upload json ./metadata.json

# Upload de diretório
npm run ipfs:upload dir ./meu-diretorio
```

**Documentação completa:** Veja [`scripts/README.md`](./scripts/README.md)

### Próximos Passos

1. ✅ Scripts CLI criados
2. ✅ Integração com IPFS daemon local
3. 🔄 Integrar scripts com componente React
4. 📋 Integrar com smart contracts (Web3.js/Ethers.js)

## 🎨 Estrutura do Projeto

```
tech-neo-nft/
├── src/
│   ├── components/
│   │   └── NFTManager.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   ├── ipfs-client.js       # Módulo helper IPFS
│   ├── cli-upload.js        # Script CLI principal
│   ├── exemplo-uso.sh       # Exemplos de uso
│   └── README.md            # Documentação dos scripts
├── package.json
├── vite.config.js
└── tailwind.config.js
```

