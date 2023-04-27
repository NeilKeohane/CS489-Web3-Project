import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from "ethers";

import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names';

// Logos for the header
import logo from './running-man-silhouette-19.webp';
import logo2 from './finish-line.webp';
import refresh from './refresh_icon.webp';

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
const contractAddress = "0x8937FCea2Cb46E5ab782684080Eb787DF8Edc243";

//const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");


const contractURL = new ethers.providers.JsonRpcProvider("http://localhost:8545");
//const contractURL = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/EetNVhdGjWQ5svv4-6hYSzWeXWyuAwEQ");









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

  // Update rewards checklist
  useEffect(() => {
    const loadRewards = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(contractAddress, contractABI, contractURL);
      const contractWithSigner = contract.connect(signer);
      const rewards = await contractWithSigner.getRewards();
      console.log(rewards);

      setMilestones((prevMilestones) => {
        return prevMilestones.map((milestone, index) => {
          if (rewards[index]) {
            return { ...milestone, completed: true };
          }
          return milestone;
        });
      });
    };
    loadRewards();
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
            {milestone.completed ? <span className="milestone-text">&#10003;</span> : milestone.id}
          </div>
        ))}
      </div>
    </div>
  );
};









async function getContract() {
  const contract = new ethers.Contract(contractAddress, contractABI, contractURL);
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

    // Function to reload the dashboard data when refresh button is clicked
    const handleRefresh = () => {
      (async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, contractURL);
        const contractWithSigner = contract.connect(signer);
        const timeTuple = await contractWithSigner.getTotalTimeSpent();
        setTimeRan(timeTuple[0] + " hrs, " + timeTuple[1] + " mins");
        setMilesRun(await contractWithSigner.getMilesRun());
        const RUNBalance = await contractWithSigner.getBalance();
        setRUNBalance(RUNBalance.toString());
      })();
    };
  
  

  // Fetches the users miles from the contract when dashboard displays
  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, contractURL);
      const contractWithSigner = contract.connect(signer);
      console.log(signer);
      const timeTuple = await contractWithSigner.getTotalTimeSpent();
      setTimeRan(timeTuple[0] + " hrs, " + timeTuple[1] + " mins");
      setMilesRun(await contractWithSigner.getMilesRun());
      const RUNBalance = await contractWithSigner.getBalance();
      setRUNBalance(RUNBalance.toString());
    })();
  }, []);


  return (
    
    <div className="dashboard">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-Z/gnkO7l0zmF52bW8ULvOWh9GFG+s/m2Q0heLzZVupbZNT74iG+C5j1nM+1IvF9MVDx7p/G39jKwY7YUvEK6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <h1>Dashboard</h1>
      <button className="refresh-button" onClick={handleRefresh}>
      <img src={refresh} alt="refresh" width="20" height="20"  />
        </button>
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
      console.log("Before signer in connectWallet...")
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

  async function logExercise() {
    console.log("Logging exercise...");

    const distMiles = document.getElementById('distanceMiles').value;
    const distFract = document.getElementById('distanceFract').value;
    const hours = document.getElementById('hrs').value;
    const mins = document.getElementById('mins').value;
    const secs = document.getElementById('secs').value;
    console.log(distMiles);
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, contractURL);
    const contractWithSigner = contract.connect(signer);
    console.log("Before logging...")
    await contractWithSigner.logExercise(distMiles, distFract, hours, mins, secs);
    console.log("Done logging...");
  }
  
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
    console.log("Called submit...")
    event.preventDefault();
    logExercise();
    console.log("Called log exercise")
  }

 

  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <label style={{ display: "flex", alignItems: "center" }}>
          Distance (miles):{" "}
          <input type="number" min="0" id="distanceMiles" />
          <span style={{ marginLeft: "5px" }}>.</span>
          <input type="number" min="0" id="distanceFract" />
          <span style={{ marginLeft: "5px" }}></span>
        </label>
        <br />
        <br />
        <label style={{ display: "flex", alignItems: "center" }}>
          Hours:{" "}
          <input type="number" min="0" id="hrs" />
          <span style={{ marginLeft: "5px" }}>Minutes:</span>
          <input type="number" min="0" id="mins" />
          <span style={{ marginLeft: "5px" }}>Seconds:</span>
          <input type="number" min="0" id="secs" />
          <span style={{ marginLeft: "5px" }}></span>
        </label>
        <br />
        <br />
        <input
          value="Submit Exercise"
          className="submit-button"
          type="button"
          onClick={logExercise}
   
        />
      </form>
    </div>
  );
}









  /*
  return (
    <div className="workout-information">
      
      <h2><br></br>Enter Run Information</h2>
      <form onSubmit={handleSubmit}>
      
      <div className="miles-box">
          <label>
            Miles:
            <input type="number" name="distanceMiles" value={miles} />
          </label>
        </div>

        <div className="hours-box">
          <label>
            Hours:
            <input type="number" name="hrs" value={hours}  />
          </label>
        </div>

        <div className="minutes-box">
          <label>
            Minutes:
            <input type="number" name="mins" value={minutes} />
          </label>
        </div>

        <div className="seconds-box">
          <label>
            Seconds:
            <input type="number" name="secs" value={seconds} />
          </label>
        </div>

        <div className="submit-button-container">
          <button type="submit">Submit</button>
        </div>

      </form>
    </div>
  );
}
*/
const Item = {
  name: 'Water Bottle',
  price: 10.00,
  image: 'https://www.transparentpng.com/thumb/water-bottle/8H6QEi-water-bottle-transparent-image.png', 
};
const Item2 = {
  name: 'Treadmill',
  price: 100.00,
  image: 'https://www.lifefitnessemea.com/resource/blob/952594/ca401fbe964976dcff41c140860f0e83/f1-smart-treadmill-1000x1000-transparent-data.png', 
};

