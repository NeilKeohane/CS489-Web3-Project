
import React, { useState, useEffect } from 'react';
import './App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


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
      <h2>Login</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {/* display user's progress and goals here */}
    </div>
  );
}

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
    </form>
  );
}

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
      <h2>Enter workout information</h2>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}









function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <div className="logged-in-container">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <Dashboard />
          <GoalForm />
          <WorkoutInformation />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
