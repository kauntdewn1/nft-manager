# 🚀 Guia Rápido para Mint na Monad Testnet

## ✅ Checklist Antes de Mintar

- [ ] IPFS daemon rodando (`ipfs daemon`)
- [ ] Backend rodando (`npm run server`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Contrato NFT deployado na Monad Testnet
- [ ] MetaMask conectado à Monad Testnet
- [ ] Tokens MON de teste na wallet

## 📋 Passo a Passo para Mintar

### Opção 1: Mint Rápido (via Interface Web)

#### 1. Criar NFT no IPFS

1. Acesse `http://localhost:3000`
2. Vá para a aba **"Criar NFT"**
3. Preencha:
   - Nome da NFT
   - Descrição
   - Faça upload da imagem
   - Adicione atributos (opcional)
4. Clique em **"Criar NFT no IPFS"**
5. **COPIE o CID dos metadados** (aparece após criação)

#### 2. Fazer Mint na Blockchain

1. Vá para a aba **"Mint"**
2. Conecte sua MetaMask:
   - Clique em "Conectar MetaMask"
   - Se não tiver Monad Testnet, o sistema adiciona automaticamente
3. Configure:
   - Rede: **Monad Testnet** (já está selecionada)
   - Token URI: Cole o CID dos metadados (ex: `QmNwMh5NQWknMCyqG6h8MS8xZkevNCEE5eBCukxhrDw8Tn`)
   - Endereço do Contrato: Cole o endereço do seu contrato NFT deployado
4. Clique em **"Mintar NFT"**
5. Confirme a transação na MetaMask
6. Aguarde confirmação!

### Opção 2: Mint via CLI (Automatizado)

```bash
# 1. Criar/editar draft
cp drafts/template.json drafts/minha-nft.json
# Edite o arquivo com seus dados

# 2. Executar mint completo
npm run mint -- --file=drafts/minha-nft.json --network=monad

# Isso vai:
# - Upload da imagem para IPFS
# - Upload dos metadados para IPFS
# - Mostrar o Token URI
# - Depois você faz o mint pela interface web
```

## 🔧 Deploy do Contrato NFT (Se ainda não fez)

### Via Remix IDE (Mais Fácil)

1. Acesse https://remix.ethereum.org
2. Crie novo arquivo `NFT.sol`
3. Cole o código de `scripts/contracts/NFT.sol`
4. Compile o contrato (Solidity 0.8.20+)
5. Vá para aba "Deploy & Run"
6. Selecione **"Injected Provider - MetaMask"**
7. **Troque para Monad Testnet** na MetaMask
8. Configure:
   - Name: `NEØ NFT`
   - Symbol: `NEØ`
   - Base URI: `ipfs://`
9. Clique em **"Deploy"**
10. **COPIE o endereço do contrato** deployado
11. Cole na interface de mint

## 💰 Obter Tokens MON de Teste

1. Acesse o faucet: https://www.monad-claims.info/
2. Conecte sua wallet
3. Solicite tokens de teste
4. Aguarde confirmação

## ⚠️ Problemas Comuns

### "Backend não está rodando"
```bash
npm run server
```

### "IPFS não está acessível"
```bash
# Verificar se está rodando
npm run ipfs:check

# Se não estiver, iniciar:
ipfs daemon
```

### "Rede incorreta na MetaMask"
- O sistema adiciona automaticamente
- Ou adicione manualmente:
  - Chain ID: `10143`
  - RPC: `https://testnet-rpc.monad.xyz`
  - Explorer: `https://testnet.monadexplorer.com`

### "Contrato não encontrado"
- Verifique se o endereço está correto
- Certifique-se que o contrato foi deployado na Monad Testnet
- Verifique no explorer: https://testnet.monadexplorer.com

## 🎉 Após o Mint

Após o mint bem-sucedido, você terá:
- ✅ Token ID da NFT
- ✅ Hash da transação
- ✅ Link para o explorer
- ✅ NFT na sua wallet MetaMask!

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Verifique os logs do backend
2. Verifique o console do navegador (F12)
3. Verifique se todas as dependências estão rodando

