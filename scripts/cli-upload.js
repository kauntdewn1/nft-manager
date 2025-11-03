#!/usr/bin/env node

import { uploadFile, uploadJSON, uploadDirectory, checkIPFSConnection } from './ipfs-client.js';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import chalk from 'chalk';
import { program } from 'commander';

// Configuração do CLI
program
  .name('ipfs-upload')
  .description('CLI para fazer upload de arquivos, JSON e diretórios para IPFS local')
  .version('1.0.0');

// Comando: upload de arquivo
program
  .command('file <filepath>')
  .description('Faz upload de um arquivo para o IPFS')
  .option('-h, --host <host>', 'Host do IPFS daemon', 'localhost')
  .option('-p, --port <port>', 'Porta do IPFS daemon', '5001')
  .option('--protocol <protocol>', 'Protocolo (http/https)', 'http')
  .action(async (filepath, options) => {
    try {
      if (!existsSync(filepath)) {
        console.error(chalk.red(`❌ Arquivo não encontrado: ${filepath}`));
        process.exit(1);
      }

      const cid = await uploadFile(filepath, {
        host: options.host,
        port: parseInt(options.port),
        protocol: options.protocol
      });

      console.log(chalk.bold.green('\n🎉 Upload concluído!'));
      console.log(chalk.white(`\nHash IPFS: ${chalk.bold.cyan(cid)}`));
      console.log(chalk.white(`URL IPFS: ${chalk.cyan(`ipfs://${cid}`)}`));
      console.log(chalk.white(`Gateway: ${chalk.cyan(`https://ipfs.io/ipfs/${cid}`)}`));
      
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(`\n❌ Erro: ${error.message}`));
      process.exit(1);
    }
  });

// Comando: upload de JSON
program
  .command('json <jsonfile>')
  .description('Faz upload de um arquivo JSON para o IPFS')
  .option('-h, --host <host>', 'Host do IPFS daemon', 'localhost')
  .option('-p, --port <port>', 'Porta do IPFS daemon', '5001')
  .option('--protocol <protocol>', 'Protocolo (http/https)', 'http')
  .action(async (jsonfile, options) => {
    try {
      if (!existsSync(jsonfile)) {
        console.error(chalk.red(`❌ Arquivo JSON não encontrado: ${jsonfile}`));
        process.exit(1);
      }

      const jsonContent = await readFile(jsonfile, 'utf-8');
      const jsonData = JSON.parse(jsonContent);

      const cid = await uploadJSON(jsonData, {
        host: options.host,
        port: parseInt(options.port),
        protocol: options.protocol
      });

      console.log(chalk.bold.green('\n🎉 Upload de JSON concluído!'));
      console.log(chalk.white(`\nHash IPFS: ${chalk.bold.cyan(cid)}`));
      console.log(chalk.white(`URL IPFS: ${chalk.cyan(`ipfs://${cid}`)}`));
      console.log(chalk.white(`Gateway: ${chalk.cyan(`https://ipfs.io/ipfs/${cid}`)}`));
      
      process.exit(0);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(chalk.red(`❌ Erro ao parsear JSON: ${error.message}`));
      } else {
        console.error(chalk.red(`❌ Erro: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Comando: upload de diretório
program
  .command('dir <dirpath>')
  .description('Faz upload de um diretório completo para o IPFS')
  .option('-h, --host <host>', 'Host do IPFS daemon', 'localhost')
  .option('-p, --port <port>', 'Porta do IPFS daemon', '5001')
  .option('--protocol <protocol>', 'Protocolo (http/https)', 'http')
  .action(async (dirpath, options) => {
    try {
      if (!existsSync(dirpath)) {
        console.error(chalk.red(`❌ Diretório não encontrado: ${dirpath}`));
        process.exit(1);
      }

      const result = await uploadDirectory(dirpath, {
        host: options.host,
        port: parseInt(options.port),
        protocol: options.protocol
      });

      console.log(chalk.bold.green('\n🎉 Upload de diretório concluído!'));
      console.log(chalk.white(`\nHash IPFS (Raiz): ${chalk.bold.cyan(result.rootCid)}`));
      console.log(chalk.white(`URL IPFS: ${chalk.cyan(`ipfs://${result.rootCid}`)}`));
      console.log(chalk.white(`Total de arquivos: ${chalk.cyan(result.files.length)}`));
      
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(`❌ Erro: ${error.message}`));
      process.exit(1);
    }
  });

// Comando: verificar conexão
program
  .command('check')
  .description('Verifica se o IPFS daemon está rodando e acessível')
  .option('-h, --host <host>', 'Host do IPFS daemon', 'localhost')
  .option('-p, --port <port>', 'Porta do IPFS daemon', '5001')
  .option('--protocol <protocol>', 'Protocolo (http/https)', 'http')
  .action(async (options) => {
    const isConnected = await checkIPFSConnection({
      host: options.host,
      port: parseInt(options.port),
      protocol: options.protocol
    });
    
    process.exit(isConnected ? 0 : 1);
  });

// Parse dos argumentos
program.parse();

// Se nenhum comando foi fornecido, mostrar ajuda
if (process.argv.length === 2) {
  program.help();
}

