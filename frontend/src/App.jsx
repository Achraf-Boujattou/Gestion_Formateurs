import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8081/')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Connexion</h1>
      <p>Réponse du backend : {data ? data : "Chargement..."}</p>
    </div>
  )
}

export default App
