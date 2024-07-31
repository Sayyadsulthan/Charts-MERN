import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { Typography } from '@mui/material';

const columns = [
    // { field: '_id', headerName: 'ID', width: 100 },
    { field: 'id', headerName: 'Product ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'sold', headerName: 'Sold', width: 100, type: 'boolean' },
    {
        field: 'dateOfSale',
        headerName: 'Date of Sale',
        width: 200,
        type: 'date',
        valueGetter: (params) => {
            // console.log('gettervalue:', params, params.value);
            return new Date(params);
        },
    },
    // { field: 'dateOfSale', headerName: 'Date of Sale', width: 200, type: 'date' },
];

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
const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    // const [month, setmonth] = useState(1);
    // const [month, setmonth] = useState(3);
    const [month, setMonth] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${apiUrl}/transactions?page=${page}${month ? `&month=${month}` : ''}`;
            const response = await axios.get(url);

            setTransactions(response.data); // Assuming data is in response.data
        };

        fetchData();
    }, [page, month, month]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleMonthFilterChange = (event) => {
        const selectedMonth = event.target.value;
        setMonth(selectedMonth);
    };

    return (
        <div className='container'>
            <Typography variant='h4' textAlign={'center'} fontWeight={'bolder'}>
                {' '}
                Transaction Table{' '}
            </Typography>
            <select className='select' onChange={handleMonthFilterChange}>
                <option value='' defaultValue={1}>
                    All Months
                </option>
                {months.map((data) => (
                    <option value={data.value}>{data.month}</option>
                ))}
            </select>

            <DataGrid
                rows={transactions}
                columns={columns}
                pageSize={10}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 25, page: 0 },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                page={page - 1} // DataGrid expects 0-based indexing
                onPageChange={handlePageChange}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
            />
        </div>
    );
};

export default TransactionTable;
