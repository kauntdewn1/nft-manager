import React, { useState, useEffect } from 'react';
import { Wallet, Zap, ExternalLink, Copy, CheckCircle } from 'lucide-react';

export default function MintInterface() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(null);
  const [network, setNetwork] = useState('monad');
  const [tokenURI, setTokenURI] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const NETWORKS = {
    monad: { chainId: 10143, name: 'Monad Testnet' },
    polygon: { chainId: 137, name: 'Polygon' },
    ethereum: { chainId: 1, name: 'Ethereum' },
    base: { chainId: 8453, name: 'Base' },
    mumbai: { chainId: 80001, name: 'Mumbai Testnet' }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));
      } catch (error) {
        console.error('Erro ao verificar wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask não encontrado! Instale a extensão MetaMask.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainId, 16));
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
    }
  };

  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      setChainId(targetChainId);
    } catch (error) {
      if (error.code === 4902) {
        // Chain não adicionada, adicionar
        const chainConfig = getChainConfig(targetChainId);
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });
        } catch (addError) {
          console.error('Erro ao adicionar rede:', addError);
        }
      }
    }
  };

  const getChainConfig = (chainId) => {
    const configs = {
      10143: {
        chainId: '0x2797',
        chainName: 'Monad Testnet',
        nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
        rpcUrls: ['https://testnet-rpc.monad.xyz'],
        blockExplorerUrls: ['https://testnet.monadexplorer.com']
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
      },
      80001: {
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }
    };
    return configs[chainId] || configs[10143];
  };

  const mintNFT = async () => {
    if (!account) {
      alert('Conecte sua wallet primeiro!');
      return;
    }

    if (!tokenURI) {
      alert('Preencha o Token URI (CID IPFS)');
      return;
    }

    if (!contractAddress) {
      alert('Configure o endereço do contrato NFT');
      return;
    }

    setMinting(true);
    setMintResult(null);

    try {
      // Importar ethers dinamicamente
      const { ethers } = await import('ethers');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // ABI simplificado do contrato
      const abi = [
        "function mint(address to, string memory tokenURI) public payable",
        "function totalSupply() public view returns (uint256)"
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Fazer mint
      const tx = await contract.mint(account, tokenURI, {
        value: ethers.parseEther('0') // Preço em ETH/MATIC
      });

      setMintResult({
        status: 'pending',
        txHash: tx.hash,
        message: 'Transação enviada, aguardando confirmação...'
      });

      // Aguardar confirmação
      const receipt = await tx.wait();

      // Pegar token ID (último mintado)
      const totalSupply = await contract.totalSupply();

      setMintResult({
        status: 'success',
        txHash: receipt.transactionHash,
        tokenId: totalSupply.toString(),
        message: 'NFT mintada com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao fazer mint:', error);
      setMintResult({
        status: 'error',
        message: error.message || 'Erro ao fazer mint'
      });
    } finally {
      setMinting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const targetChainId = NETWORKS[network]?.chainId;
  const isCorrectNetwork = chainId === targetChainId;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6" />
        Mint NFT na Blockchain
      </h2>

      <div className="space-y-4">
        {/* Conexão Wallet */}
        <div>
          <label className="block text-white mb-2 font-medium">Conexão Wallet</label>
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Conectar MetaMask
            </button>
          ) : (
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-green-300 text-sm mb-1">✓ Wallet Conectada</p>
              <code className="text-white text-xs break-all">{account}</code>
            </div>
          )}
        </div>

        {/* Seleção de Rede */}
        <div>
          <label className="block text-white mb-2 font-medium">Rede Blockchain</label>
            <select
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value);
                if (account && targetChainId) {
                  switchNetwork(targetChainId);
                }
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
            >
              <option value="monad">Monad Testnet (Teste)</option>
              <option value="mumbai">Mumbai Testnet</option>
              <option value="polygon">Polygon Mainnet</option>
              <option value="base">Base</option>
              <option value="ethereum">Ethereum Mainnet</option>
            </select>
          {account && !isCorrectNetwork && targetChainId && (
            <p className="text-yellow-300 text-sm mt-2">
              ⚠️ Troque para {NETWORKS[network].name} na MetaMask
            </p>
          )}
        </div>

        {/* Endereço do Contrato */}
        <div>
          <label className="block text-white mb-2 font-medium">Endereço do Contrato NFT</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
          />
          <p className="text-white/60 text-xs mt-1">
            Endereço do contrato ERC-721 deployado
          </p>
        </div>

        {/* Token URI (CID IPFS) */}
        <div>
          <label className="block text-white mb-2 font-medium">Token URI (CID IPFS)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              placeholder="ipfs://QmXxx... ou QmXxx..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(tokenURI)}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-white/60 text-xs mt-1">
            CID dos metadados gerado no IPFS
          </p>
        </div>

        {/* Botão Mint */}
        <button
          onClick={mintNFT}
          disabled={minting || !account || !isCorrectNetwork || !tokenURI || !contractAddress}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {minting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Mintando...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Mintar NFT
            </>
          )}
        </button>

        {/* Resultado do Mint */}
        {mintResult && (
          <div className={`p-4 rounded-lg ${
            mintResult.status === 'success' ? 'bg-green-500/20 border border-green-400/30' :
            mintResult.status === 'error' ? 'bg-red-500/20 border border-red-400/30' :
            'bg-blue-500/20 border border-blue-400/30'
          }`}>
            <p className={`text-sm ${
              mintResult.status === 'success' ? 'text-green-200' :
              mintResult.status === 'error' ? 'text-red-200' :
              'text-blue-200'
            }`}>
              {mintResult.message}
            </p>
            {mintResult.txHash && (
              <div className="mt-2">
                <p className="text-white/60 text-xs mb-1">Hash da Transação:</p>
                <code className="text-white text-xs break-all">{mintResult.txHash}</code>
                <a
                  href={`${network === 'monad' ? 'https://testnet.monadexplorer.com/tx/' : network === 'mumbai' ? 'https://mumbai.polygonscan.com/tx/' : 'https://polygonscan.com/tx/'}${mintResult.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4 inline" />
                </a>
              </div>
            )}
            {mintResult.tokenId && (
              <div className="mt-2">
                <p className="text-white/60 text-xs mb-1">Token ID:</p>
                <code className="text-white text-xs">{mintResult.tokenId}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

