import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// Importar funções do módulo IPFS
import { create } from 'ipfs-http-client';
import { readFile, writeFile, unlink } from 'fs/promises';
import chalk from 'chalk';

// Helper para criar cliente IPFS
async function createIPFSClient() {
  try {
    const ipfs = create({
      host: 'localhost',
      port: 5001,
      protocol: 'http',
      timeout: 30000
    });
    const version = await ipfs.version();
    return ipfs;
  } catch (error) {
    throw new Error(`Erro ao conectar ao IPFS: ${error.message}`);
  }
}

// Funções de upload
async function uploadFileToIPFS(filePath) {
  const ipfs = await createIPFSClient();
  const fileBuffer = await readFile(filePath);
  const result = await ipfs.add(fileBuffer, { pin: true });
  return result.cid.toString();
}

async function uploadJSONToIPFS(jsonData) {
  const ipfs = await createIPFSClient();
  const jsonString = JSON.stringify(jsonData, null, 2);
  const jsonBuffer = Buffer.from(jsonString, 'utf-8');
  const result = await ipfs.add(jsonBuffer, { pin: true });
  return result.cid.toString();
}

async function checkIPFSConnection() {
  try {
    const ipfs = await createIPFSClient();
    await ipfs.version();
    return true;
  } catch (error) {
    return false;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// Rota de saúde
app.get('/health', async (req, res) => {
  try {
    const isConnected = await checkIPFSConnection();
    res.json({ 
      status: 'ok', 
      ipfs: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'error', 
      ipfs: 'disconnected',
      error: error.message 
    });
  }
});

// Rota para upload de arquivo
app.post('/api/ipfs/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Salvar arquivo temporariamente
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `ipfs-upload-${Date.now()}-${req.file.originalname}`);
    
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Fazer upload para IPFS
    const cid = await uploadFileToIPFS(tempFilePath);

    // Limpar arquivo temporário
    await fs.unlink(tempFilePath).catch(() => {});

    res.json({
      success: true,
      cid: cid,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      ipfsUrl: `ipfs://${cid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer upload para IPFS', 
      message: error.message 
    });
  }
});

// Rota para upload de metadados JSON
app.post('/api/ipfs/upload-json', async (req, res) => {
  try {
    const jsonData = req.body;

    if (!jsonData || typeof jsonData !== 'object') {
      return res.status(400).json({ error: 'Dados JSON inválidos' });
    }

    // Fazer upload para IPFS
    const cid = await uploadJSONToIPFS(jsonData);

    res.json({
      success: true,
      cid: cid,
      ipfsUrl: `ipfs://${cid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`
    });
  } catch (error) {
    console.error('Erro no upload de JSON:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer upload de JSON para IPFS', 
      message: error.message 
    });
  }
});

// Rota para criar NFT usando CID existente
app.post('/api/ipfs/create-nft-from-cid', async (req, res) => {
  try {
    const { name, description, attributes, imageCid, metadataCid } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da NFT é obrigatório' });
    }

    if (!imageCid && !metadataCid) {
      return res.status(400).json({ error: 'É necessário fornecer imageCid ou metadataCid' });
    }

    let finalMetadataCid = metadataCid;
    let fileCid = imageCid;

    // Se apenas imageCid foi fornecido, criar metadados
    if (imageCid && !metadataCid) {
      const metadata = {
        name: name,
        description: description || '',
        image: `ipfs://${imageCid}`,
        attributes: attributes ? (typeof attributes === 'string' ? JSON.parse(attributes) : attributes) : [],
        created_at: new Date().toISOString(),
        external_url: ''
      };

      finalMetadataCid = await uploadJSONToIPFS(metadata);
      fileCid = imageCid;
    }

    res.json({
      success: true,
      fileCid: fileCid,
      metadataCid: finalMetadataCid,
      fileName: name + '.json',
      metadata: {
        name: name,
        description: description || '',
        image: `ipfs://${fileCid}`,
        attributes: attributes ? (typeof attributes === 'string' ? JSON.parse(attributes) : attributes) : [],
        created_at: new Date().toISOString()
      },
      ipfsUrl: `ipfs://${finalMetadataCid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${finalMetadataCid}`,
      imageUrl: `ipfs://${fileCid}`,
      imageGatewayUrl: `https://ipfs.io/ipfs/${fileCid}`
    });
  } catch (error) {
    console.error('Erro ao criar NFT do CID:', error);
    res.status(500).json({ 
      error: 'Erro ao criar NFT', 
      message: error.message 
    });
  }
});

