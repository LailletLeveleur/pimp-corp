// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./libraries/Base64.sol";
import "./CharacterFactory.sol";

contract PimpGame is CharacterFactory {
    
    event AttackComplete(
        uint256 newCopHp, 
        uint256 newPlayerHp);

    // owner <> staked NFT tokenIdS
    mapping(address => uint256[]) public ownerToStakedNFTTokenIds;


    function addToRaidPool(uint256[] memory tokenIdS) external {
        // uint[] memory userOwnedNFTs = ownerToNFTTokenIds[msg.sender];
        uint256 maxIdx = tokenIdS.length;

        // first we transfer
        for (uint256 idx = 0; idx < maxIdx; idx += 1) {
            uint256 tokenId = tokenIdS[idx];
            _stack(tokenId, address(this));
        }
    }    

    function _stack(uint256 tokenId, address to) private {
        require(pimpToOwner[tokenId] == msg.sender);
        if (pimpToOwner[tokenId] == msg.sender) {

            // transfer ownership
            safeTransferFrom(msg.sender, to, tokenId); // to =?= address(this), FIRST Try to transfer to contract ownership

            // remove from the user owned list
            removeTokenIdFromOwnerToTokenId(tokenId);

            // add to the stacked
            ownerToStakedNFTTokenIds[msg.sender].push(tokenId);

            // raidPool.push(tokenId);
            pimpToOwner[tokenId] = address(this);
        } else {
            console.log("You are not the owner of this Pimp you liar !");
        }
    }


    function _removeFromMapping(uint256 _id, mapping(address => uint256[]) storage _mapping) internal {
        
        // juste for test
        uint256[] storage tokenIds = _mapping;
        uint256 newMaxSize = tokenIds.length - 1;
        uint256[] memory newTokenIds = new uint256[](newMaxSize);
        uint256 newIdxCounter = 0;

        for (uint256 idx = 1; idx <= tokenIds.length - 1; idx += 1) {
            if (tokenIds[idx] != _id) {
                newTokenIds[newIdxCounter] = tokenIds[idx];
                console.log(newIdxCounter, " == ", newTokenIds[newIdxCounter]);
                newIdxCounter++;
            }
        }

        ownerToNFTTokenIds[msg.sender] = newTokenIds;
    }

    function removeTokenIdFromOwnerToTokenId(uint256 _tokenIdToRemove) public {
        return _removeFromMapping(_tokenIdToRemove, ownerToNFTTokenIds);
    }

    function raidFromPack() external {
        // for now the stacked pimp are the abble to raid
        uint256 packSize = raidPool.length;
        for (uint256 tokenId = 1; tokenId < packSize - 1; tokenId += 1) {
            _raidCop(tokenId, packSize * 4);
        }
    }

    function raidCop(uint256 tokenId) external {
        console.log("Trying to raid on Cop w/ address: ", pimpToOwner[tokenId]);
        //  require(msg.sender == pimpToOwner[tokenId], "You are not the owner of this Pimp you liar, real owner is");
        if (msg.sender == pimpToOwner[tokenId]) {
            _raidCop(tokenId, 1);
        } else {
            console.log("You are not the owner of this Pimp you liar !");
        }
    }

    function _raidCop(uint256 tokenId, uint256 packBonus) internal {
        console.log("\nRaid will start soon");

        CharacterAttributes storage nft = tokenIdToCharacterAttributes[tokenId];
        console.log(
            "- Pimp  %s about to attack. Has %s HP and %s Street cred",
            nft.name,
            nft.hp,
            nft.streetCred
        );
        console.log(
            "- Cop %s has %s HP and %s Street cred",
            cop.name,
            cop.hp,
            cop.streetCred
        );
        require(nft.hp > 0, Strings.toString(nft.hp));
        require(cop.hp > 0, "Cop is already dead you vulture");

        uint256 nftAttack = uint256(
            nft.streetCred + nft.streetCred * _random(100)**packBonus
        );
        uint256 copAttack = uint256(cop.streetCred * _random(3));

        uint256 nftLeftHp = uint256(nft.hp - copAttack);
        uint256 copLeftHp = uint256(cop.hp - nftAttack);

        console.log("- Pimp attacked with", nftAttack);
        console.log("- Cop attacked with", copAttack);

        if (nftLeftHp <= 0) {
            nft.hp = 0;
            console.log("- %s is dead", nft.name);
        } else {
            nft.hp = nftLeftHp;
            console.log("- %s has %s hp left", nft.name, nft.hp);
        }

        if (copLeftHp <= 0) {
            cop.hp = 0;
            console.log("- Cop is dead");
        } else {
            cop.hp = copLeftHp;
            console.log("- Cop %s has %s hp left", cop.name, cop.hp);
        }

        emit AttackComplete(cop.hp, nft.hp);
    }

    function _random(uint256 base) private view returns (uint256) {
        // sha3 and now have been deprecated
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            ) % base;
    }









    function removeFirstByValue(uint256[] memory values, uint256 value) public pure returns (uint256[] memory val) {
        uint8 increment = 0;
        uint maxIdx = values.length;
        for(uint256 idx = 0; idx < maxIdx; idx += 1) {
            if(values[idx] == value){//la valeur a supprimée est trouvée on commence a remplacer par le prochain et on ne prendra pas le dernier
                increment++;
                maxIdx--;
            }
            values[idx] = values[idx + increment];
        }
        return values;
    }

    function find(uint256[] memory values, uint256 value) internal pure returns (uint256) {
        uint i = 0;
        while (values[i] != value) {
            i++;
        }
        return i;
    }
}