const Marketplace = () => {
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState(null);
  const [balance, setBalance] = useState(500.00);
  
  const handleItemClick1 = () => {
    setSelectedItem1(selectedItem1 === Item ? null : Item);
  };
  
  const handleItemClick2 = () => {
    setSelectedItem2(selectedItem2 === Item2 ? null : Item2);
  };
  
  const handleWithdraw = () => {
    let totalWithdrawal = 0;
    if (selectedItem1) {
      totalWithdrawal += selectedItem1.price;
      setSelectedItem1(null);
    }
    if (selectedItem2) {
      totalWithdrawal += selectedItem2.price;
      setSelectedItem2(null);
    }
    setBalance(balance - totalWithdrawal);
  };
    

  return (
    <div className='marketplace_box'>
      <h1 style={{textAlign: 'center'}}>Reward Shop</h1>
      <div style={{display: 'flex'}}>

        <div className="items" style={{border: selectedItem1 === Item ? '2px solid green' : 'none', textAlign: 'center'}} onClick={handleItemClick1}>
          <img src={Item.image} alt={Item.name} width="150" height="100" />
          <h2>{Item.name}</h2>
          <p>{Item.price} RUN</p>
        </div>
        
        <div className="items2" style={{border: selectedItem2 === Item2 ? '2px solid green' : 'none', textAlign: 'center'}} onClick={handleItemClick2}>
          <img src={Item2.image} alt={Item2.name} width="150" height="100" />
          <h2>{Item2.name}</h2>
          <p>{Item2.price} RUN</p>
        </div>

      </div>

      <div className="balance" style={{textAlign: 'center'}}>
        
      </div>

      <div className="withdraw" style={{textAlign: 'center'}}>
        <button onClick={handleWithdraw} disabled={!selectedItem1 && !selectedItem2} type='submit'>Withdraw</button>
      </div>
    </div>
  );
};




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
            <div class="dashboard-box">
            <Marketplace />
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