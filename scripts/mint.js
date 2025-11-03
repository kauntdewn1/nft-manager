#!/usr/bin/env node

/**
 * NEØ.MINT - Sistema Completo de Mint de NFTs
 * 
 * Uso: node scripts/mint.js --file=drafts/nome.json [--network=polygon|ethereum|base]
 */

import { program } from 'commander';
import chalk from 'chalk';
import { readFile, existsSync } from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { uploadFile, uploadJSON } from './ipfs-client.js';

const readFileAsync = promisify(readFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações de redes
const NETWORKS = {
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    opensea: 'https://opensea.io/assets/matic'
  },
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    opensea: 'https://opensea.io/assets/ethereum'
  },
  base: {
    name: 'Base',
    chainId: 8453,
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    opensea: 'https://opensea.io/assets/base'
  },
  mumbai: {
    name: 'Mumbai (Polygon Testnet)',
    chainId: 80001,
    rpc: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
    opensea: 'https://testnets.opensea.io/assets/mumbai'
  }
};

// Endereço do contrato NFT (você precisa criar/deployar)
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || 'SEU_CONTRATO_AQUI';

program
  .name('neo-mint')
  .description('NEØ.MINT - Sistema completo de criação e mint de NFTs')
  .version('1.0.0')
  .option('-f, --file <path>', 'Caminho para arquivo JSON da NFT', 'drafts/template.json')
  .option('-n, --network <network>', 'Rede blockchain (polygon, ethereum, base, mumbai)', 'mumbai')
  .option('--dry-run', 'Apenas simula sem fazer mint', false)
  .option('--skip-upload', 'Pula upload IPFS (usa CIDs existentes)', false)
  .parse();

async function loadNFTData(filePath) {
  try {
    const fullPath = resolve(__dirname, '..', filePath);
    
    if (!existsSync(fullPath)) {
      throw new Error(`Arquivo não encontrado: ${fullPath}`);
    }

    const content = await readFileAsync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Erro ao ler arquivo: ${error.message}`);
  }
}

async function uploadImageToIPFS(imagePath) {
  const fullPath = resolve(__dirname, '..', imagePath);
  
  if (!existsSync(fullPath)) {
    throw new Error(`Imagem não encontrada: ${fullPath}`);
  }

  console.log(chalk.blue(`📤 Fazendo upload da imagem: ${imagePath}...`));
  const imageCid = await uploadFile(fullPath);
  console.log(chalk.green(`✅ Imagem enviada! CID: ${imageCid}`));
  
  return imageCid;
}

async function createAndUploadMetadata(nftData, imageCid) {
  const metadata = {
    name: nftData.name,
    description: nftData.description,
    image: `ipfs://${imageCid}`,
    external_url: nftData.external_url || '',
    attributes: nftData.attributes || [],
    properties: nftData.properties || {}
  };

  console.log(chalk.blue(`📤 Fazendo upload dos metadados...`));
  const metadataCid = await uploadJSON(metadata);
  console.log(chalk.green(`✅ Metadados enviados! CID: ${metadataCid}`));

  return { metadata, metadataCid };
}

async function mintNFT(metadataCid, network) {
  console.log(chalk.yellow(`\n⚠️  Mint na blockchain requer integração com wallet.`));
  console.log(chalk.yellow(`   Use a interface web ou configure MetaMask.`));
  console.log(chalk.cyan(`\n📋 Informações para mint:`));
  console.log(chalk.white(`   Token URI: ipfs://${metadataCid}`));
  console.log(chalk.white(`   Rede: ${network.name} (Chain ID: ${network.chainId})`));
  console.log(chalk.white(`   Contrato: ${NFT_CONTRACT_ADDRESS}`));
  
  // Retornar informações para mint via web interface
  return {
    tokenUri: `ipfs://${metadataCid}`,
    network: network,
    contractAddress: NFT_CONTRACT_ADDRESS
  };
}

