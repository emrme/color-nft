pragma solidity ^0.4.24;
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TradeableERC721Token.sol";

/**
 * @title Color
 * Color - a contract for non-fungible colors.
 */
contract Color is TradeableERC721Token {

  string private baseURI;

  constructor(address _proxyRegistryAddress) TradeableERC721Token("Color", "CLR", _proxyRegistryAddress) public { 
    baseURI = "https://last-pixel-api.herokuapp.com/api/color/";
   }

  function baseTokenURI() public view returns (string) {
    return baseURI;
  }

  function setBaseTokenURI(string _newBaseURI) external onlyOwner {
    baseURI = _newBaseURI;
  }

}