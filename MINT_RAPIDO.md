# ⚡ MINT RÁPIDO - 3 Passos

## Seu NFT já está pronto! 

**Metadata CID:** `QmRyWFUpveQe7eXMWyQmdebJ5yovMCqBQHBs8tUvq8dN1Z`  
**Token URI:** `ipfs://QmRyWFUpveQe7eXMWyQmdebJ5yovMCqBQHBs8tUvq8dN1Z`

---

## 🎯 OPÇÃO 1: Via Interface Web (Mais Fácil)

1. Abra: http://localhost:3000
2. Clique em "Mint" (aba)
3. Cole este CID: `QmRyWFUpveQe7eXMWyQmdebJ5yovMCqBQHBs8tUvq8dN1Z`
4. Conecte MetaMask
5. Clique em "Mint NFT"
6. ✅ Pronto!

---

## 🎯 OPÇÃO 2: Via Remix IDE (Direto no Contrato)

1. Acesse: https://remix.ethereum.org
2. Cole o contrato: `scripts/contracts/NFT.sol`
3. Compile (compilador 0.8.20+)
4. Deploy na Monad Testnet (Chain ID: 41400)
5. No contrato deployado, chame:
   - Função: `mint`
   - `to`: Seu endereço MetaMask
   - `tokenURI`: `ipfs://QmRyWFUpveQe7eXMWyQmdebJ5yovMCqBQHBs8tUvq8dN1Z`
6. ✅ Pronto!

---

## 🎯 OPÇÃO 3: Via MetaMask Direto (Se tiver contrato deployado)

1. Abra MetaMask → Enviar
2. Envie transação para o contrato com dados:
   - Função: `mint(address,string)`
   - Parâmetros: seu endereço + `ipfs://QmRyWFUpveQe7eXMWyQmdebJ5yovMCqBQHBs8tUvq8dN1Z`
3. ✅ Pronto!

---

**Se precisar do endereço do contrato, faça deploy primeiro no Remix ou me avise!**

