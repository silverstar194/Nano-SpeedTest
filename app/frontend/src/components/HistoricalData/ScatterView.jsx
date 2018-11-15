import React from 'react';
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Label
} from 'recharts';

const ScatterView = ({plotData}) => {
    return (
        <ResponsiveContainer width='100%' height={500}>
            <ScatterChart>
                {/* <CartesianGrid strokeDasharray='3 3' /> */}
                <XAxis dataKey='x' name='date' label='xxxxx' />
                <YAxis dataKey='y' name='elapsed time' />>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
                </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;