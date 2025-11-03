import React, { useState, useEffect } from 'react';
import { Upload, Image, FileText, Send, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import MintInterface from './MintInterface.jsx';

export default function NFTManager() {
  const [nfts, setNfts] = useState([]);
  const [currentNFT, setCurrentNFT] = useState({
    name: '',
    description: '',
    file: null,
    attributes: []
  });
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [newAttribute, setNewAttribute] = useState({ trait_type: '', value: '' });

  useEffect(() => {
    loadSavedNFTs();
  }, []);

  const loadSavedNFTs = async () => {
    try {
      // Tentar usar window.storage primeiro (Tauri/Electron)
      if (window.storage && window.storage.list) {
        const saved = await window.storage.list('nft:');
        if (saved && saved.keys) {
          const nftData = await Promise.all(
            saved.keys.map(async (key) => {
              const result = await window.storage.get(key);
              return result ? JSON.parse(result.value) : null;
            })
          );
          setNfts(nftData.filter(Boolean));
          return;
        }
      }
      
      // Fallback: usar localStorage
      const saved = localStorage.getItem('nfts');
      if (saved) {
        setNfts(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Carregando NFTs pela primeira vez:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentNFT({ ...currentNFT, file: file });
      setStatus(`Arquivo selecionado: ${file.name}`);
    }
  };

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setCurrentNFT({
        ...currentNFT,
        attributes: [...currentNFT.attributes, { ...newAttribute }]
      });
      setNewAttribute({ trait_type: '', value: '' });
    }
  };

  const removeAttribute = (index) => {
    setCurrentNFT({
      ...currentNFT,
      attributes: currentNFT.attributes.filter((_, i) => i !== index)
    });
  };

  const uploadToIPFS = async () => {
    if (!currentNFT.file || !currentNFT.name) {
      setStatus('❌ Preencha o nome e selecione um arquivo');
      return;
    }

    setLoading(true);
    setStatus('📤 Fazendo upload para IPFS...');

    try {
      // Criar FormData para enviar arquivo e metadados
      const formData = new FormData();
      formData.append('file', currentNFT.file);
      formData.append('name', currentNFT.name);
      formData.append('description', currentNFT.description || '');
      formData.append('attributes', JSON.stringify(currentNFT.attributes));

      // Fazer requisição para API backend
      const response = await fetch('/api/ipfs/create-nft', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }

      const result = await response.json();

      // Salvar NFT com dados reais do IPFS
      const nftData = {
        name: result.metadata.name,
        description: result.metadata.description,
        image: result.imageUrl,
        attributes: result.metadata.attributes,
        created_at: result.metadata.created_at,
        ipfsHash: result.metadataCid,
        fileCid: result.fileCid,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        gatewayUrl: result.gatewayUrl,
        imageGatewayUrl: result.imageGatewayUrl
      };

      // Salvar no storage local (se disponível)
      try {
        if (window.storage && window.storage.set) {
          await window.storage.set(`nft:${result.metadataCid}`, JSON.stringify(nftData));
        } else {
          // Fallback: usar localStorage
          const saved = JSON.parse(localStorage.getItem('nfts') || '[]');
          saved.push(nftData);
          localStorage.setItem('nfts', JSON.stringify(saved));
        }
      } catch (storageError) {
        console.log('Usando localStorage como fallback');
        const saved = JSON.parse(localStorage.getItem('nfts') || '[]');
        saved.push(nftData);
        localStorage.setItem('nfts', JSON.stringify(saved));
      }
      
      setNfts([...nfts, nftData]);
      setIpfsHash(result.metadataCid);
      setStatus(`✅ NFT criado com sucesso! CID: ${result.metadataCid}. Agora você pode fazer o mint na aba Mint!`);
      
      // Limpar formulário
      setTimeout(() => {
        setCurrentNFT({ name: '', description: '', file: null, attributes: [] });
        setIpfsHash('');
        setStatus('');
      }, 5000);
    } catch (error) {
      console.error('Erro:', error);
      setStatus('❌ Erro ao criar NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNFT = async (hash) => {
    try {
      // Tentar usar window.storage primeiro
      if (window.storage && window.storage.delete) {
        await window.storage.delete(`nft:${hash}`);
      }
      
      // Atualizar localStorage também
      const saved = JSON.parse(localStorage.getItem('nfts') || '[]');
      const filtered = saved.filter(nft => nft.ipfsHash !== hash);
      localStorage.setItem('nfts', JSON.stringify(filtered));
      
      setNfts(nfts.filter(nft => nft.ipfsHash !== hash));
      setStatus('🗑️ NFT removido');
    } catch (error) {
      console.error('Erro ao remover:', error);
      setStatus('❌ Erro ao remover NFT');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus('📋 Copiado para área de transferência!');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Database className="w-12 h-12" />
            Sistema NFT Manager
          </h1>
          <p className="text-blue-200 text-lg">Crie e gerencie suas NFTs com IPFS</p>
        </div>

        {/* Status Bar */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg ${
            status.includes('✅') ? 'bg-green-500/20 text-green-200' :
            status.includes('❌') ? 'bg-red-500/20 text-red-200' :
            'bg-blue-500/20 text-blue-200'
          } backdrop-blur-sm`}>
            {status}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Criação */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Criar Nova NFT
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Nome da NFT *</label>
                <input
                  type="text"
                  value={currentNFT.name}
                  onChange={(e) => setCurrentNFT({ ...currentNFT, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  placeholder="Ex: Minha Arte Digital #001"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Descrição</label>
                <textarea
                  value={currentNFT.description}
                  onChange={(e) => setCurrentNFT({ ...currentNFT, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none h-24"
                  placeholder="Descreva sua NFT..."
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Arquivo (Imagem/Vídeo) *</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                />
                {currentNFT.file && (
                  <p className="text-green-300 text-sm mt-2">✓ {currentNFT.file.name}</p>
                )}
              </div>

              {/* Atributos */}
              <div>
                <label className="block text-white mb-2 font-medium">Atributos (Propriedades)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAttribute.trait_type}
                    onChange={(e) => setNewAttribute({ ...newAttribute, trait_type: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="Tipo (ex: Cor)"
                  />
                  <input
                    type="text"
                    value={newAttribute.value}
                    onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="Valor (ex: Azul)"
                  />
                  <button
                    onClick={addAttribute}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
                
                {currentNFT.attributes.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {currentNFT.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                        <span className="text-white text-sm">
                          <strong>{attr.trait_type}:</strong> {attr.value}
                        </span>
                        <button
                          onClick={() => removeAttribute(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={uploadToIPFS}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Criando NFT...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Criar NFT no IPFS
                  </>
                )}
              </button>

              {ipfsHash && (
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-200 text-sm mb-2">Hash IPFS:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-white text-sm break-all flex-1">{ipfsHash}</code>
                    <button
                      onClick={() => copyToClipboard(ipfsHash)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de NFTs Criadas */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="w-6 h-6" />
              NFTs Criadas ({nfts.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {nfts.length === 0 ? (
                <div className="text-center text-white/60 py-12">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma NFT criada ainda</p>
                  <p className="text-sm mt-2">Crie sua primeira NFT ao lado!</p>
                </div>
              ) : (
                nfts.map((nft, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/20 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">{nft.name}</h3>
                      <button
                        onClick={() => deleteNFT(nft.ipfsHash)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    
                    {nft.description && (
                      <p className="text-white/70 text-sm mb-3">{nft.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <FileText className="w-4 h-4" />
                        <span>{nft.fileName}</span>
                      </div>
                      
                      <div className="bg-black/30 p-2 rounded">
                        <p className="text-white/50 text-xs mb-1">IPFS Hash:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-blue-300 text-xs break-all flex-1">{nft.ipfsHash}</code>
                          <button
                            onClick={() => copyToClipboard(nft.ipfsHash)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {nft.attributes && nft.attributes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-white/50 text-xs mb-1">Atributos:</p>
                          <div className="flex flex-wrap gap-1">
                            {nft.attributes.map((attr, i) => (
                              <span key={i} className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                                {attr.trait_type}: {attr.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interface de Mint */}
          <MintInterface />
        </div>

        {/* Status da Integração IPFS */}
        <div className="mt-8 bg-green-500/10 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <h3 className="text-xl font-bold text-green-200 mb-4">✅ Integração IPFS Real Ativa!</h3>
          <div className="text-green-100 space-y-2 text-sm">
            <p><strong>Sistema totalmente funcional com IPFS daemon local.</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Backend Express rodando na porta 3001</li>
              <li>Upload real de arquivos para IPFS</li>
              <li>Metadados JSON armazenados no IPFS</li>
              <li>CIDs reais gerados pelo IPFS</li>
            </ul>
            <p className="mt-4 text-xs opacity-75">
              Certifique-se de que o servidor backend está rodando: <code className="bg-black/30 px-2 py-1 rounded">npm run dev:full</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

