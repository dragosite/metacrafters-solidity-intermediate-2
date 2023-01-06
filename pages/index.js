import { useEffect } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { abi } from '../backend/contractsData/FundMe.json'
import { address } from '../backend/contractsData/FundMe-address.json'

export default function Home() {
  
  async function connect(){
    if( typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
        await window.ethereum.request({method: "eth_requestAccounts"});
        document.getElementById("connect-button").innerHTML = "Connected";
    } else {
      document.getElementById("connect-button").innerHTML = "Please install MetaMask to continue";
    }
  }
  
  async function fund(ethAmount){
    ethAmount = document.getElementById('ethAmount').value;
    console.log(`Funding with ${ethAmount}...`);
    if( typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
        const provider = new ethers.providers.Web3Provider( window.ethereum );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)});
            console.log(transactionResponse)
            await listenToTransactionMine(transactionResponse, provider);
            displayGoal();
        } catch(error) {
            console.log(error);
        }
    }
  }
  
  async function balance(){
    if( typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
        const provider = new ethers.providers.Web3Provider( window.ethereum );
        const balance = await provider.getBalance(address);
        const eth = ethers.utils.formatEther(balance);
        console.log(`${eth} ETH`);
    }
  }

  async function displayGoal(){
    if( typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
        const provider = new ethers.providers.Web3Provider( window.ethereum );
        const balance = await provider.getBalance(address);
        const eth = ethers.utils.formatEther(balance);
        document.getElementById('raised').innerHTML = eth;
        document.getElementById('goal-so-far').setAttribute("style","width:"+eth+"%");
        console.log(`${eth} ETH`);
    }
  }
  
  async function withdraw(){
    console.log(`Withdrawing...`);
    if( typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
        const provider = new ethers.providers.Web3Provider( window.ethereum );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenToTransactionMine(transactionResponse, provider);
            displayGoal();
        } catch(error) {
            console.log(error);
        }
    }
  }
  
  useEffect( () => {
    displayGoal()
  }, [])
  
  function listenToTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmation(s)`);
            resolve();
        });
    })
  }
  return (
    <>
      <Head>
        <title>FundMe dApp</title>
        <meta name="description" content="FundMe dApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Hello! Please donate to my cause!</h1>
      
        <button id="connect-button" onClick={connect}>Connect with MetaMask</button>
        <h2>Donate here</h2>
        <label htmlFor="fund">ETH Amount</label>
        <input id="ethAmount" placeholder="0.1"/>
        <button id="fund-button" onClick={fund}>Donate</button>
        <div className="goal-wrapper">
            <p>
                Raised <span id="raised">0</span> out of 100ETH goal
            </p>
            <span id="goal">
                <span id="goal-so-far"></span>
            </span>
        </div>
        <br/><br/>
        <h2>Admin only</h2>
        <button id="balance-button" onClick={balance}>Get Balance</button>
        <button id="withdraw-button" onClick={withdraw}>Withdraw</button>
      </main>
    </>
  )
}
