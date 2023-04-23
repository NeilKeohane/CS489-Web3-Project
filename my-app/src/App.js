import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from "ethers";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names';

// Logos for the header
import logo from './running-man-silhouette-19.webp';
import logo2 from './finish-line.webp'

// Smart Contract Information
//import abi from "../artifacts/contracts/Workout.sol/Workout.json"
//const contractABI = abi.abi;
const contractAddress = "0x4171A1De0dbd7A19CA83048e32B6C1de11590c62";
const providerUrl = "http://localhost:8545";


// Function to create new account (not used)
async function handleCreateNewAccount(event) {
  const [newAccountId, setNewAccountId] = useState("");
  event.preventDefault();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    const newAccount = await contract.createNew(newAccountId);
    console.log("New account created:", newAccount);
    // Do something with the new account, such as updating the UI
  } catch (error) {
    console.error(error);
  }
}


// Function to connect to wallet to retrieve users miles run
async function fetchMilesRun() {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const milesRun = await contract.getMilesRun();
  console.log(milesRun)
  return milesRun;
  
}

// Login component
function Login({ onLogin, onConnect }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log("Logging in...")
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }



  

  
  return (
    
      <form className="login-form" onSubmit={handleSubmit}>
        <LoginWallet onConnect={onConnect} />
      </form>

  );
}


// Header component
function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="Logo" className="app-logo" />
      <h1 className="app-title">Milestones</h1>
      <img src={logo2} alt="New Logo" className="app-new-logo" />
    </header>
  );
}


// Dashboard component
function Dashboard({ walletAddress, onLogout }) {
  const [milesRun, setMilesRun, timeRan] = useState("");
  console.log('Dashboard...')

  // Fetches the users miles from the contract when dashboard displays
  useEffect(() => {
    (async () => {
      //const miles = await fetchMilesRun();
      //console.log(miles)
      // Assign fetched milesRun value to the milesRun state variable
      //setMilesRun(miles.toString());
      //console.log(miles.toString())
    })();
  }, []);


  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {walletAddress}</p>
      <p>Total Time Spent Running: {timeRan}</p>
      <p>Total Miles Run: {milesRun}</p>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
}


// Goal / Progress form component
function GoalForm() {
  const [goal, setGoal] = useState('');
  const [progress, setProgress] = useState(0);

  function handleGoalChange(event) {
    setGoal(event.target.value);
  }

  function handleProgressChange(event) {
    setProgress(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle goal and progress logic here
  }

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <h2>Set Goal and Record Progress</h2>
      <label>
        Goal:
        <input type="text" value={goal} onChange={handleGoalChange} />
      </label>
      <label>
        Progress:
        <input type="number" value={progress} onChange={handleProgressChange} />
      </label>
      <button type="submit">Submit</button>
      <WorkoutInformation />
    </form>
  );
}


// Wallet Component
function LoginWallet({ onConnect}) {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("No Ethereum wallet detected. Please install MetaMask.");
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        console.log(currentAccount);
        setWalletAddress(currentAccount);
        setConnected(true);
        onConnect(currentAccount); // Call the onConnect callback with the wallet address
      } else {
        console.log("No accounts found!");
        alert("No accounts found. Please connect a wallet with an account.");
        return;
      }
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setConnected(true);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to wallet.");
    }
  }

  return (
    <div>
      <p>Connect your wallet:</p>
      {connected ? (
        <p>You are already connected with address: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

// Workout Information Component
function WorkoutInformation() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function handleHoursChange(event) {
    setHours(event.target.value);
  }

  function handleMinutesChange(event) {
    setMinutes(event.target.value);
  }

  function handleSecondsChange(event) {
    setSeconds(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle submission logic here
  }

  return (
    <div className="workout-information">
      
      <h2><br></br>Enter Workout Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="hours-box">
          <label>
            Hours:
            <input type="number" value={hours} onChange={handleHoursChange} />
          </label>
        </div>
        <div className="minutes-box">
          <label>
            Minutes:
            <input type="number" value={minutes} onChange={handleMinutesChange} />
          </label>
        </div>
        <div className="seconds-box">
          <label>
            Seconds:
            <input type="number" value={seconds} onChange={handleSecondsChange} />
          </label>
        </div>
        <div className="submit-button-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}


// Main App component
function App() {
  console.log("App..")
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newAccountId, setNewAccountId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");


  function handleLogout() {
    setIsLoggedIn(false);
  }

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  function handleConnect(walletAddress) {
    setIsLoggedIn(true);
    setWalletAddress(walletAddress);
  }

  return (
    <div className="app-container">
      <Header />
      {isLoggedIn && walletAddress ? (
        <div className="dashboard-container">
          <Dashboard
            walletAddress={walletAddress}
            onLogout={handleLogout}
          />
          <GoalForm />
        </div>
      ) : (
        <Login onLogin={handleLogin} onConnect={handleConnect} />
      )}

      <div className="app-container"></div>
    </div>
  );
}









export default App;
