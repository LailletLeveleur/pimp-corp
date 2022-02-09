// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Strings.sol";
// import "hardhat/console.sol";
// NFT contract to inherit from.
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// // Helper functions OpenZeppelin provides.
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

// import "./libraries/Base64.sol";
import "./CharacterFactory.sol";

contract PimpGame is CharacterFactory {
    using Counters for Counters.Counter;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterCharisma,
        uint256[] memory characterStreetCred,
        string memory copName, // These new variables would be passed in via run.js or deploy.js.
        string memory copImageURI,
        uint256 copHp,
        uint256 copStreetCred
    ) ERC721("Pimps&Co", "PIMP") {
        cop = Cop({
            characterIndex: 1,
            name: copName,
            imageURI: copImageURI,
            hp: copHp,
            maxHp: copHp,
            streetCred: copStreetCred
        });

        console.log(
            "Done initializing %s w/ HP %s, img %s",
            cop.name,
            cop.hp,
            cop.imageURI
        );

        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            prototypeCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    charisma: characterCharisma[i], // capacity to enroll whores
                    streetCred: characterStreetCred[i] // capacity to not be stolen by other and better return on whores
                })
            );

            CharacterAttributes memory c = prototypeCharacters[i];
            console.log("-- Index", c.characterIndex);
            console.log(
                "   Done initializing %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }
        tokenIDs.increment(); // start to 1
    }

    event AttackComplete(uint256 newCopHp, uint256 newPlayerHp);

    // owner <> staked NFT tokenIdS
    mapping(address => uint256[]) public ownerToStakedNFTTokenIds;
    // the tlist of the current staked tokenIds
    uint256[] internal stackedTokenId;

    function addToAttackStackPool(uint256[] memory tokenIdS) public {
        console.log("$$ msg.sender", msg.sender);
        console.log("$$ address(this)", address(this));
        // uint[] memory userOwnedNFTs = ownerToNFTTokenIds[msg.sender];
        uint256 maxIdx = tokenIdS.length;

        // first we transfer
        for (uint256 idx = 0; idx < maxIdx; idx += 1) {
            uint256 tokenId = tokenIdS[idx];
            _stack(tokenId);
        }
    }

    function _stack(uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        console.log("# owner", owner);
        console.log("# msg.sender", msg.sender);
        console.log("# address(this)", address(this));
        require(owner == msg.sender);
        // transfer ownership
        safeTransferFrom(owner, address(this), tokenId);

        // remove from the user owned list
        _removeFromList(tokenId, ownerToNFTTokenIds[msg.sender]);

        // add to the stacked, just to ease retrieval...
        ownerToStakedNFTTokenIds[msg.sender].push(tokenId);
        stackedTokenId.push(tokenId);

        // raidPool.push(tokenId);
        pimpToOwner[tokenId] = address(this);
    }

    function _removeFromList(uint256 _id, uint256[] memory list) internal {
        // juste for test
        uint256 newMaxSize = list.length - 1;
        uint256[] memory newTokenIds = new uint256[](newMaxSize);
        uint256 newIdxCounter = 0;

        for (uint256 idx = 1; idx <= list.length - 1; idx += 1) {
            if (list[idx] != _id) {
                newTokenIds[newIdxCounter] = list[idx];
                console.log(newIdxCounter, " == ", newTokenIds[newIdxCounter]);
                newIdxCounter++;
            }
        }

        ownerToNFTTokenIds[msg.sender] = newTokenIds;
    }

    function allAttack() external {
        // for now the stacked pimp are the abble to raid
        console.log("\n Cop i going to be attacked soon");
        //console.log(stackedTokenId);
        uint256 maxIdx = stackedTokenId.length;
        console.log('stackedTokenId.length ',stackedTokenId.length);
        for (uint256 idx = 0; idx < maxIdx; idx += 1) {
            console.log('idx ',idx);
            _attackCop(stackedTokenId[idx], maxIdx * 3);
        }
    }

    function attackCop(uint256 tokenId) external {
        console.log("Trying to raid on Cop w/ address: ", pimpToOwner[tokenId]);
        //  require(msg.sender == pimpToOwner[tokenId], "You are not the owner of this Pimp you liar, real owner is");
        if (msg.sender == pimpToOwner[tokenId]) {
            _attackCop(tokenId, 1);
        } else {
            console.log("You are not the owner of this Pimp you liar !");
        }
    }

    function _attackCop(uint256 tokenId, uint256 packBonus) internal {
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

        uint256 nftAttack = uint256(nft.streetCred + nft.streetCred * _random(packBonus) );
        uint256 copAttack = uint256(cop.streetCred * _random(3));
        console.log('nft.hp', nft.hp, 'nftAttack', nftAttack);
        console.log('cop.hp', cop.hp, 'copAttack', copAttack);

        uint256 nftLeftHp;
        if(copAttack <= nft.hp){
            nftLeftHp = uint256(nft.hp - copAttack);
        } else{
            nftLeftHp = 0;
        }

        uint256 copLeftHp;
        if(nftAttack <= cop.hp){
            copLeftHp = uint256(cop.hp - nftAttack);
        } else{
            copLeftHp = 0;
        }


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

    function _random(uint256 base) internal view returns (uint256) {
        // sha3 and now have been deprecated
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            ) % base;
    }

    function removeFirstByValue(uint256[] memory values, uint256 value)
        internal
        pure
        returns (uint256[] memory val)
    {
        uint8 increment = 0;
        uint256 maxIdx = values.length;
        for (uint256 idx = 0; idx < maxIdx; idx += 1) {
            if (values[idx] == value) {
                //la valeur a supprimée est trouvée on commence a remplacer par le prochain et on ne prendra pas le dernier
                increment++;
                maxIdx--;
            }
            values[idx] = values[idx + increment];
        }
        return values;
    }

    function find(uint256[] memory values, uint256 value)
        internal
        pure
        returns (uint256)
    {
        uint256 i = 0;
        while (values[i] != value) {
            i++;
        }
        return i;
    }
}
