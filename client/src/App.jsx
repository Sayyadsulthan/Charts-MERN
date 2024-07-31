import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TransactionTable from '../components/TransactionTable';
import axios from 'axios';
import BarChartComponent from '../components/BarChartComponent';
import PieChartComponent from '../components/PieChartComponent';

const apiUrl = import.meta.env.VITE_API_URI;
function App() {
    const [count, setCount] = useState(0);
    const [month, setMonth] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            const url = `http://localhost:8000/api/chart-data?page=${1}${
                month ? `&month=${month}` : ''
            }`;
            const response = await axios.get(url);
            console.log(response.data);
            // setTransactions(response.data); // Assuming data is in response.data
        };

        fetchData();
    }, [month]);
    console.log(apiUrl);
    return (
        <>
            <TransactionTable />
            <BarChartComponent />
            <PieChartComponent />
        </>
    );
}

export default App;
