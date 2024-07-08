import React, { useState, useEffect } from 'react';
import '../css/main.css'
const MainComponent = () => {
  // Countdown Timer States
  const [time, setTime] = useState(3600); // default to 1 hour
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // User Info States
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  // Fetch users data from API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err=> console.log(err))
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Countdown Timer Handlers
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalId);
    }
  };

  const resetTimer = () => {
    setTime(3600);
    setIsRunning(false);
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      const id = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (time === 0) {
      clearInterval(intervalId);
    }
  }, [isRunning, time]);

  // User Info Handlers
  const handleSearch = () => {
    setSearchTerm(currentSearchTerm);
    if (!searchHistory.includes(currentSearchTerm)) {
      setSearchHistory([...searchHistory, currentSearchTerm]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Filter and Sort Users
  const getFilteredAndSortedUsers = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredUsers.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Countdown Timer Section */}
      <h1 class="font-monospace count_h1">Countdown Timer</h1>
      <input
        type="number"
        class="form-control count_input"
        style={{width:'10%'}}
        placeholder='In Hours'
        // display time in hours
        onChange={e => setTime(Number(e.target.value) * 3600)} // convert hours to seconds
        disabled={isRunning}
      />
      <div class='count_btn'>
        <button class="btn btn-success mx-2" onClick={startTimer}>Start</button>
        <button class="btn btn-danger mx-2" onClick={stopTimer}>Stop</button>
        <button class="btn btn-warning mx-2" onClick={resetTimer}>Reset</button>
      </div>
      <h2 class="font-monospace count_h2">{formatTime(time)}</h2>

      {/* User Info Section */}
      <h1 class='user_h1'>User Info</h1>
      <input
        type="text"
        value={currentSearchTerm}
        onChange={e => setCurrentSearchTerm(e.target.value)}
        placeholder="Search by name"
        class="form-control user_input"
      />
      <div class='user_btn'>
      <button onClick={handleSearch} class="btn btn-warning mx-2">Search</button>
      <button onClick={toggleSortOrder}  class="btn btn-danger" >Sort by Name ({sortOrder})</button>
      </div>
      
      <ul class='count_ul'>
        {getFilteredAndSortedUsers().map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <h1 class='user_search'>Search History</h1>
      <ul class='user_ul2'>
        {searchHistory.map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ul>
    </div>
  );
};

export default MainComponent;
