import React, { useState, useEffect } from 'react';
import { Image, ExternalLink, Loader, RefreshCw, AlertCircle } from 'lucide-react';

export default function NFTViewer({ walletAddress }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(walletAddress || '');

  const fetchNFTs = async (addr) => {
    if (!addr || !addr.startsWith('0x') || addr.length !== 42) {
      setError('Endereço inválido. Deve começar com 0x e ter 42 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.blockvision.org/v2/monad/account/nfts?address=${addr}&pageIndex=1`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar NFTs');
      }

      const data = await response.json();

      if (data.code === 0 && data.result && data.result.data) {
        // Flatten all NFT items from all collections
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

        setNfts(allNFTs);
      } else {
        setNfts([]);
        setError(data.reason || 'Nenhuma NFT encontrada');
      }
    } catch (err) {
      console.error('Erro ao buscar NFTs:', err);
      setError('Erro ao buscar NFTs. Verifique o endereço ou tente novamente.');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
      fetchNFTs(walletAddress);
    }
  }, [walletAddress]);

  const handleSearch = () => {
    if (address) {
      fetchNFTs(address);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Image className="w-6 h-6" />
        Visualizar NFTs (Monad Testnet)
      </h2>

      {/* Campo de busca */}
      <div className="mb-6">
        <label className="block text-white mb-2 font-medium">Endereço da Wallet</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none font-mono text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !address}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            Buscar
          </button>
        </div>
        <p className="text-white/60 text-xs mt-1">
          Busque NFTs de qualquer wallet na Monad Testnet
        </p>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Lista de NFTs */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-white/50" />
          <p className="text-white/60">Buscando NFTs...</p>
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {nfts.map((nft, index) => (
            <div
              key={`${nft.contractAddress}-${nft.tokenId}-${index}`}
              className="bg-white/5 rounded-lg p-4 border border-white/20 hover:bg-white/10 transition-colors"
            >
              {/* Imagem da NFT */}
              {nft.image ? (
                <div className="mb-3 rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={nft.image}
                    alt={nft.name || `NFT #${nft.tokenId}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ) : (
                <div className="mb-3 rounded-lg bg-black/20 h-48 flex items-center justify-center">
                  <Image className="w-16 h-16 text-white/30" />
                </div>
              )}

              {/* Informações */}
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg truncate">
                  {nft.name || `NFT #${nft.tokenId}`}
                </h3>
                
                {nft.collectionName && (
                  <p className="text-white/60 text-sm truncate">
                    {nft.collectionName}
                    {nft.verified && (
                      <span className="ml-2 px-2 py-0.5 bg-green-500/30 text-green-300 text-xs rounded">
                        ✓ Verificado
                      </span>
                    )}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Token ID: {nft.tokenId}</span>
                  {nft.qty && nft.qty !== '1' && (
                    <span>Qty: {nft.qty}</span>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <a
                    href={`https://testnet.monadexplorer.com/token/${nft.contractAddress}?a=${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 flex items-center justify-center gap-1 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Explorer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !error && address ? (
        <div className="text-center py-12 text-white/60">
          <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nenhuma NFT encontrada nesta wallet</p>
        </div>
      ) : null}

      {/* Estatísticas */}
      {nfts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20 text-center text-white/60 text-xs">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} encontrada{nfts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

