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

const xName = 'Date';
const yName = 'Elapsed time';

const dateFormatterWithHMS = (tick) => (new Date(tick)).toLocaleDateString({}, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
});

const timeFormatter = (value) => parseInt(value/1000);
const timeFormatterWithMilli = (value) => (value/1000).toFixed(3);

const formatTooltip = (value, unit, plotData) => {
    if (unit === yName) { // dates
        return timeFormatterWithMilli(value) + ' Seconds';
    } else { // if the unit is date it is really array index so need to convert the displayed value to a date
        return dateFormatterWithHMS(plotData[value].date);
    }
};

const ScatterView = ({plotData}) => {

    return (
        <ResponsiveContainer width='100%' height={500}>
            <ScatterChart>
                <XAxis
                    dataKey='x'
                    name={xName}
                    domain={['auto', 'auto']}
                    type='number'
                    tick={false}
                />
                <YAxis
                    label={{ value: 'Time in Seconds', angle: -90, position: 'insideLeft' }}
                    dataKey='y'
                    domain={['auto', 'auto']}
                    name={yName}
                    tickFormatter={timeFormatter}
                />
                <Tooltip formatter={(value, unit) => formatTooltip(value, unit, plotData)} cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;