import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Page } from './components/Page';
import { useCanStake } from './hooks';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';

const Appear = keyframes`
  from {
    opacity: 0;
    transform: scale(1.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: auto;
  padding: 5vh 0;
  border-radius: 24px;
  background: rgba(2, 14, 39, 0.9);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  align-items: center;
  justify-content: start;
  opacity: 0;
  animation: ${Appear} 0.5s 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;

  @media (max-width: 1600px) {
    width: 50%;
  }

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0px;
  }
`

const MenuContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const MenuEntry = styled.button`
  appearance: none;
  display: flex;
  outline: none;
  border: none;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  font-size: 190%;
  width: 100%;
  padding: 2% 0%;
  justify-content: center;
  align-items: center;

  margin: 1vh 0px;

  @media (max-width: 1600px) {
    font-size: 110%;
  }

  @media (max-width: 1400px) {
    font-size: 130%;
  }

  @media (max-width: 768px) {
    font-size: 120%;
  }

  &:hover:not(:disabled) {
    background: rgba(0, 62, 179, 0.7);
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
    opacity:  0.5;
  }
  
  &:active {
    background: rgba(0, 62, 179, 0.5);
  }
`

const LogoAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const Logo = styled.img`
  height: 320px;
  margin-top: 1%;
  animation: ${LogoAnimation} 3s ease-in-out infinite;
  filter: drop-shadow(0px 8px 4px rgba(0, 0, 0, 0.4));

  @media (max-width: 1600px) {
    height: 128px;
  }

  @media (max-width: 1400px) {
    height: 192px;
  }

  @media (max-width: 768px) {
    height: 256px;
  }
`

const SocialNetworksRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 32px;
`

const SocialNetworkButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: none;
  background: #005eca;
  border-bottom: 4px solid #0046a1; 
  margin: 0px 1vh;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
  
  &:hover {
    transform: scale(1.1);
    background: #0056d8;
  }
  
  &:active {
    transform: scale(0.95);
    background: #0047a5;
  }
`

