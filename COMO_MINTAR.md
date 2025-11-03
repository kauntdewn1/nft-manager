# 🎯 COMO MINTAR - Passo a Passo Simples

## ✅ O QUE VOCÊ JÁ TEM

- ✅ NFT criada no IPFS
- ✅ CID dos Metadados: `QmQM5en7zkG986WAuHHSay4fgqjjpp482EqTasDTBhFrNg`
- ✅ Backend rodando
- ✅ Frontend pronto

## ❌ O QUE VOCÊ PRECISA

1. **Contrato NFT deployado na Monad Testnet**
2. **Tokens MON de teste na sua wallet**

---

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ Abrir o Site

1. Abra seu navegador
2. Vá para: `http://localhost:3000`
3. Se não abrir, rode: `npm run dev`

### 2️⃣ Ir para Aba "Mint"

1. No topo da página, clique na aba **"Mint"**
2. Você verá o formulário de mint

### 3️⃣ Conectar MetaMask

1. Clique no botão **"Conectar MetaMask"**
2. A MetaMask vai abrir
3. Escolha sua conta e clique em **"Conectar"**
4. Se aparecer para adicionar Monad Testnet, clique em **"Aprovar"**

### 4️⃣ Preencher os Campos

**Campo 1: Rede Blockchain**
- Já está selecionado: **"Monad Testnet"**
- Não precisa mudar nada

**Campo 2: Endereço do Contrato NFT**
- Você precisa colar aqui o endereço do contrato
- Se não tem, veja como fazer abaixo ⬇️

**Campo 3: Token URI (CID IPFS)**
- Cole este código aqui:
```
ipfs://QmQM5en7zkG986WAuHHSay4fgqjjpp482EqTasDTBhFrNg
```

### 5️⃣ Clicar em "Mintar NFT"

1. Preencha todos os campos
2. Clique no botão **"Mintar NFT"**
3. A MetaMask vai abrir para confirmar
4. Clique em **"Confirmar"**
5. Aguarde a confirmação!

---

## 🔧 SE VOCÊ NÃO TEM O CONTRATO NFT

### Como Deployar o Contrato (Remix IDE)

1. **Abrir Remix**
   - Vá para: https://remix.ethereum.org

2. **Criar Arquivo**
   - Clique em "File Explorer" (lado esquerdo)
   - Clique no ícone de "+" 
   - Nome: `NFT.sol`

3. **Copiar Código do Contrato**
   - Abra o arquivo `scripts/contracts/NFT.sol` no seu projeto
   - Copie TODO o código
   - Cole no Remix

4. **Compilar**
   - Vá para aba "Solidity Compiler"
   - Escolha versão: **0.8.20 ou superior**
   - Clique em **"Compile NFT.sol"**
   - Aguarde compilar (deve ficar verde ✓)

5. **Deploy**
   - Vá para aba **"Deploy & Run Transactions"**
   - Em "Environment": escolha **"Injected Provider - MetaMask"**
   - Na MetaMask: **Troque para Monad Testnet**
   - Em "CONTRACT": escolha **"NFT - contracts/NFT.sol"**
   - No campo **"_name"**: escreva `NEØ NFT`
   - No campo **"_symbol"**: escreva `NEØ`
   - No campo **"_baseURI"**: escreva `ipfs://`
   - Clique em **"Deploy"**
   - Confirme na MetaMask

6. **Copiar Endereço**
   - Depois do deploy, vai aparecer um endereço tipo: `0x1234...5678`
   - **COPIE ESSE ENDERECO**
   - Cole no campo "Endereço do Contrato NFT" na interface

---

## 💰 SE VOCÊ NÃO TEM TOKENS MON

1. Vá para: https://www.monad-claims.info/
2. Conecte sua MetaMask
3. Solicite tokens de teste
4. Aguarde receber

---

## 📝 RESUMO RÁPIDO

```
1. Abrir: http://localhost:3000
2. Clicar: Aba "Mint"
3. Conectar: MetaMask
4. Colar Token URI: ipfs://QmQM5en7zkG986WAuHHSay4fgqjjpp482EqTasDTBhFrNg
5. Colar Endereço do Contrato: (do Remix)
6. Clicar: "Mintar NFT"
7. Confirmar: Na MetaMask
8. Pronto! 🎉
```

---

## ❓ PROBLEMAS?

**"Erro ao conectar MetaMask"**
- Instale MetaMask: https://metamask.io/

**"Rede incorreta"**
- O sistema adiciona automaticamente
- Ou troque manualmente na MetaMask para Monad Testnet

**"Não tenho tokens"**
- Use o faucet: https://www.monad-claims.info/

**"Não sei deployar contrato"**
- Siga o passo 5 acima ⬆️

