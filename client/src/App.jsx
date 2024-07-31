import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TransactionTable from '../components/TransactionTable';

const apiUrl = import.meta.env.VITE_API_URI;
function App() {
    const [count, setCount] = useState(0);
    console.log(apiUrl);
    return (
        <>
            <h1>App Component</h1>
            <TransactionTable />
        </>
    );
}

export default App;
