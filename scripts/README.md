# Scripts CLI para IPFS

Scripts de linha de comando para integrar com o IPFS daemon local no Mac.

## 📦 Instalação

Certifique-se de ter as dependências instaladas:

```bash
npm install
```

## 🔧 Pré-requisitos

1. **IPFS instalado no Mac:**
   ```bash
   brew install ipfs
   ```

2. **IPFS inicializado (apenas primeira vez):**
   ```bash
   ipfs init
   ```

3. **IPFS daemon rodando:**
   ```bash
   ipfs daemon
   ```

   O daemon deve estar rodando em `http://localhost:5001`

## 🚀 Uso

### Verificar conexão com IPFS

```bash
npm run ipfs:check
# ou
node scripts/cli-upload.js check
```

### Fazer upload de um arquivo

```bash
npm run ipfs:upload file ./caminho/para/arquivo.jpg
# ou
node scripts/cli-upload.js file ./caminho/para/arquivo.jpg
```

**Exemplo:**
```bash
npm run ipfs:upload file ./images/nft-001.png
```

### Fazer upload de um arquivo JSON

```bash
npm run ipfs:upload json ./metadata.json
# ou
node scripts/cli-upload.js json ./metadata.json
```

**Exemplo:**
```bash
npm run ipfs:upload json ./nft-metadata.json
```

### Fazer upload de um diretório completo

```bash
npm run ipfs:upload dir ./meu-diretorio
# ou
node scripts/cli-upload.js dir ./meu-diretorio
```

### Opções avançadas

Você pode especificar host, porta e protocolo diferentes:

```bash
# IPFS remoto ou porta customizada
node scripts/cli-upload.js file arquivo.jpg \
  --host localhost \
  --port 5001 \
  --protocol http
```

## 📝 Exemplos Práticos

### 1. Upload de uma imagem NFT

```bash
npm run ipfs:upload file ./assets/nft-image.png
```

**Saída:**
```
✓ Conectado ao IPFS daemon v0.XX.X
📤 Lendo arquivo: ./assets/nft-image.png...
📤 Fazendo upload para IPFS...
✅ Arquivo enviado com sucesso!
   CID: QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Tamanho: 245678 bytes

🎉 Upload concluído!
Hash IPFS: QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
URL IPFS: ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Gateway: https://ipfs.io/ipfs/QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Upload de metadados JSON

Crie um arquivo `metadata.json`:
```json
{
  "name": "Minha NFT #001",
  "description": "Uma NFT incrível",
  "image": "ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "attributes": [
    {
      "trait_type": "Cor",
      "value": "Azul"
    }
  ]
}
```

Depois faça upload:
```bash
npm run ipfs:upload json ./metadata.json
```

### 3. Verificar se IPFS está rodando

```bash
npm run ipfs:check
```

## 🔗 Integração com NFT Manager

Os scripts podem ser chamados programaticamente do componente React:

```javascript
// No componente NFTManager.jsx, você pode usar:
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function uploadToIPFSReal(filePath) {
  const { stdout } = await execAsync(
    `node scripts/cli-upload.js file "${filePath}"`
  );
  // Extrair CID do output
  const cidMatch = stdout.match(/Hash IPFS: (.+)/);
  return cidMatch ? cidMatch[1] : null;
}
```

## 🐛 Troubleshooting

### Erro: "IPFS daemon não está acessível"

**Solução:** Inicie o daemon IPFS:
```bash
ipfs daemon
```

### Erro: "Cannot find module 'ipfs-http-client'"

**Solução:** Instale as dependências:
```bash
npm install
```

### Erro: "Connection refused"

**Solução:** Verifique se o IPFS está rodando na porta correta:
```bash
ipfs config Addresses.API
# Deve mostrar: /ip4/127.0.0.1/tcp/5001
```

## 📚 Arquivos

- `ipfs-client.js` - Módulo helper com funções para comunicação IPFS
- `cli-upload.js` - Script CLI principal com comandos
- `README.md` - Esta documentação