// Rota para criar NFT completa (arquivo + metadados)
app.post('/api/ipfs/create-nft', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { name, description, attributes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da NFT é obrigatório' });
    }

    // Salvar arquivo temporariamente
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `ipfs-upload-${Date.now()}-${req.file.originalname}`);
    
    await fs.writeFile(tempFilePath, req.file.buffer);

    // 1. Fazer upload da imagem/arquivo
    const fileCid = await uploadFileToIPFS(tempFilePath);
    
    // 2. Criar metadados
    const metadata = {
      name: name,
      description: description || '',
      image: `ipfs://${fileCid}`,
      attributes: attributes ? (typeof attributes === 'string' ? JSON.parse(attributes) : attributes) : [],
      created_at: new Date().toISOString(),
      external_url: ''
    };

    // 3. Fazer upload dos metadados
    const metadataCid = await uploadJSONToIPFS(metadata);

    // Limpar arquivo temporário
    await fs.unlink(tempFilePath).catch(() => {});

    res.json({
      success: true,
      fileCid: fileCid,
      metadataCid: metadataCid,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      metadata: metadata,
      ipfsUrl: `ipfs://${metadataCid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${metadataCid}`,
      imageUrl: `ipfs://${fileCid}`,
      imageGatewayUrl: `https://ipfs.io/ipfs/${fileCid}`
    });
  } catch (error) {
    console.error('Erro ao criar NFT:', error);
    res.status(500).json({ 
      error: 'Erro ao criar NFT', 
      message: error.message 
    });
  }
});

// Rota para buscar NFTs de uma wallet (via Alchemy ou Blockvision)
app.get('/api/nfts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({ error: 'Endereço inválido' });
    }

    // Tentar Blockvision API (Monad Testnet)
    try {
      const response = await fetch(
        `https://api.blockvision.org/v2/monad/account/nfts?address=${address}&pageIndex=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.code === 0 && data.result && data.result.data) {
          const allNFTs = [];
          data.result.data.forEach((collection) => {
            if (collection.items && collection.items.length > 0) {
              collection.items.forEach((item) => {
                allNFTs.push({
                  ...item,
                  collectionName: collection.name,
                  collectionAddress: collection.contractAddress,
                  verified: collection.verified,
                  image: item.image || collection.image
                });
              });
            }
          });
          
          return res.json({ nfts: allNFTs, source: 'blockvision' });
        }
      }
    } catch (blockvisionError) {
      console.log('Blockvision API não disponível, tentando outras opções...');
    }

    // Se Alchemy API Key estiver configurada, tentar usar
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    if (alchemyKey && alchemyKey !== 'demo') {
      try {
        const baseURL = process.env.ALCHEMY_BASE_URL || `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyKey}`;
        const response = await fetch(`${baseURL}/getNFTsForOwner?owner=${address}&pageSize=100`);
        
        if (response.ok) {
          const data = await response.json();
          const nfts = (data.ownedNfts || []).map(nft => ({
            name: nft.name || `NFT #${nft.tokenId}`,
            tokenId: nft.tokenId,
            contractAddress: nft.contract.address,
            collectionName: nft.collection?.name || 'Unknown',
            image: nft.image?.originalUrl || nft.rawMetadata?.image,
            tokenType: nft.tokenType,
            verified: false
          }));
          
          return res.json({ nfts, source: 'alchemy', totalCount: data.totalCount });
        }
      } catch (alchemyError) {
        console.error('Erro ao usar Alchemy API:', alchemyError);
      }
    }

    res.json({ nfts: [], source: 'none', message: 'Nenhuma API disponível' });
  } catch (error) {
    console.error('Erro ao buscar NFTs:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar NFTs', 
      message: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
  console.log(`📡 API IPFS disponível em http://localhost:${PORT}/api/ipfs`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 NFT API: http://localhost:${PORT}/api/nfts/:address`);
});

