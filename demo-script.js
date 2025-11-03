// Demo script para buscar NFTs usando Alchemy API
import axios from 'axios';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração da API Alchemy
const apiKey = process.env.ALCHEMY_API_KEY || "demo";
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;

// Pega endereço da linha de comando ou usa padrão
const ownerAddr = process.argv[2] || "vitalik.eth";

async function getNFTData() {
  try {
    console.log(chalk.bold.cyan('\n🔍 Alchemy NFT API - Busca de NFTs\n'));
    console.log(chalk.white(`📡 Buscando NFTs para: ${chalk.bold.yellow(ownerAddr)}`));
    console.log(chalk.gray(`   API: ${baseURL.split('/v3/')[0]}/v3/[KEY]\n`));

    // Buscar NFTs do proprietário
    const nftsResponse = await axios.get(`${baseURL}/getNFTsForOwner`, {
      params: {
        owner: ownerAddr,
        pageSize: 5
      }
    });
    const nftsData = nftsResponse.data;

    console.log(chalk.green(`✅ Total de NFTs encontradas: ${chalk.bold(nftsData.totalCount)}`));

    // Mostrar endereço do contrato e tokenId de cada NFT
    if (nftsData.ownedNfts && nftsData.ownedNfts.length > 0) {
      console.log(chalk.cyan(`\n📋 Primeiras ${nftsData.ownedNfts.length} NFTs:\n`));
      nftsData.ownedNfts.forEach((nft, index) => {
        console.log(chalk.yellow(`--- NFT #${index + 1} ---`));
        console.log(chalk.white(`  Contrato: ${chalk.cyan(nft.contract.address)}`));
        console.log(chalk.white(`  Token ID: ${chalk.cyan(nft.tokenId)}`));
        console.log(chalk.white(`  Nome: ${nft.name || chalk.gray("N/A")}`));
        console.log(chalk.white(`  Tipo: ${nft.tokenType || "N/A"}`));
        if (nft.image?.originalUrl) {
          console.log(chalk.white(`  Imagem: ${chalk.blue(nft.image.originalUrl)}`));
        }
        console.log('');
      });
    }

    // Buscar metadados de uma NFT específica (exemplo: Crypto Coven)
    // Pode passar como argumentos: node demo-script.js <address> <contract> <tokenId>
    if (process.argv[3] && process.argv[4]) {
      const contractAddress = process.argv[3];
      const tokenId = process.argv[4];

      const metadataResponse = await axios.get(`${baseURL}/getNFTMetadata`, {
        params: {
          contractAddress: contractAddress,
          tokenId: tokenId
        }
      });
      const metadata = metadataResponse.data;

      // Mostrar campos comuns
      console.log(chalk.cyan(`\n📄 Metadados da NFT:`));
      console.log(chalk.white(`  Nome: ${chalk.bold(metadata.name || metadata.title || "N/A")}`));
      console.log(chalk.white(`  Tipo: ${metadata.tokenType || "N/A"}`));
      console.log(chalk.white(`  Token URI: ${chalk.blue(metadata.tokenUri || "N/A")}`));
      console.log(chalk.white(`  Imagem: ${chalk.blue(metadata.image?.originalUrl || metadata.rawMetadata?.image || "N/A")}`));
      console.log(chalk.white(`  Atualizado: ${metadata.timeLastUpdated || "N/A"}`));

      // Mostrar metadados completos se disponíveis
      if (metadata.rawMetadata) {
        console.log(chalk.cyan(`\n📦 Metadados Completos:`));
        console.log(chalk.gray(JSON.stringify(metadata.rawMetadata, null, 2)));
      }
    } else {
      // Exemplo padrão: Crypto Coven
      console.log(chalk.cyan(`\n📄 Exemplo - Metadados de NFT (Crypto Coven):`));
      const contractAddress = "0x5180db8F5c931aaE63c74266b211F580155ecac8";
      const tokenId = "1590";

      const metadataResponse = await axios.get(`${baseURL}/getNFTMetadata`, {
        params: {
          contractAddress: contractAddress,
          tokenId: tokenId
        }
      });
      const metadata = metadataResponse.data;

      console.log(chalk.white(`  Nome: ${chalk.bold(metadata.name || metadata.title || "N/A")}`));
      console.log(chalk.white(`  Token URI: ${chalk.blue(metadata.tokenUri || "N/A")}`));
      console.log(chalk.white(`  Imagem: ${chalk.blue(metadata.image?.originalUrl || metadata.rawMetadata?.image || "N/A")}`));
    }

    console.log(chalk.green('\n✅ Busca concluída!\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Erro na requisição:'), error.message);
    if (error.response) {
      console.error(chalk.red(`   Status: ${error.response.status}`));
      console.error(chalk.red(`   Dados: ${JSON.stringify(error.response.data)}`));
    }
  }
}

// Mostrar uso se necessário
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(chalk.cyan('\n📖 Uso do script:'));
  console.log(chalk.white('  node demo-script.js [endereço] [contrato] [tokenId]'));
  console.log(chalk.gray('\nExemplos:'));
  console.log(chalk.white('  node demo-script.js vitalik.eth'));
  console.log(chalk.white('  node demo-script.js 0x... 0x5180db8F5c931aaE63c74266b211F580155ecac8 1590'));
  process.exit(0);
}

getNFTData();

