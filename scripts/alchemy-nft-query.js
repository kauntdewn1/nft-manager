#!/usr/bin/env node

/**
 * Script para buscar NFTs usando Alchemy API (adaptado para Monad)
 * 
 * Uso: node scripts/alchemy-nft-query.js <wallet-address>
 */

import chalk from 'chalk';

// Configuração da API - Você pode usar sua própria chave Alchemy
const apiKey = process.env.ALCHEMY_API_KEY || "demo";
const baseURL = process.env.ALCHEMY_BASE_URL || `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;

// Para Monad Testnet, você precisaria de um endpoint específico se disponível
// Por enquanto, usando como exemplo para outras redes

async function getNFTsForOwner(ownerAddr) {
  try {
    console.log(chalk.blue(`📡 Buscando NFTs para: ${ownerAddr}`));
    
    const response = await fetch(`${baseURL}/getNFTsForOwner?owner=${ownerAddr}&pageSize=100`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(chalk.green(`✅ NFTs encontradas: ${data.totalCount || 0}`));
    
    if (data.ownedNfts && data.ownedNfts.length > 0) {
      console.log(chalk.cyan('\n📋 Lista de NFTs:\n'));
      
      data.ownedNfts.forEach((nft, index) => {
        console.log(chalk.yellow(`--- NFT #${index + 1} ---`));
        console.log(chalk.white(`Contrato: ${nft.contract.address}`));
        console.log(chalk.white(`Token ID: ${nft.tokenId}`));
        console.log(chalk.white(`Tipo: ${nft.tokenType || 'N/A'}`));
        if (nft.name) console.log(chalk.white(`Nome: ${nft.name}`));
        console.log('');
      });
    } else {
      console.log(chalk.yellow('Nenhuma NFT encontrada nesta wallet.'));
    }
    
    return data;
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao buscar NFTs: ${error.message}`));
    throw error;
  }
}

async function getNFTMetadata(contractAddress, tokenId) {
  try {
    console.log(chalk.blue(`📡 Buscando metadados...`));
    console.log(chalk.white(`   Contrato: ${contractAddress}`));
    console.log(chalk.white(`   Token ID: ${tokenId}`));
    
    const response = await fetch(
      `${baseURL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const metadata = await response.json();
    
    console.log(chalk.green('\n✅ Metadados encontrados:\n'));
    console.log(chalk.white(`Nome: ${metadata.name || metadata.title || 'N/A'}`));
    console.log(chalk.white(`Tipo: ${metadata.tokenType || 'N/A'}`));
    console.log(chalk.white(`Token URI: ${metadata.tokenUri || 'N/A'}`));
    console.log(chalk.white(`Imagem: ${metadata.image?.originalUrl || metadata.rawMetadata?.image || 'N/A'}`));
    console.log(chalk.white(`Última atualização: ${metadata.timeLastUpdated || 'N/A'}`));
    
    if (metadata.rawMetadata) {
      console.log(chalk.cyan('\n📄 Metadados completos:'));
      console.log(JSON.stringify(metadata.rawMetadata, null, 2));
    }
    
    return metadata;
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao buscar metadados: ${error.message}`));
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.yellow('Uso: node scripts/alchemy-nft-query.js <wallet-address> [contract-address] [token-id]'));
    console.log(chalk.white('\nExemplos:'));
    console.log(chalk.cyan('  # Buscar todas NFTs de uma wallet'));
    console.log(chalk.white('  node scripts/alchemy-nft-query.js 0xYourAddress'));
    console.log(chalk.cyan('\n  # Buscar metadados de NFT específica'));
    console.log(chalk.white('  node scripts/alchemy-nft-query.js 0xYourAddress 0xContract 123'));
    process.exit(1);
  }
  
  const walletAddress = args[0];
  const contractAddress = args[1];
  const tokenId = args[2];
  
  console.log(chalk.bold.cyan('\n🔍 Alchemy NFT Query - Monad\n'));
  
  if (contractAddress && tokenId) {
    // Buscar metadados específicos
    await getNFTMetadata(contractAddress, tokenId);
  } else {
    // Buscar todas NFTs da wallet
    await getNFTsForOwner(walletAddress);
  }
  
  console.log(chalk.green('\n✅ Busca concluída!\n'));
}

main().catch(console.error);

