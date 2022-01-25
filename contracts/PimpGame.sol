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

contract PimpGame is ERC721 {
    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(uint256 newCopHp, uint256 newPlayerHp);

    // We'll hold our character's attributes in a struct. Feel free to add
    // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 charisma; // recruitment fees & nb of whores under its
        uint256 streetCred; // fight other pimp, chance to get arrested
    }

    struct Cop {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 streetCred; // fight capacity
    }
    Cop public cop;

    struct Whore {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 charisma; // more Rose per level
    }

    // The tokenId is the NFTs unique identifier, it's just a number that goes
    // 0, 1, 2, 3, etc.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // A lil array to help us hold the default data for our characters.
    // This will be helpful when we mint new characters and need to know
    // things like their HP, AD, etc.
    CharacterAttributes[] prototypeCharacters;

    uint256[] public raidPool;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public tokenIdToCharacterAttributes;

    // A mapping from an address => the NFTs tokenId. Gives me an ez way
    // to store the owner of the NFT and reference it later.
    mapping(uint256 => address) public pimpToOwner;

    mapping(address => uint256[]) public ownerToNFTTokenIds;

    // Data passed in to the contract when it's first created initializing the characters.
    // We're going to actually pass these values in from run.js.
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
        _tokenIds.increment(); // start to 1
    }

    // Users would be able to hit this function and get their NFT based on the
    // characterId they send in!
    function mintCharacterNFT(uint256 _characterIndex) external {
        // Get current tokenId (starts at 1 since we incremented in the constructor).
        uint256 newItemId = _tokenIds.current();

        // The magical function! Assigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        // We map the tokenId => their character attributes. More on this in
        // the lesson below.
        tokenIdToCharacterAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: prototypeCharacters[_characterIndex].name,
            imageURI: prototypeCharacters[_characterIndex].imageURI,
            hp: prototypeCharacters[_characterIndex].hp,
            maxHp: prototypeCharacters[_characterIndex].maxHp,
            charisma: prototypeCharacters[_characterIndex].charisma, // capacity to enroll whores
            streetCred: prototypeCharacters[_characterIndex].streetCred // capacity to not be stolen by other and better return on whores
        });

        ownerToNFTTokenIds[msg.sender].push(newItemId);

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s for %s",
            newItemId,
            _characterIndex,
            msg.sender
        );

        // Keep an easy way to see who owns what NFT.
        pimpToOwner[newItemId] = msg.sender;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = tokenIdToCharacterAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strCharisma = Strings.toString(charAttributes.charisma);
        string memory strStreetCred = Strings.toString(
            charAttributes.streetCred
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer! in a Pimped fashion", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Charisma", "value": ',
                strCharisma,
                '}, { "trait_type": "Street credibility", "value": ',
                strStreetCred,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function prepareRaid(address to, uint256 tokenId) external {
        // require(pimpToOwner[tokenId] == msg.sender);
        if (pimpToOwner[tokenId] == msg.sender) {
            safeTransferFrom(msg.sender, to, tokenId);
            raidPool.push(tokenId);
            pimpToOwner[tokenId] = address(this);
        } else {
            console.log("You are not the owner of this Pimp you liar !");
        }
    }

    function getUserOwnedNFTs() public view returns (CharacterAttributes[] memory) {
        uint256[] memory tokenIds = ownerToNFTTokenIds[msg.sender];
        CharacterAttributes[] memory characterAttributes;
        uint256 maxIdx = tokenIds.length;

        if (maxIdx > 0) {
            characterAttributes = new CharacterAttributes[](maxIdx);
            for (uint256 idx = 0; idx < maxIdx; idx += 1) {
                characterAttributes[idx] = tokenIdToCharacterAttributes[tokenIds[idx]];                
            }
        }
        return characterAttributes;
    }

    function isUserOwnerOfNFT(uint256 _tokenId) external view returns (bool) {
        bool exists = ownerToNFTTokenIds[msg.sender][_tokenId] > 0;
        return exists;
    }


    function removeTokenIdFromOwnerToTokenId(uint256 _tokenIdToRemove)
        external
    {
        // juste for test
        uint256[] storage tokenIds = ownerToNFTTokenIds[msg.sender];
        uint256 newMaxSize = tokenIds.length - 1;
        uint256[] memory newTokenIds = new uint256[](newMaxSize);
        uint256 newIdxCounter = 0;

        for (uint256 idx = 1; idx <= tokenIds.length - 1; idx += 1) {
            if (tokenIds[idx] != _tokenIdToRemove) {
                newTokenIds[newIdxCounter] = tokenIds[idx];
                console.log(newIdxCounter, " == ", newTokenIds[newIdxCounter]);
                newIdxCounter++;
            }
        }

        ownerToNFTTokenIds[msg.sender] = newTokenIds;
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

    function getAllPrototypeCharacters() public view returns (CharacterAttributes[] memory)  {
        return prototypeCharacters;
    }

    function getCop() public view returns (Cop memory) {
        return cop;
    }
}
