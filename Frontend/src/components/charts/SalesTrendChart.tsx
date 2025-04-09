// @ts-nocheck
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesDataPoint {
    date: string; // YYYY-MM-DD
    sales: number;
}

interface SalesTrendChartProps {
    data: SalesDataPoint[];
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No sales data available for this period.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={256}> {/* Use fixed height or calculate based on container */}
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 20, // Adjusted margin for labels
                    left: 10, // Adjusted margin for labels
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    angle={-30} // Angle ticks if dates overlap
                    textAnchor="end" // Adjust anchor for angled ticks
                    height={40} // Increase height for angled ticks
                 />
                <YAxis 
                     tick={{ fontSize: 10 }} 
                     tickFormatter={(value) => `$${value.toLocaleString()}`} // Format Y-axis ticks as currency
                     width={50} // Adjust width for currency labels
                 />
                <Tooltip 
                     formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']} // Format tooltip value
                     labelFormatter={(label) => `Date: ${label}`} // Format tooltip label
                 />
                {/* <Legend /> */}
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SalesTrendChart; 