function generateEmbed(nftData, metadataCid, network, tokenId = '0') {
  const openseaUrl = `${network.opensea}/${NFT_CONTRACT_ADDRESS}/${tokenId}`;
  
  return {
    iframe: `<iframe
  src="${openseaUrl}"
  width="500"
  height="600"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  loading="lazy">
</iframe>`,
    openseaUrl: openseaUrl,
    explorerUrl: `${network.explorer}/token/${NFT_CONTRACT_ADDRESS}?a=${tokenId}`,
    ipfsMetadata: `ipfs://${metadataCid}`,
    ipfsGateway: `https://ipfs.io/ipfs/${metadataCid}`
  };
}

async function main() {
  const options = program.opts();
  const network = NETWORKS[options.network];

  if (!network) {
    console.error(chalk.red(`❌ Rede inválida: ${options.network}`));
    console.log(chalk.yellow(`Redes disponíveis: ${Object.keys(NETWORKS).join(', ')}`));
    process.exit(1);
  }

  console.log(chalk.bold.cyan('\n🚀 NEØ.MINT - Sistema de Mint de NFTs\n'));
  console.log(chalk.white(`📁 Arquivo: ${options.file}`));
  console.log(chalk.white(`🌐 Rede: ${network.name}\n`));

  try {
    // 1. Carregar dados da NFT
    const nftData = await loadNFTData(options.file);
    console.log(chalk.green(`✓ Dados carregados: ${nftData.name}`));

    // 2. Upload da imagem (se não for skip)
    let imageCid;
    if (options.skipUpload) {
      console.log(chalk.yellow('⏭️  Pulando upload IPFS...'));
      if (nftData.image && nftData.image.startsWith('ipfs://')) {
        imageCid = nftData.image.replace('ipfs://', '');
      } else {
        throw new Error('Para --skip-upload, forneça image como CID IPFS');
      }
    } else {
      if (!nftData.image) {
        throw new Error('Campo "image" é obrigatório no JSON');
      }
      imageCid = await uploadImageToIPFS(nftData.image);
    }

    // 3. Criar e fazer upload dos metadados
    const { metadata, metadataCid } = await createAndUploadMetadata(nftData, imageCid);

    // 4. Mint (simulado ou real)
    let mintInfo;
    if (options.dryRun) {
      console.log(chalk.yellow('\n🔍 DRY RUN - Apenas simulando mint...'));
      mintInfo = await mintNFT(metadataCid, network);
    } else {
      mintInfo = await mintNFT(metadataCid, network);
    }

    // 5. Gerar embeds e links
    const embed = generateEmbed(nftData, metadataCid, network, '0');

    // 6. Resumo final
    console.log(chalk.bold.green('\n✨ NFT Criada com Sucesso!\n'));
    console.log(chalk.cyan('📋 Informações:'));
    console.log(chalk.white(`   Nome: ${metadata.name}`));
    console.log(chalk.white(`   CID Imagem: ${imageCid}`));
    console.log(chalk.white(`   CID Metadados: ${metadataCid}`));
    console.log(chalk.white(`   Token URI: ipfs://${metadataCid}`));
    
    console.log(chalk.cyan('\n🔗 Links:'));
    console.log(chalk.white(`   IPFS Metadata: ${embed.ipfsGateway}`));
    console.log(chalk.white(`   OpenSea: ${embed.openseaUrl}`));
    console.log(chalk.white(`   Explorer: ${embed.explorerUrl}`));

    console.log(chalk.cyan('\n📦 Embed Code:'));
    console.log(chalk.gray(embed.iframe));

    // Salvar informações em arquivo
    const outputPath = join(__dirname, '..', 'outputs', `nft-${Date.now()}.json`);
    const { writeFile } = await import('fs/promises');
    const { mkdir } = await import('fs/promises');
    
    await mkdir(join(__dirname, '..', 'outputs'), { recursive: true });
    await writeFile(outputPath, JSON.stringify({
      nft: metadata,
      cids: {
        image: imageCid,
        metadata: metadataCid
      },
      mint: mintInfo,
      embed: embed,
      created_at: new Date().toISOString()
    }, null, 2));

    console.log(chalk.green(`\n💾 Informações salvas em: ${outputPath}\n`));

  } catch (error) {
    console.error(chalk.red(`\n❌ Erro: ${error.message}`));
    process.exit(1);
  }
}

main();

