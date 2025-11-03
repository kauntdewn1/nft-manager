// Script para preparar mint usando apenas CID da imagem
import dotenv from 'dotenv';
import chalk from 'chalk';
import { createIPFSClient, uploadJSON } from './ipfs-client.js';

dotenv.config();

const IMAGE_CID = 'QmZgKkh2ZDaHHNoahokUYtZjT9Yu6Br4b8Xkcho3HHmfhx';

async function prepareNFT() {
  try {
    console.log(chalk.bold.cyan('\n🎨 NEØ.MINT - Preparando NFT para Mint\n'));
    
    // Metadata baseada no template existente
    const metadata = {
      name: "NFT NEO - Primeira Mint",
      description: "NFT criada para o primeiro mint na Monad Testnet usando o sistema NEØ.MINT",
      image: `ipfs://${IMAGE_CID}`,
      external_url: "",
      attributes: [
        {
          trait_type: "Coleção",
          value: "Tech Neo NFT"
        },
        {
          trait_type: "Rede",
          value: "Monad Testnet"
        },
        {
          trait_type: "Tipo",
          value: "Arte Digital"
        },
        {
          trait_type: "Primeira Mint",
          value: "Sim"
        }
      ],
      properties: {
        creator: "NEØ",
        created_at: new Date().toISOString(),
        platform: "NEØ.MINT v1.0",
        file_cid: IMAGE_CID
      }
    };

    console.log(chalk.blue(`📋 Metadata criada:`));
    console.log(chalk.white(`   Nome: ${metadata.name}`));
    console.log(chalk.white(`   Imagem CID: ${chalk.cyan(IMAGE_CID)}`));
    console.log(chalk.white(`   Imagem URL: ${chalk.blue(`https://ipfs.io/ipfs/${IMAGE_CID}`)}\n`));

    // Fazer upload da metadata para IPFS
    console.log(chalk.yellow('📤 Fazendo upload da metadata para IPFS...'));
    const metadataCid = await uploadJSON(metadata);
    
    console.log(chalk.green(`\n✅ Metadata enviada para IPFS!`));
    console.log(chalk.cyan(`\n📋 Informações da NFT:\n`));
    console.log(chalk.white(`   Nome: ${chalk.bold(metadata.name)}`));
    console.log(chalk.white(`   CID da Imagem: ${chalk.cyan(IMAGE_CID)}`));
    console.log(chalk.white(`   CID da Metadata: ${chalk.cyan(metadataCid)}`));
    console.log(chalk.white(`   IPFS URI: ${chalk.blue(`ipfs://${metadataCid}`)}`));
    console.log(chalk.white(`   Gateway URL: ${chalk.blue(`https://ipfs.io/ipfs/${metadataCid}`)}`));
    console.log(chalk.white(`   Imagem URL: ${chalk.blue(`https://ipfs.io/ipfs/${IMAGE_CID}`)}`));
    
    console.log(chalk.bold.green(`\n✨ NFT pronta para mint!\n`));
    console.log(chalk.yellow('Próximos passos:'));
    console.log(chalk.white('1. Abra a interface web (http://localhost:3000)'));
    console.log(chalk.white('2. Vá para a aba "Mint"'));
    console.log(chalk.white('3. Cole o CID da metadata:'), chalk.cyan(metadataCid));
    console.log(chalk.white('4. Conecte sua MetaMask'));
    console.log(chalk.white('5. Selecione "Monad Testnet"'));
    console.log(chalk.white('6. Clique em "Mint NFT"\n'));

    // Salvar informações em arquivo para referência
    const fs = await import('fs');
    const path = await import('path');
    
    const outputFile = path.join(process.cwd(), 'drafts', 'nft-ready-to-mint.json');
    const output = {
      imageCid: IMAGE_CID,
      metadataCid: metadataCid,
      metadata: metadata,
      ipfsUri: `ipfs://${metadataCid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${metadataCid}`,
      imageUrl: `https://ipfs.io/ipfs/${IMAGE_CID}`,
      createdAt: new Date().toISOString()
    };
    
    await fs.promises.writeFile(outputFile, JSON.stringify(output, null, 2));
    console.log(chalk.gray(`💾 Informações salvas em: ${outputFile}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Erro:'), error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error(chalk.yellow('\n💡 Certifique-se de que o IPFS daemon está rodando:'));
      console.error(chalk.white('   ipfs daemon\n'));
    }
    process.exit(1);
  }
}

prepareNFT();

