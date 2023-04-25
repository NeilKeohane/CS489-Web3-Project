import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from "ethers";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names';

// Logos for the header
import logo from './running-man-silhouette-19.webp';
import logo2 from './finish-line.webp'

// Smart Contract Information

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "contract MilestonesCoin",
        "name": "_coin",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "coin",
    "outputs": [
      {
        "internalType": "contract MilestonesCoin",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "database",
    "outputs": [
      {
        "internalType": "address",
        "name": "id",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "totalMiles",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "totalMilesFract",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "totalHours",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "totalMinutes",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "totalSeconds",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "longestRunMiles",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "longestRunFract",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "numberRuns",
        "type": "uint16"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMilesRun",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyRuns",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRewards",
    "outputs": [
      {
        "internalType": "uint16[]",
        "name": "",
        "type": "uint16[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalTimeSpent",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "log",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "miles",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "timeH",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "timeM",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "timeS",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "distanceRanMiles",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "distanceRanFract",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "hrs",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "mins",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "secs",
        "type": "uint8"
      }
    ],
    "name": "logExercise",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "rewards",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = "0xe55C26C10035D58C510C0d694e7afD01DA9c9e02";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");










const Milestones = () => {
  const [milestones, setMilestones] = useState([
    { id: 1, name: "Milestone 1", completed: false },
    { id: 25, name: "Milestone 2", completed: false },
    { id: 75, name: "Milestone 3", completed: false },
    { id: 150, name: "Milestone 4", completed: false },
    { id: 250, name: "Milestone 5", completed: false },
    { id: 500, name: "Milestone 6", completed: false },
    { id: 750, name: "Milestone 7", completed: false },
    { id: 1000, name: "Milestone 8", completed: false },
  ]);

  // Update the milestones when the component mounts
  useEffect(() => {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    //const rewardTuple = contract.getRewards();
    //console.log(rewardTuple);
    setMilestones((prevMilestones) => {
      return prevMilestones.map((milestone) => {
        if ([1].includes(milestone.id)) {
          return { ...milestone, completed: true };
        }
        return milestone;
      });
    });
  }, []);

  return (
    <div className="milestones-box">
      <h2>Milestones Completed</h2>
      <div>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`Milestones-box ${milestone.completed ? "completed" : ""}`}
          >
            {milestone.completed ? <span>&#10003;</span> : milestone.id}
          </div>
        ))}
      </div>
    </div>
  );
};






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


async function getContract() {
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  return contract;
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
  const [milesRun, setMilesRun] = useState("");
  const [timeRan, setTimeRan] = useState("");
  const [RUNBalance, setRUNBalance] = useState("");

  console.log('Dashboard...')
  
  

  // Fetches the users miles from the contract when dashboard displays
  useEffect(() => {
    (async () => {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const timeTuple = await contract.getTotalTimeSpent();
      setTimeRan(timeTuple[0] + " hrs, " + timeTuple[1] + " mins");
      setMilesRun(await contract.getMilesRun());
      const RUNBalance = await contract.getBalance();
      setRUNBalance(RUNBalance.toString());
    })();
  }, []);


  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {walletAddress}</p>
      <p>Total Time Spent Running: {timeRan}</p>
      <p>Total Miles Run: {milesRun}</p>
      <p>Total RUN Balance: {RUNBalance}</p>
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
      <h2>Record Progress</h2>
      


      
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
  const [miles, setMiles] = useState(0);

  function handleHoursChange(event) {
    setHours(event.target.value);
  }

  function handleMinutesChange(event) {
    setMinutes(event.target.value);
  }

  function handleSecondsChange(event) {
    setSeconds(event.target.value);
  }

  function handleMilesChange(event) {
    setMiles(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle submission logic here
  }

  return (
    <div className="workout-information">
      
      <h2><br></br>Enter Run Information</h2>
      <form onSubmit={handleSubmit}>
      
      <div className="miles-box">
          <label>
            Miles:
            <input type="number" value={miles} onChange={handleMilesChange} />
          </label>
        </div>

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
          <div class="container">
            <div class="dashboard-box">
              <GoalForm />
            </div>
            <div class="dashboard-box">
              <Milestones />
            </div>
          </div>

        </div>
      ) : (
        <Login onLogin={handleLogin} onConnect={handleConnect} />
      )}

      <div className="app-container"></div>
    </div>
  );
}

export default App;