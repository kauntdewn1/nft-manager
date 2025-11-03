import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, Copy, CheckCircle, Star, ExternalLink } from 'lucide-react';

export default function WalletManager({ onWalletSelect }) {
  const [wallets, setWallets] = useState([]);
  const [newWallet, setNewWallet] = useState({
    name: '',
    address: '',
    network: 'mumbai',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(null);

  useEffect(() => {
    loadWallets();
    checkConnectedWallet();
  }, []);

  const loadWallets = () => {
    try {
      const saved = localStorage.getItem('savedWallets');
      if (saved) {
        setWallets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar wallets:', error);
    }
  };

  const saveWallets = (updatedWallets) => {
    localStorage.setItem('savedWallets', JSON.stringify(updatedWallets));
    setWallets(updatedWallets);
  };

  const checkConnectedWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnectedWallet(accounts[0].toLowerCase());
        }
      } catch (error) {
        console.error('Erro ao verificar wallet conectada:', error);
      }
    }
  };

  const addWallet = () => {
    if (!newWallet.name || !newWallet.address) {
      alert('Preencha nome e endereço da wallet');
      return;
    }

    // Validar formato de endereço Ethereum
    if (!/^0x[a-fA-F0-9]{40}$/.test(newWallet.address)) {
      alert('Endereço inválido. Deve ser um endereço Ethereum válido (0x...)');
      return;
    }

    const wallet = {
      id: Date.now().toString(),
      name: newWallet.name,
      address: newWallet.address.toLowerCase(),
      network: newWallet.network,
      notes: newWallet.notes || '',
      createdAt: new Date().toISOString(),
      isFavorite: false
    };

    const updated = [...wallets, wallet];
    saveWallets(updated);
    
    setNewWallet({ name: '', address: '', network: 'mumbai', notes: '' });
    setShowAddForm(false);
  };

  const deleteWallet = (id) => {
    if (confirm('Tem certeza que deseja remover esta wallet?')) {
      const updated = wallets.filter(w => w.id !== id);
      saveWallets(updated);
    }
  };

  const toggleFavorite = (id) => {
    const updated = wallets.map(w => 
      w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
    );
    saveWallets(updated);
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const connectWalletFromSaved = async (address) => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask não encontrado!');
      return;
    }

    try {
      // Solicitar conexão
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const connected = accounts[0].toLowerCase();
      
      // Verificar se é a wallet salva
      if (connected === address.toLowerCase()) {
        setConnectedWallet(connected);
        if (onWalletSelect) {
          onWalletSelect(address);
        }
      } else {
        alert(`Wallet conectada não corresponde à wallet salva.\nConectada: ${connected}\nSalva: ${address}`);
      }
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
    }
  };

  const getNetworkName = (network) => {
    const networks = {
      mumbai: 'Mumbai Testnet',
      polygon: 'Polygon',
      ethereum: 'Ethereum',
      base: 'Base'
    };
    return networks[network] || network;
  };

  const getExplorerUrl = (address, network) => {
    const explorers = {
      mumbai: `https://mumbai.polygonscan.com/address/${address}`,
      polygon: `https://polygonscan.com/address/${address}`,
      ethereum: `https://etherscan.io/address/${address}`,
      base: `https://basescan.org/address/${address}`
    };
    return explorers[network] || '#';
  };

  // Ordenar: favoritas primeiro, depois por nome
  const sortedWallets = [...wallets].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Gerenciar Wallets
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Formulário de Adicionar */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Nova Wallet</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white mb-1 text-sm">Nome *</label>
              <input
                type="text"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                placeholder="Ex: Minha Wallet Principal"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-1 text-sm">Endereço *</label>
              <input
                type="text"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                placeholder="0x..."
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-white mb-1 text-sm">Rede</label>
              <select
                value={newWallet.network}
                onChange={(e) => setNewWallet({ ...newWallet, network: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
              >
                <option value="mumbai">Mumbai Testnet</option>
                <option value="polygon">Polygon Mainnet</option>
                <option value="base">Base</option>
                <option value="ethereum">Ethereum Mainnet</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-1 text-sm">Observações</label>
              <textarea
                value={newWallet.notes}
                onChange={(e) => setNewWallet({ ...newWallet, notes: e.target.value })}
                placeholder="Notas sobre esta wallet..."
                rows="2"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addWallet}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewWallet({ name: '', address: '', network: 'mumbai', notes: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Wallets */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {sortedWallets.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma wallet cadastrada</p>
            <p className="text-sm mt-2">Clique em "Adicionar" para cadastrar uma</p>
          </div>
        ) : (
          sortedWallets.map((wallet) => {
            const isConnected = connectedWallet === wallet.address;
            return (
              <div
                key={wallet.id}
                className={`p-4 rounded-lg border ${
                  isConnected
                    ? 'bg-green-500/20 border-green-400/30'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                } transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold">{wallet.name}</h3>
                      {wallet.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                      {isConnected && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded">
                          Conectada
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-white/70 text-xs break-all font-mono">
                        {wallet.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(wallet.address, wallet.id)}
                        className="text-white/50 hover:text-white"
                      >
                        {copied === wallet.id ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span>{getNetworkName(wallet.network)}</span>
                      {wallet.notes && (
                        <>
                          <span>•</span>
                          <span className="italic">{wallet.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleFavorite(wallet.id)}
                      className={`p-2 rounded hover:bg-white/10 ${
                        wallet.isFavorite ? 'text-yellow-400' : 'text-white/50'
                      }`}
                      title={wallet.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star className={`w-4 h-4 ${wallet.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <a
                      href={getExplorerUrl(wallet.address, wallet.network)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded hover:bg-white/10 text-white/50 hover:text-white"
                      title="Abrir no explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => connectWalletFromSaved(wallet.address)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Conectar
                    </button>
                    <button
                      onClick={() => deleteWallet(wallet.id)}
                      className="p-2 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      title="Remover wallet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Estatísticas */}
      {wallets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 text-center text-white/60 text-xs">
          {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} cadastrada{wallets.length !== 1 ? 's' : ''}
          {' • '}
          {wallets.filter(w => w.isFavorite).length} favorita{wallets.filter(w => w.isFavorite).length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

