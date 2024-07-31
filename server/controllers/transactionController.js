const env = require('../config/environment');
const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const { search, month, page = 1, maxPrice, minPrice } = req.query; // Extract query parameters

        // Validate for the month
        if (month === undefined || month < 1 || month > 12) {
            return res.status(400).json({ success: false, message: 'Invalid month range (1-12)' });
        }

        const filter = {};
        // filter for the search
        if (search) {
            filter.$or = [
                { title: { $regex: `.*${search.split(' ').join('.*')}`, $options: 'i' } },
                { description: { $regex: `.*${search.split(' ').join('.*')}`, $options: 'i' } },
            ];
        }

        // filter for the price
        if (maxPrice && minPrice) {
            filter.price = {
                $gte: minPrice,
                $lte: maxPrice,
            };
        }

        // filter for the month range
        filter.$expr = {
            $and: [
                { $gte: [{ $month: '$dateOfSale' }, month] },
                { $lte: [{ $month: '$dateOfSale' }, month] },
            ],
        };

        // finding the transactions from the filter
        const transactions = await Transaction.find(filter)
            .sort('dateOfSale')
            .skip((page - 1) * 10)
            .limit(10);

        res.status(200).json(transactions);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        // check the valid month
        if (month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid month' });
        }

        // USING THE FILTER  TO GET THE STASTICS

        // find the soldItems for the current month not validate year
        const soldItems = await Transaction.find({
            sold: true,
            $expr: {
                $and: [
                    { $gte: [{ $month: '$dateOfSale' }, month] },
                    { $lte: [{ $month: '$dateOfSale' }, month] },
                ],
            },
        });

        // find the unSoldItems for the current month not validate year
        const notSoldItems = await Transaction.find({
            sold: false,
            $expr: {
                $and: [
                    { $gte: [{ $month: '$dateOfSale' }, month] },
                    { $lte: [{ $month: '$dateOfSale' }, month] },
                ],
            },
        });

        // taking the sum of current month
        const totalSaleAmount = soldItems.reduce((total, item) => total + item.price, 0);
        // sold and unsold items
        const totalSoldItems = soldItems.length;
        const totalNotSoldItems = notSoldItems.length;

        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;

        if (month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid month' });
        }

        // find the transactions for specific month
        const transactions = await Transaction.find({
            $expr: {
                $and: [
                    { $gte: [{ $month: '$dateOfSale' }, month] },
                    { $lte: [{ $month: '$dateOfSale' }, month] },
                ],
            },
        });

        // creating price range
        const priceRange = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };
        /* 
        //this also works
        for (let key in transactions) {
            let price = transactions[key].price;
            if (price >= 0 && price <= 100) priceRange['0-100']++;
            if (price <= 200) priceRange['101-200']++;
            if (price <= 300) priceRange['201-300']++;
            if (price <= 400) priceRange['301-400']++;
            if (price <= 500) priceRange['401-500']++;
            if (price <= 600) priceRange['501-600']++;
            if (price <= 700) priceRange['601-700']++;
            if (price <= 800) priceRange['701-800']++;
            if (price <= 900) priceRange['801-900']++;
            if (price >= 901) priceRange['901-above']++;
        }
        */

        // iterate over transactions and mapping and increasing val
        transactions.forEach((transac) => {
            let price = transac.price;
            if (price >= 0 && price <= 100) priceRange['0-100']++;
            if (price <= 200) priceRange['101-200']++;
            if (price <= 300) priceRange['201-300']++;
            if (price <= 400) priceRange['301-400']++;
            if (price <= 500) priceRange['401-500']++;
            if (price <= 600) priceRange['501-600']++;
            if (price <= 700) priceRange['601-700']++;
            if (price <= 800) priceRange['701-800']++;
            if (price <= 900) priceRange['801-900']++;
            if (price >= 901) priceRange['901-above']++;
        });

        const result = [];
        for (let range in priceRange) {
            // creating the range obj
            let data = {
                _id: range,
                count: priceRange[range],
            };
            // adding the range and count object to result array
            result.push(data);
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

const getPieData = async (req, res) => {
    const { month } = req.query;
    if (month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid month' });
    }
    try {
        // using the aghrigate to match the date month and group by the category ans count the category by sum of gategories particular
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, Number(month)],
                    },
                },
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(transactions);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

const getChartData = async (req, res) => {
    const { month } = req.query;
    try {
        const data1 = await fetch(`http://localhost:${env.PORT}/api/stastics?month=${month}`, {
            headers: { 'Content-Type': 'Application/json' },
        });
        const data2 = await fetch(`http://localhost:${env.PORT}/api/bar-data?month=${month}`, {
            headers: { 'Content-Type': 'Application/json' },
        });
        const data3 = await fetch(`http://localhost:${env.PORT}/api/pie-data?month=${month}`, {
            headers: { 'Content-Type': 'Application/json' },
        });

        const stasticsData = await data1.json();
        const barData = await data2.json();
        const pieData = await data3.json();

        return res.status(200).json({
            statistics: stasticsData,
            barChart: barData,
            pieChart: pieData,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

module.exports = { getTransactions, getStatistics, getBarChartData, getPieData, getChartData };
