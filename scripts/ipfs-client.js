import { create } from 'ipfs-http-client';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Cria uma instância do cliente IPFS conectada ao daemon local
 * @param {Object} options - Opções de conexão
 * @param {string} options.host - Host do daemon IPFS (padrão: localhost)
 * @param {number} options.port - Porta da API IPFS (padrão: 5001)
 * @param {string} options.protocol - Protocolo (padrão: http)
 * @returns {Promise<IPFS>} Instância do cliente IPFS
 */
export async function createIPFSClient(options = {}) {
  const {
    host = 'localhost',
    port = 5001,
    protocol = 'http'
  } = options;

  try {
    const ipfs = create({
      host,
      port,
      protocol,
      timeout: 30000 // 30 segundos
    });

    // Testar conexão
    const version = await ipfs.version();
    console.log(chalk.green(`✓ Conectado ao IPFS daemon v${version.version}`));
    
    return ipfs;
  } catch (error) {
    throw new Error(
      `Erro ao conectar ao IPFS daemon em ${protocol}://${host}:${port}\n` +
      `Certifique-se de que o IPFS daemon está rodando: ipfs daemon\n` +
      `Erro: ${error.message}`
    );
  }
}

/**
 * Faz upload de um arquivo para o IPFS
 * @param {string} filePath - Caminho do arquivo a ser enviado
 * @param {Object} options - Opções de conexão IPFS
 * @returns {Promise<string>} Hash CID do arquivo no IPFS
 */
export async function uploadFile(filePath, options = {}) {
  try {
    const ipfs = await createIPFSClient(options);
    
    console.log(chalk.blue(`📤 Lendo arquivo: ${filePath}...`));
    const fileBuffer = await readFile(filePath);
    
    console.log(chalk.blue(`📤 Fazendo upload para IPFS...`));
    const result = await ipfs.add(fileBuffer, {
      pin: true, // Pin o arquivo para garantir persistência
      progress: (bytes) => {
        process.stdout.write(chalk.gray(`  Progresso: ${bytes} bytes\r`));
      }
    });

    process.stdout.write('\n'); // Nova linha após progresso
    
    const cid = result.cid.toString();
    console.log(chalk.green(`✅ Arquivo enviado com sucesso!`));
    console.log(chalk.cyan(`   CID: ${cid}`));
    console.log(chalk.cyan(`   Tamanho: ${result.size} bytes`));
    
    return cid;
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao fazer upload: ${error.message}`));
    throw error;
  }
}

/**
 * Faz upload de dados JSON para o IPFS
 * @param {Object} jsonData - Objeto JSON a ser enviado
 * @param {Object} options - Opções de conexão IPFS
 * @returns {Promise<string>} Hash CID do JSON no IPFS
 */
export async function uploadJSON(jsonData, options = {}) {
  try {
    const ipfs = await createIPFSClient(options);
    
    console.log(chalk.blue(`📤 Fazendo upload de metadados JSON...`));
    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonBuffer = Buffer.from(jsonString, 'utf-8');
    
    const result = await ipfs.add(jsonBuffer, {
      pin: true
    });

    const cid = result.cid.toString();
    console.log(chalk.green(`✅ Metadados JSON enviados com sucesso!`));
    console.log(chalk.cyan(`   CID: ${cid}`));
    
    return cid;
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao fazer upload de JSON: ${error.message}`));
    throw error;
  }
}

/**
 * Faz upload de múltiplos arquivos (diretório) para o IPFS
 * @param {string} dirPath - Caminho do diretório
 * @param {Object} options - Opções de conexão IPFS
 * @returns {Promise<Object>} Objeto com hash raiz e lista de arquivos
 */
export async function uploadDirectory(dirPath, options = {}) {
  try {
    const ipfs = await createIPFSClient(options);
    
    console.log(chalk.blue(`📤 Fazendo upload de diretório: ${dirPath}...`));
    
    const { readdir, readFile } = await import('fs/promises');
    const { join, relative } = await import('path');
    
    // Função recursiva para ler todos os arquivos
    async function getAllFiles(dir, basePath = dir) {
      const files = [];
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = relative(basePath, fullPath);
        
        if (entry.isDirectory()) {
          const subFiles = await getAllFiles(fullPath, basePath);
          files.push(...subFiles);
        } else {
          files.push({
            path: relPath,
            fullPath: fullPath
          });
        }
      }
      
      return files;
    }
    
    const allFiles = await getAllFiles(dirPath);
    
    // Preparar arquivos para upload
    const filesToUpload = await Promise.all(
      allFiles.map(async (f) => ({
        path: f.path,
        content: await readFile(f.fullPath)
      }))
    );
    
    const files = [];
    
    // Adicionar todos os arquivos ao IPFS mantendo estrutura de diretório
    for await (const file of ipfs.addAll(filesToUpload, {
      pin: true,
      wrapWithDirectory: true
    })) {
      files.push({
        path: file.path,
        cid: file.cid.toString(),
        size: file.size
      });
      
      if (file.path === '') {
        // Este é o diretório raiz
        console.log(chalk.cyan(`   CID Raiz: ${file.cid.toString()}`));
      }
    }

    const rootFile = files.find(f => f.path === '');
    const rootCid = rootFile ? rootFile.cid : files[files.length - 1].cid;
    
    console.log(chalk.green(`✅ Diretório enviado com sucesso!`));
    console.log(chalk.cyan(`   CID Raiz: ${rootCid}`));
    console.log(chalk.cyan(`   Arquivos: ${files.length}`));
    
    return {
      rootCid,
      files
    };
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao fazer upload de diretório: ${error.message}`));
    throw error;
  }
}

/**
 * Verifica se o IPFS daemon está rodando
 * @param {Object} options - Opções de conexão IPFS
 * @returns {Promise<boolean>} true se está rodando
 */
export async function checkIPFSConnection(options = {}) {
  try {
    const ipfs = await createIPFSClient(options);
    const version = await ipfs.version();
    console.log(chalk.green(`✓ IPFS daemon está rodando (v${version.version})`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ IPFS daemon não está acessível`));
    console.error(chalk.yellow(`  Inicie o daemon com: ipfs daemon`));
    return false;
  }
}

