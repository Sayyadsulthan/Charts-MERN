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

        res.json(transactions);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
};

module.exports = { getTransactions };
