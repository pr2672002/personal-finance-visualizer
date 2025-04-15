import { connectToDatabase } from '../../lib/mongodb';
import Transaction from '../../models/Transaction';

export async function handler(req, res) {
  // const db = await connectToDatabase();

  if (req.method === 'POST') {
    // Add a new transaction
    const { amount, date, description } = req.body;
    const transaction = new Transaction({ amount, date, description });
    await transaction.save();
    return res.status(201).json(transaction);
  }

  if (req.method === 'GET') {
    // Get all transactions
    const transactions = await Transaction.find();
    return res.status(200).json(transactions);
  }

  if (req.method === 'DELETE') {
    // Delete a transaction
    const { id } = req.query;
    await Transaction.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Transaction deleted' });
  }

  if (req.method === 'PUT') {
    // Edit a transaction
    const { id, amount, date, description } = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description },
      { new: true }
    );
    return res.status(200).json(updatedTransaction);
  }
}
