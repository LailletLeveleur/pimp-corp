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

contract CharacterFactory is ERC721 {

    // using SafeMath for uint256;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );

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

    // The template for the characters to be minted
    CharacterAttributes[] prototypeCharacters;
    // NFT tokenId <> NFT info
    mapping(uint256 => CharacterAttributes) public tokenIdToCharacterAttributes;
    // NFT tokenId <> owner
    mapping(uint256 => address) public pimpToOwner;
    // owner <> NFT tokenIdS
    mapping(address => uint256[]) public ownerToNFTTokenIds;
    // the boss to be fought
    Cop public cop;

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
        CharacterAttributes memory charAttributes = tokenIdToCharacterAttributes[_tokenId];

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

    function isUserOwnerOfNFT(uint256 _tokenId) external view returns (bool) {
        bool exists = ownerToNFTTokenIds[msg.sender][_tokenId] > 0;
        return exists;
    }

    function getUserOwnedNFTs()
        public
        view
        returns (CharacterAttributes[] memory)
    {
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

    function getAllPrototypeCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return prototypeCharacters;
    }

    function getCop() public view returns (Cop memory) {
        return cop;
    }
}
