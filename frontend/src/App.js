// reference: https://medium.com/@sindoojagajam2023/setting-up-your-first-mern-stack-project-a-step-by-step-tutorial-0a4f88fa4e98
import React, { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
   axios.get('http://localhost:5000/')
   .then(response => setMessage(response.data))
   .catch(error => console.log(error));
   }, []);
  return (
   <div className="App">
   <h1>MERN Stack App</h1>
   <p>{message}</p>
   </div>
   );
}
export default App;