import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
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

const apiUrl = import.meta.env.VITE_API_URI;
export default function BarChartComponent() {
    const [month, setMonth] = useState(1);
    const [data, setData] = useState({ countData: [], xAxis: [] });
    const [page, setPage] = useState(1);
    React.useEffect(() => {
        const fetchData = async () => {
            const url = `${apiUrl}/bar-data?page=${page}${month ? `&month=${month}` : ''}`;
            const response = await axios.get(url);
            let countData = [];
            let xAxis = [];
            response.data.forEach((element) => {
                countData.push(element.count);
                xAxis.push(element._id);
            });

            setData({ countData, xAxis }); // Assuming data is in response.data
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

            <BarChart
                width={800}
                height={350}
                series={[
                    // { data: pData, label: 'pv', id: 'pvId' },
                    {
                        data: data['countData'],
                        label: months[month - 1].month,
                        id: 'uvId',
                    },
                ]}
                xAxis={[{ data: data['xAxis'], scaleType: 'band', tickPlacement: 'middle' }]}
            />
        </div>
    );
}
