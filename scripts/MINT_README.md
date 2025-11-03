# 🚀 NEØ.MINT - Sistema Completo de Mint de NFTs

Sistema automatizado para criar, fazer upload no IPFS e mintar NFTs na blockchain.

## 📋 Fluxo Completo

```
1. Preencher JSON → 2. Upload IPFS → 3. Mint Blockchain → 4. Embed & Links
```

## 🎯 Como Usar

### 1. Criar Draft JSON

Crie um arquivo em `drafts/nome-da-nft.json`:

```json
{
  "name": "Minha NFT",
  "description": "Descrição da NFT",
  "image": "./images/minha-imagem.jpg",
  "external_url": "https://meu-site.com",
  "attributes": [
    { "trait_type": "Cor", "value": "Azul" }
  ]
}
```

### 2. Executar Mint Completo

```bash
# Mint completo (upload + mint)
npm run mint -- --file=drafts/nome-da-nft.json

# Apenas simular (dry-run)
npm run mint -- --file=drafts/nome-da-nft.json --dry-run

# Pular upload (usar CIDs existentes)
npm run mint -- --file=drafts/nome-da-nft.json --skip-upload
```

### 3. Escolher Rede Blockchain

```bash
# Mumbai Testnet (teste grátis)
npm run mint -- --file=drafts/nome.json --network=mumbai

# Polygon Mainnet (barato)
npm run mint -- --file=drafts/nome.json --network=polygon

# Ethereum Mainnet (caro)
npm run mint -- --file=drafts/nome.json --network=ethereum

# Base
npm run mint -- --file=drafts/nome.json --network=base
```

## 📁 Estrutura de Arquivos

```
tech-neo-nft/
├── drafts/
│   ├── template.json          # Template para criar NFTs
│   └── flowreborn-exemplo.json # Exemplo completo
├── images/                    # Suas imagens aqui
├── scripts/
│   ├── mint.js                # Script principal de mint
│   └── contracts/
│       └── NFT.sol            # Contrato ERC-721
└── outputs/                   # Resultados salvos aqui
```

## 🔧 Configuração

### 1. Deploy do Contrato NFT

**Opção A: Usar Remix IDE**
1. Abra https://remix.ethereum.org
2. Copie `scripts/contracts/NFT.sol`
3. Compile e deploy na rede desejada
4. Copie o endereço do contrato

**Opção B: Usar Hardhat/Truffle**
```bash
# Em breve: scripts de deploy automatizado
```

### 2. Configurar Endereço do Contrato

Crie arquivo `.env`:
```bash
NFT_CONTRACT_ADDRESS=0xSeuContratoAqui
```

Ou configure no componente React `MintInterface.jsx`.

## 🎨 Interface Web

A interface web está integrada no NFT Manager:

1. Acesse `http://localhost:3000`
2. Conecte sua MetaMask
3. Escolha a rede (Mumbai para testes)
4. Cole o Token URI (CID IPFS dos metadados)
5. Configure o endereço do contrato
6. Clique em "Mintar NFT"

## 📝 Exemplo Completo

### Passo 1: Criar Draft

```bash
# Criar arquivo
cat > drafts/minha-nft.json << EOF
{
  "name": "NFT Teste",
  "description": "Minha primeira NFT",
  "image": "./images/teste.png",
  "attributes": [
    { "trait_type": "Tipo", "value": "Arte" }
  ]
}
EOF
```

### Passo 2: Executar

```bash
npm run mint -- --file=drafts/minha-nft.json --network=mumbai
```

### Passo 3: Resultado

O script retorna:
- ✅ CID da imagem no IPFS
- ✅ CID dos metadados no IPFS
- ✅ Token URI para mint
- ✅ Código embed para OpenSea
- ✅ Links para explorer e OpenSea

## 🔗 Links Úteis

- **IPFS Gateway**: https://ipfs.io/ipfs/{CID}
- **OpenSea Mumbai**: https://testnets.opensea.io/assets/mumbai/{CONTRATO}/{TOKEN_ID}
- **PolygonScan**: https://mumbai.polygonscan.com/tx/{TX_HASH}

## 🎯 Próximos Passos

1. Deploy do contrato NFT
2. Configurar endereço do contrato
3. Criar seus drafts JSON
4. Fazer mint!

## 💡 Dicas

- Use **Mumbai Testnet** primeiro para testar sem custos
- Guarde os arquivos em `outputs/` para referência
- Use `--dry-run` para testar sem fazer mint real
- O embed do OpenSea funciona automaticamente após mint

## 🐛 Troubleshooting

**Erro: "MetaMask não encontrado"**
→ Instale a extensão MetaMask

**Erro: "Rede incorreta"**
→ Troque para a rede correta na MetaMask

**Erro: "Contrato não encontrado"**
→ Verifique o endereço do contrato

**Erro: "IPFS daemon não acessível"**
→ Certifique-se que `ipfs daemon` está rodando

