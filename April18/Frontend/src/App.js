/*
Group 2
CS489 Crypto Blockchain
*/

import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";  // npm install ethers@5.7.2
import abi from "./utils/Workout.json";  // json object of our abi file


function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  // Change the contract address: 
  const contractAddress = "0xD15A78a5897BFC006ac3287A8AAE41021bd08E0A";  // ***FIX ME***

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("No ETH wallet detected.");
        alert("No ETH wallet detected.");
        return;
      } else {
        console.log("ETH detected: ", ethereum);
        alert("ETH detected.");
      }

      // Pulls array of accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        alert("Found an authorized account.");
      } else {
        console.log("No authorized account found");
        alert("No authorized account found.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Allows to connect an auth'd wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("ETH Wallet could not be connected");
        return;
      }

      // Makes request to connect to ETH account (Metamask wallet)
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      alert("ETH wallet connected.");

      // Set the currAccount state within this component to know the address of the account
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  

  const logExercise = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WorkoutContract = new ethers.Contract(contractAddress, contractABI, signer);

        const distMiles = event.target.distanceMiles.value;
        const distFract = event.target.distanceFract.value;
        const hours = event.target.hrs.value;
        const mins = event.target.mins.value;
        const secs = event.target.secs.value;

        const addTxn = await WorkoutContract.logExercise(distMiles, distFract, hours, mins, secs);
        console.log("Waiting to be validated...", addTxn.hash);

        await addTxn.wait();
        console.log("Validated: ", addTxn.hash);

        alert("Exercise logged.");

    } else {
      console.log("ETH window obj doesn't exist...")
    }
    } catch (error) {
      console.log(error);
      alert(error.reason);
    }
  }


  const [stats, setStats] = useState("");
  const labels = ['', 'miles', 'h', 'm', 's', '', '', 'miles'];
  const seeMyStatsHelper = async (event) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const WorkoutContract = new ethers.Contract(contractAddress, contractABI, signer);

        let stats = [];
        let statsBig = await WorkoutContract.getMyRuns();
        
        for(let i = 0; i < statsBig.length; i++)
        {
          stats.push(statsBig[i].toNumber());
        }
        
        setStats(stats);
        
    } else {
      console.log("ETH window obj doesn't exist...")
    }
    } catch (error) {
      console.log(error);
      alert(error.reason);
    }
  }
  
  const seeMyStats = () => {
    seeMyStatsHelper();
    setTimeout(() => {
      setStats("");
    }, 20000);
  }



  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        Welcome to Milestones.
        <img src={logo} className="App-logo" alt="logo"
        width = "175"
        height = "175" />
        <br/>

        {!currentAccount && (
          <button onClick={connectWallet}>
            Connect Wallet
          </button>
        )}


      <form onSubmit={logExercise}>
        <label>
          Distance:{" "}
          <input
          type="number" min="0"
          name="distanceMiles"
          />
        </label>
        <label>
          .
          <input
          type="number" min="0"
          name="distanceFract"
          />
        {" "}miles
        </label>
        <br></br><br></br>
          <label>
            Time:{" "}
            <input
            type="number" min="0"
            name="hrs"
            />
            h{" "}
          </label>
          <label>
            <input
            type="number" min="0"
            name="mins"
            />
            m{" "}
          </label>
          <label>
            <input
            type="number" min="0"
            name="secs"
            />
            s{" "}
          </label>
          <br></br><br></br>
          <input value="Submit Exercise" type="submit" />
      </form>

      <button onClick={seeMyStats}>
        See My Stats
      </button>
      {stats.length > 0 && (
      <ul>
        <li>Total Distance: {stats[0]}{'.'}{stats[1]} {labels[1]}</li>
        <li>Total Time: {stats[2]}{' '}{labels[2]}{' : '}{stats[3]}{' '}{labels[3]}{' : '}{stats[4]}{' '}{labels[4]}{' '}</li>
        <li>Total Runs: {labels[5]}{stats[5]}</li>
        <li>Longest Run: {labels[6]}{stats[6]}{'.'}{stats[7]}{labels[7]}</li>
      </ul>
)}

      </header>
    </div>
  );
}

export default App;