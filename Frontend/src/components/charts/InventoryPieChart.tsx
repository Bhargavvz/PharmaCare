import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryOverviewDataPoint {
    name: string; // e.g., "In Stock", "Low Stock", "Out of Stock", "Expired"
    value: number; // Use number here
}

interface InventoryPieChartProps {
    data: InventoryOverviewDataPoint[];
}

// Define colors for the pie chart segments
const COLORS = {
    'In Stock': '#34d399', // emerald-400
    'Low Stock': '#facc15', // yellow-400
    'Out of Stock': '#f87171', // red-400
    'Expired': '#9ca3af',    // gray-400
};

// Type guard for color keys
function isValidColorKey(key: string): key is keyof typeof COLORS {
    return key in COLORS;
}

const InventoryPieChart: React.FC<InventoryPieChartProps> = ({ data }) => {
    const filteredData = data ? data.filter(entry => entry.value > 0) : [];

    if (!filteredData || filteredData.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No inventory data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={256}>
            <PieChart>
                <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => { ... }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {filteredData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={isValidColorKey(entry.name) ? COLORS[entry.name] : '#8884d8'} // Use defined colors or default
                        />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value} items`, name]} />
                <Legend 
                     layout="vertical" 
                     verticalAlign="middle" 
                     align="right" 
                     iconSize={10}
                     wrapperStyle={{ fontSize: '12px' }} // Style the legend text
                 />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default InventoryPieChart;