const SocialNetworkIcon = styled.img`
  width: 32px;
  height: 32px;
`

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 24px;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`

function App() {
  const { chainId } = useEthers();
  const [, setStakeState] = useState(false);
  const canStake = useCanStake(chainId!);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CS", canStake);
    if (canStake) {
      setStakeState(canStake);
    } else {
      setStakeState(false);
    }
  }, [canStake]);

  return (
    <Page style={{ background: `url(${process.env.PUBLIC_URL + 'images/LandingBackground.jpg'})`, backgroundSize: 'cover', flexDirection: 'column', justifyContent: 'start' }}>
      <Logo src={process.env.PUBLIC_URL + '/images/logo_notfinal.png'} />
      <Container>
        <MenuContainer>
          <MenuEntry onClick={() => navigate("/minting")}>MINTING</MenuEntry>
          <MenuEntry disabled={false} onClick={() => navigate("/staking")}>THE LAB (STAKING)</MenuEntry>
          <MenuEntry disabled={true} style={{ opacity: 0.5, }} onClick={() => navigate("/vault")}>THE BUNKER (VAULT)</MenuEntry>
          <MenuEntry style={{ marginTop: 32 }} onClick={() => window.open(process.env.PUBLIC_URL + "whitepaper.pdf")}><Icon src={process.env.PUBLIC_URL + 'images/icon_whitepaper.png'} />WHITEPAPER</MenuEntry>
        </MenuContainer>

        <SocialNetworksRow>
          <SocialNetworkButton onClick={() => window.open('https://twitter.com/humanzombieftm')}>
            <SocialNetworkIcon src={process.env.PUBLIC_URL + '/images/icon_twitter.png'} />
          </SocialNetworkButton>
          <SocialNetworkButton onClick={() => window.open('https://discord.gg/AywafwNj8r')}>
            <SocialNetworkIcon src={process.env.PUBLIC_URL + '/images/icon_discord.png'} />
          </SocialNetworkButton>
          <SocialNetworkButton onClick={() => window.open('https://medium.com/@humanvszombieftm/human-vs-zombie-ftm-ca384460d6e')}>
            <SocialNetworkIcon src={process.env.PUBLIC_URL + '/images/icon_medium.png'} />
          </SocialNetworkButton>
        </SocialNetworksRow>
      </Container>
    </Page>
  );
}
// import styled, { keyframes } from 'styled-components';
// import { useEthers, useTokenBalance } from '@usedapp/core';
// import { useNavigate } from 'react-router-dom';
// import { Page } from './components/Page';
import { contractAddr, useFreeminter, useFreeMintNFT, useIsWhitelist, useMinted, useMintNFT, useMintPrice, useWLMintPrice } from './hooks';
// import { useEffect, useState } from 'react';
import { formatEther } from '@ethersproject/units'
import { formatUnits } from 'ethers/lib/utils';
// import { isMobile } from 'react-device-detect';

function Minting() {
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState({
        show: false,
        message: "",
        state: 0
    });


    const { activateBrowserWallet, account, chainId, library, error } = useEthers();
    const { send: mintNFT, state: mintNFTstate } = useMintNFT(chainId!);
    const { send: freemintNFT } = useFreeMintNFT(chainId!);

    const price = useMintPrice(chainId!);
    const wlprice = useWLMintPrice(chainId!);
    const isWhitelist = useIsWhitelist(chainId!);
    const minted = useMinted(chainId!);
    const freeminter = useFreeminter(chainId!, account!);
    const virusBalance = useTokenBalance(contractAddr.virus[chainId! || 250], account);

    const [amount, setAmount] = useState(1);

    const onMintClicked = async () => {
        await mintNFT(amount, false, { value: ((isWhitelist ? wlprice : price) * amount).toString() });
    }

    const onFreeMintClicked = async () => {
        await freemintNFT(5, false);
    }

    const onDecrease = () => {
        if (!(amount - 1 <= 0)) {
            if (amount - 1 <= 5) {
                setAmount(amount - 1);
            } else {
                setAmount(amount - 5);
            }
        }
    }

    const onIncrease = () => {
        if (!(amount + 1 >= 30)) {
            if (amount + 1 <= 5) {
                setAmount(amount + 1);
            } else {
                setAmount(amount + 5);
            }
        }
    }

    useEffect(() => {
        if (error) {
            console.warn(error);
            debugger;
        }
    }, [error, chainId]);

    useEffect(() => {
        if (mintNFTstate) {
            if (mintNFTstate.status === 'Exception' || mintNFTstate.status === 'Fail') {
                setShowNotification({
                    show: true,
                    message: mintNFTstate.errorMessage!,
                    state: (mintNFTstate.status === 'Exception' || mintNFTstate.status === 'Fail') ? -1 : 1
                });
            }

            if (mintNFTstate.status === 'Success') {
                setShowNotification({
                    show: true,
                    message: 'MINTING SUCCESSFUL !',
                    state: 1
                });
            }

            // Hide notification after 4s
            setTimeout(() => {
                setShowNotification({
                    show: false,
                    message: 'MINTING SUCCESSFUL !',
                    state: 0
                });
            }, 4000);
        }
    }, [mintNFTstate])

    useEffect(() => {

    }, [freeminter, price, wlprice, isWhitelist])

    const handleConnectButton = () => {
        activateBrowserWallet();

        if (chainId !== 250) {
            if (library && library.provider.request) {
                library.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xFA',
                            chainName: 'Fantom Opera',
                            nativeCurrency: {
                                name: 'Fantom',
                                symbol: 'FTM',
                                decimals: 18,
                            },
                            rpcUrls: [
                                'https://rpc.ftm.tools/'
                            ],
                            blockExplorerUrls: ['https://ftmscan.com/']
                        }
                    ]
                })
            } else if ((window as Window & typeof globalThis & { ethereum: any }).ethereum) {
                (window as any).ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xFA',
                            chainName: 'Fantom Opera',
                            nativeCurrency: {
                                name: 'Fantom',
                                symbol: 'FTM',
                                decimals: 18,
                            },
                            rpcUrls: [
                                'https://rpc.ftm.tools/'
                            ],
                            blockExplorerUrls: ['https://ftmscan.com/']
                        }
                    ]
                })
            }
        }
    }

    return (
        <Page style={{ background: `url(${process.env.PUBLIC_URL + 'images/StarPattern.jpg'})`, flexDirection: 'column' }}>
            <Header>
                <Title>MINTING</Title>
            </Header>
            <HeaderButtons>
                {
                    !isMobile &&
                    <>
                        <MetamaskButton style={{ marginRight: 24 }} onClick={() => navigate("/", { replace: true })}>
                            BACK TO MENU
                        </MetamaskButton>
                    </>
                }
                <MetamaskButton onClick={handleConnectButton}>
                    <MetamaskLogo src={process.env.PUBLIC_URL + 'images/icon_metamask.png'} />
                    {
                        account ?
                            (chainId === 250 ?
                                `${account.slice(0, 7)}...${account.slice(account.length - 6, account.length)}`
                                : "SWITCH NETWORK")
                            : "CONNECT WALLET"
                    }
                </MetamaskButton>
            </HeaderButtons>

            <Container>
                {
                    showNotification.show &&
                    <Notification success={showNotification.state !== -1}>{showNotification.message}</Notification>
                }
                <InnerContainer>
                    <Row>
                        <NFTShowcase style={{ borderColor: 'rgb(0, 255, 90)', boxShadow: '0px 0px 12px rgb(0, 255, 80)', background: 'linear-gradient(0deg, rgb(0, 255, 115),rgb(0, 155, 62))' }}>
                            <NFTImage src={process.env.PUBLIC_URL + 'images/p_zombie.gif'} />
                        </NFTShowcase>
                        <NFTShowcase style={{ borderColor: 'rgb(0, 132, 255)', boxShadow: '0px 0px 12px rgb(0, 119, 255)', background: 'linear-gradient(0deg, rgb(0, 87, 200), rgb(0, 55, 100))' }}>
                            <NFTImage src={process.env.PUBLIC_URL + 'images/p_human.gif'} />
                        </NFTShowcase>
                    </Row>
                    <Row>
                        <DescriptionText>
                            A violent battle now pits the last human survivors against the <span style={{ fontFamily: 'UPHeaval', color: 'rgb(0, 255, 0)' }}>zombies</span> who are trying to steal the <span style={{ fontFamily: 'UPHeaval', color: 'rgb(0, 255, 0)' }}>$VIRUS</span> samples in order to contaminate the entire human race.<br />
                            The <span style={{ fontFamily: 'UPHeaval', color: 'rgb(0, 132, 255)' }}>humans</span> will do anything to survive and kill any Zombie who tries to oppose them and infiltrate the LAB !<br />
                        </DescriptionText>
                    </Row>
                    <ProgressBackground style={{ marginTop: 8 }}>
                        {
                            minted && <ProgressForeground style={{ width: `${(minted / 50000) * 100}%` }} />
                        }
                        <Marker description='GEN 0 - 40 FTM' position={20} />
                        <Marker description='20 000 $VIRUS' position={40} />
                        <Marker description='40 000 $VIRUS' position={60} />
                        <Marker description='60 000 $VIRUS' position={80} />
                    </ProgressBackground>

                    <MintText>{minted ? minted : "0"} / 50 000 MINTED</MintText>
                    <h6 style={{ marginTop: 16, fontSize: '110%', textAlign: 'center' }}>YOU HAVE {virusBalance && parseFloat(formatUnits(virusBalance, 18)).toFixed(2)} <span style={{ color: 'rgb(0, 255, 0)' }}>$VIRUS</span></h6>
                    {
                        account ?
                            <>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ marginTop: 24 }}>
                                        <MetamaskButton className='notHeader' onClick={onDecrease} style={{ marginTop: 16, marginRight: 16 }}>-</MetamaskButton>
                                        <MetamaskButton className='notHeader' onClick={onMintClicked} style={{ marginTop: 16 }}>MINT {amount} NFT{amount > 1 && "s"}</MetamaskButton>
                                        <MetamaskButton className='notHeader' onClick={onIncrease} style={{ marginTop: 16, marginLeft: 16 }}>+</MetamaskButton>
                                    </View>
                                    {
                                        freeminter && <MetamaskButton className='notHeader' onClick={onFreeMintClicked} style={{ marginTop: 16 }}>FREE MINT 5 NFTs</MetamaskButton>
                                    }
                                    <p style={{ marginTop: 24 }}>1 NFT = {(price && (isWhitelist !== undefined)) ? formatEther(isWhitelist ? wlprice : price) : "???"} FTM</p>
                                    {
                                        isWhitelist && <p style={{ marginTop: 24 }}>WHITELIST ONLY !</p>
                                    }
                                </View>
                            </>
                            : <p style={{ textAlign: 'center' }}>CONNECT YOUR WALLET FIRST.</p>
                    }
                </InnerContainer>
            </Container>
        </Page>
    );
}

export default App;
