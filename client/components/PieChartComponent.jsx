import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
];
/*
[
    { _id: "women's clothing", count: 2 },
    { _id: 'electronics', count: 2 },
    { _id: "men's clothing", count: 2 },
];
*/

const months = [
    // { value: 0, month: 'All Months' },
    { value: 1, month: 'Jan' },
    { value: 2, month: 'Feb' },
    { value: 3, month: 'Mar' },
    { value: 4, month: 'Apr' },
    { value: 5, month: 'May' },
    { value: 6, month: 'Jun' },
    { value: 7, month: 'Jul' },
    { value: 8, month: 'Aug' },
    { value: 9, month: 'Sep' },
    { value: 10, month: 'Oct' },
    { value: 11, month: 'Nov' },
    { value: 12, month: 'Dec' },
];
export default function PieChartComponent() {
    const [page, setPage] = useState(1);
    const [month, setMonth] = useState(1);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const url = `http://localhost:8000/api/pie-data?page=${page}${
                month ? `&month=${month}` : ''
            }`;
            const response = await axios.get(url);
            console.log(response.data);
            setData(
                response.data.map((item, ind) => {
                    return { value: item.count, label: item._id, id: ind };
                })
            ); // Assuming data is in response.data
        };

        fetchData();
    }, [month]);

    const handleMonthFilterChange = (event) => {
        const selectedMonth = event.target.value;
        setMonth(selectedMonth);
    };
    return (
        <div className='container'>
            <Typography variant='h4' textAlign={'center'} fontWeight={'bolder'}>
                Bar Chart{' '}
            </Typography>
            <select className='select' onChange={handleMonthFilterChange}>
                <option value='' defaultValue={1}>
                    All Months
                </option>
                {months.map((data) => (
                    <option value={data.value}>{data.month}</option>
                ))}
            </select>

            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                height={200}
            />
        </div>
    );
}
