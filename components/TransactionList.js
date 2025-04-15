import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
      generateChartData(res.data);
    };
    fetchTransactions();
  }, []);

  const generateChartData = (data) => {
    const groupedByMonth = data.reduce((acc, { amount, date }) => {
      const month = new Date(date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += amount;
      return acc;
    }, {});
    setChartData(Object.entries(groupedByMonth).map(([month, amount]) => ({ month, amount })));
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/transactions?id=${id}`);
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.description} - ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDelete(transaction._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionList;
