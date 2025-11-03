#!/usr/bin/env node

/**
 * Script para adicionar a NFT NEO criada ao sistema
 * Usa localStorage via console do navegador
 */

const nftData = {
  name: "NFT NEO",
  description: "NFT criada usando o sistema NFT Manager com integração IPFS real",
  image: "ipfs://QmZgKkh2ZDaHHNoahokUYtZjT9Yu6Br4b8Xkcho3HHmfhx",
  attributes: [
    {
      trait_type: "Tipo",
      value: "Arte Digital"
    },
    {
      trait_type: "Coleção",
      value: "Tech Neo NFT"
    },
    {
      trait_type: "Criado em",
      value: "2024"
    }
  ],
  created_at: new Date().toISOString(),
  ipfsHash: "QmNwMh5NQWknMCyqG6h8MS8xZkevNCEE5eBCukxhrDw8Tn",
  fileCid: "QmZgKkh2ZDaHHNoahokUYtZjT9Yu6Br4b8Xkcho3HHmfhx",
  fileName: "NFT_NEO.png",
  fileType: "image/png",
  gatewayUrl: "https://ipfs.io/ipfs/QmNwMh5NQWknMCyqG6h8MS8xZkevNCEE5eBCukxhrDw8Tn",
  imageGatewayUrl: "https://ipfs.io/ipfs/QmZgKkh2ZDaHHNoahokUYtZjT9Yu6Br4b8Xkcho3HHmfhx"
};

console.log('✅ NFT NEO criada com sucesso!');
console.log('\n📋 Informações da NFT:');
console.log('   Nome:', nftData.name);
console.log('   CID Metadados:', nftData.ipfsHash);
console.log('   CID Imagem:', nftData.fileCid);
console.log('   Gateway Metadados:', nftData.gatewayUrl);
console.log('   Gateway Imagem:', nftData.imageGatewayUrl);
console.log('\n💡 Para adicionar ao sistema, cole este código no console do navegador (F12):');
console.log('\n' + '='.repeat(60));
console.log(`
const nftData = ${JSON.stringify(nftData, null, 2)};
const saved = JSON.parse(localStorage.getItem('nfts') || '[]');
saved.push(nftData);
localStorage.setItem('nfts', JSON.stringify(saved));
console.log('✅ NFT NEO adicionada ao sistema!');
location.reload();
`);
console.log('='.repeat(60));

