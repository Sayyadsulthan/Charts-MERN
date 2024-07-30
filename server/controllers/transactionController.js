const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const { search, fromMonth, toMonth, page = 1, maxPrice, minPrice } = req.query; // Extract query parameters

        // Validate for the month
        if (
            fromMonth === undefined ||
            toMonth === undefined ||
            fromMonth < 1 ||
            fromMonth > 12 ||
            toMonth < 1 ||
            toMonth > 12
        ) {
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
                { $gte: [{ $month: '$dateOfSale' }, fromMonth] },
                { $lte: [{ $month: '$dateOfSale' }, toMonth] },
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

        console.log(soldItems);
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

module.exports = { getTransactions, getStatistics };
