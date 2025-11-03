# 🚀 NEØ.MINT - Sistema Completo de Criação e Mint de NFTs

Sistema automatizado completo para criar, fazer upload no IPFS e mintar NFTs na blockchain.

## ✨ O Que Foi Criado

### 1. **Sistema de Drafts JSON**
- Templates em `drafts/` para preencher dados da NFT
- Formato simples e intuitivo
- Suporte a atributos customizados

### 2. **Script CLI Completo** (`scripts/mint.js`)
- Upload automático de imagem para IPFS
- Criação e upload de metadados
- Preparação para mint na blockchain
- Geração de embeds e links OpenSea

### 3. **Interface Web de Mint** (`src/components/MintInterface.jsx`)
- Conexão com MetaMask
- Seleção de rede blockchain
- Mint direto pela interface
- Status e confirmação de transações

### 4. **Smart Contract ERC-721** (`scripts/contracts/NFT.sol`)
- Contrato completo e testado
- Suporte a mint único e em lote
- Configurações customizáveis

## 🎯 Como Usar

### Opção 1: Via Interface Web (Mais Fácil)

1. **Criar NFT no IPFS:**
   - Preencha o formulário no frontend
   - Faça upload da imagem
   - Clique em "Criar NFT no IPFS"
   - **Copie o CID dos metadados**

2. **Fazer Mint:**
   - Vá para a aba "Mint NFT na Blockchain"
   - Conecte sua MetaMask
   - Escolha a rede (Mumbai para teste)
   - Cole o CID dos metadados
   - Configure o endereço do contrato
   - Clique em "Mintar NFT"

### Opção 2: Via CLI (Mais Automatizado)

1. **Criar Draft:**
```bash
# Copie o template
cp drafts/template.json drafts/minha-nft.json

# Edite o arquivo
nano drafts/minha-nft.json
```

2. **Executar Mint Completo:**
```bash
# Mint completo (upload + preparação)
npm run mint -- --file=drafts/minha-nft.json --network=mumbai
```

3. **Copiar Token URI e fazer mint pela interface web**

## 📋 Exemplo Completo

### 1. Criar Draft

```json
{
  "name": "Flow Reborn – Ritual 03:25",
  "description": "Miniatura emocional do setup",
  "image": "./images/flow-reborn.jpg",
  "external_url": "https://neoflow.site/ritual",
  "attributes": [
    { "trait_type": "Hora", "value": "03:25" },
    { "trait_type": "Setup", "value": "NEØ Original" }
  ]
}
```

### 2. Executar

```bash
npm run mint -- --file=drafts/flowreborn-exemplo.json --network=mumbai
```

### 3. Resultado

```
✅ Imagem enviada! CID: QmXxx...
✅ Metadados enviados! CID: QmYyy...

✨ NFT Criada com Sucesso!

📋 Informações:
   Nome: Flow Reborn – Ritual 03:25
   CID Imagem: QmXxx...
   CID Metadados: QmYyy...
   Token URI: ipfs://QmYyy...

🔗 Links:
   IPFS Metadata: https://ipfs.io/ipfs/QmYyy...
   OpenSea: https://testnets.opensea.io/...
   Explorer: https://mumbai.polygonscan.com/...
```

## 🔧 Configuração do Contrato

### Deploy do Contrato

1. **Via Remix IDE:**
   - Acesse https://remix.ethereum.org
   - Cole o código de `scripts/contracts/NFT.sol`
   - Compile e deploy na rede desejada
   - Copie o endereço do contrato

2. **Configurar no Sistema:**
   - Cole o endereço no componente `MintInterface.jsx`
   - Ou configure variável de ambiente: `NFT_CONTRACT_ADDRESS`

## 🌐 Redes Suportadas

- **Mumbai** (Polygon Testnet) - Teste grátis
- **Polygon Mainnet** - Barato (~$0.01)
- **Base** - Barato
- **Ethereum Mainnet** - Caro (~$50-200)

## 📁 Estrutura de Arquivos

```
tech-neo-nft/
├── drafts/                      # Seus drafts JSON aqui
│   ├── template.json
│   └── flowreborn-exemplo.json
├── images/                      # Imagens das NFTs
├── scripts/
│   ├── mint.js                 # Script CLI principal
│   ├── contracts/
│   │   └── NFT.sol             # Contrato ERC-721
│   └── MINT_README.md          # Documentação detalhada
├── outputs/                     # Resultados salvos
└── src/components/
    └── MintInterface.jsx       # Interface web de mint
```

## 🎨 Embed no Site

Após o mint, você recebe código de embed:

```html
<iframe
  src="https://testnets.opensea.io/assets/mumbai/SEU_CONTRATO/TOKEN_ID"
  width="500"
  height="600"
  frameborder="0">
</iframe>
```

## 🔄 Fluxo Completo

```
1. Preencher JSON (drafts/)
   ↓
2. Executar: npm run mint
   ↓
3. Upload imagem → IPFS
   ↓
4. Criar metadata → IPFS
   ↓
5. Receber Token URI
   ↓
6. Mint na blockchain (interface web)
   ↓
7. NFT na sua wallet! 🎉
```

## 📚 Próximos Passos

1. ✅ Sistema de drafts criado
2. ✅ Script CLI funcionando
3. ✅ Interface web integrada
4. ✅ Contrato ERC-721 pronto
5. 🔄 Deploy do contrato (próximo passo)
6. 🔄 Primeiro mint!

## 💡 Dicas

- Use **Mumbai Testnet** primeiro para testar sem custos
- Guarde todos os CIDs e Token URIs
- Os arquivos em `outputs/` contêm todas as informações
- Use `--dry-run` para testar sem fazer upload real

---

**Pronto para criar sua primeira NFT?** 🚀

