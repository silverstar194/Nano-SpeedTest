import React from 'react';
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';

const ScatterView = ({plotData}) => {
    return (
        <ResponsiveContainer width='100%' height={500}>
            <ScatterChart>
                <XAxis dataKey='x' name='date' label='' />
                <YAxis dataKey='y' name='elapsed time' />>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;