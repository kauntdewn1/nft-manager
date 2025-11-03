// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NEØ NFT Contract
 * @dev Contrato ERC-721 simples para mint de NFTs
 */
contract NEONFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Base URI para metadados
    string private _baseTokenURI;
    
    // Preço de mint (em wei)
    uint256 public mintPrice = 0;
    
    // Limite de NFTs por wallet
    uint256 public maxPerWallet = 1000;
    
    // Mapeamento de quantidade mintada por wallet
    mapping(address => uint256) private _mintedPerWallet;

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mint NFT para um endereço
     * @param to Endereço que receberá a NFT
     * @param tokenURI URI dos metadados (geralmente IPFS)
     */
    function mint(address to, string memory tokenURI) public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(
            _mintedPerWallet[to] < maxPerWallet,
            "Max per wallet exceeded"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _mintedPerWallet[to]++;

        emit Minted(to, newTokenId, tokenURI);
    }

    /**
     * @dev Mint múltiplas NFTs
     */
    function mintBatch(
        address to,
        string[] memory tokenURIs
    ) public payable {
        require(msg.value >= mintPrice * tokenURIs.length, "Insufficient payment");
        require(
            _mintedPerWallet[to] + tokenURIs.length <= maxPerWallet,
            "Max per wallet exceeded"
        );

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            _safeMint(to, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
        }

        _mintedPerWallet[to] += tokenURIs.length;
    }

    /**
     * @dev Total de NFTs mintadas
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Quantidade mintada por wallet
     */
    function mintedBy(address wallet) public view returns (uint256) {
        return _mintedPerWallet[wallet];
    }

    /**
     * @dev Atualizar preço de mint (apenas owner)
     */
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    /**
     * @dev Atualizar limite por wallet (apenas owner)
     */
    function setMaxPerWallet(uint256 _max) public onlyOwner {
        maxPerWallet = _max;
    }

    /**
     * @dev Retirar fundos do contrato (apenas owner)
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Base URI para metadados
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Atualizar base URI (apenas owner)
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}

