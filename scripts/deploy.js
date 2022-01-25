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
        100000,
        20,
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    // let txn;
    // txn = await gameContract.mintCharacterNFT(0);
    // await txn.wait();
    // console.log("Minted NFT #1");

    // let attackResult;
    // attackResult = await gameContract.raidCop(1);
    // await attackResult.wait();

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