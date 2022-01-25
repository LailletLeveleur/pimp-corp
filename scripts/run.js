const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('PimpGame');
    const gameContract = await gameContractFactory.deploy(
        ["German Pimp", "Black Pimp", "Lesbian scientist"],       // Names
        ["https://i.imgur.com/Njlx6yT.jpeg", // Images
        "https://i.imgur.com/XB9ykuO.jpeg",
        "https://i.imgur.com/DFbJk4x.png"
    ],
        [250, 150, 500],                    // HP values
        [150, 150, 50],                       // Charisma values
        [200, 300, 50],                       // Street cred values
        "Woke Me up before you gogo",
        "https://www.rueducine.com/wp-content/uploads/2015/01/rueducine.com-les-ripoux-photo-5-300x197.jpg",
        1000000,
        20,
    );
    await gameContract.deployed();
    //console.log("Contract deployed to:", gameContract.address);

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    await gameContract.connect(addr1).mintCharacterNFT(0);
    await gameContract.connect(addr1).mintCharacterNFT(0);
    await gameContract.connect(addr1).mintCharacterNFT(0);
    await gameContract.connect(addr2).mintCharacterNFT(1);
    await gameContract.connect(addr3).mintCharacterNFT(2);

    // Get the value of the NFT's URI.
    // let returnedTokenUri = await gameContract.tokenURI(1);
    // console.log("Token URI:", returnedTokenUri);

    // returnedTokenUri = await gameContract.tokenURI(2);
    // console.log("Token URI:", returnedTokenUri);

    // returnedTokenUri = await gameContract.tokenURI(3);
    // console.log("Token URI:", returnedTokenUri);

    // await gameContract.listNfts();
    
    // let attackResult;
    // attackResult = await gameContract.connect(addr1).raidCop(1);
    // await attackResult.wait();

    // attackResult = await gameContract.connect(addr2).raidCop(2);
    // await attackResult.wait();

    // attackResult = await gameContract.connect(addr3).raidCop(3);
    // await attackResult.wait();

    // pool for raid
    // await gameContract.connect(addr3).prepareRaid(owner.address, 3);
    // await gameContract.connect(addr2).prepareRaid(owner.address, 2);
    // await gameContract.connect(addr1).prepareRaid(owner.address, 1);

    // await gameContract.connect(owner).raidFromPack();

    let ownedNFT = await gameContract.connect(addr1).getUserOwnedNFTs();
    //await ownedNFT.wait();
    console.log(ownedNFT);
    for(var i =0; i < ownedNFT.length; i++){
        console.log(transformCharacterData(ownedNFT[i]));
    }
    
    // txn = await gameContract.connect(addr1).removeTokenIdFromOwnerToTokenId(1);
    // await txn.wait();
    
};

const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      charisma: characterData.charisma.toNumber(),
      streetCred: characterData.streetCred.toNumber(),
    };
  };

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();