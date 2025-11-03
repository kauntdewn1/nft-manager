# ⚙️ Configuração do Arquivo .env

## 📋 O Que Preencher

### ✅ Já Configurado (Não Precisa Mudar)

- `IPFS_HOST=localhost` - IPFS local
- `IPFS_PORT=5001` - Porta padrão do IPFS
- `IPFS_PROTOCOL=http` - Protocolo HTTP

### 🔧 Opcional (Pode Deixar como está)

- `ALCHEMY_API_KEY=demo` - Deixe como "demo" se não tiver chave Alchemy
- `ALCHEMY_BASE_URL=...` - Para Monad, você pode deixar como está

### ⚠️ OBRIGATÓRIO (Precisa Preencher)

**`NFT_CONTRACT_ADDRESS=`**

Este é o endereço do seu contrato NFT depois que você fizer o deploy.

**Como obter:**

1. Faça deploy do contrato no Remix IDE
2. Depois do deploy, vai aparecer um endereço tipo: `0x1234567890abcdef...`
3. **COPIE esse endereço**
4. Cole no arquivo `.env`:
   ```
   NFT_CONTRACT_ADDRESS=0xSeuEnderecoAqui
   ```

## 📝 Exemplo Completo

```env
# Alchemy API Key (opcional)
ALCHEMY_API_KEY=demo

# Base URL da Alchemy
ALCHEMY_BASE_URL=https://eth-mainnet.g.alchemy.com/nft/v3

# NFT Contract Address (OBRIGATÓRIO após deploy)
NFT_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# IPFS Settings
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

## ⚡ Depois de Preencher

1. Salve o arquivo `.env`
2. Reinicie o servidor backend:
   ```bash
   npm run server
   ```

## 💡 Dica

Você pode deixar o `NFT_CONTRACT_ADDRESS` vazio por enquanto e colar o endereço direto na interface web quando for fazer o mint!

