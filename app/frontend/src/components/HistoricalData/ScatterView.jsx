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
const numTicks = 7;

const dateFormatterWithHMS = (tick) => (new Date(tick)).toLocaleDateString({}, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
});

const dateFormatter = (tick) => (new Date(tick)).toLocaleDateString({}, {
    hour: 'numeric'
});

const timeFormatter = (value) => parseInt(value/1000);
const timeFormatterWithMilli = (value) => (value/1000).toFixed(3);

const formatTooltip = (value, unit) => {
    if (unit === xName) { // dates
        return dateFormatterWithHMS(value);
    } else { // elapsed time
        return timeFormatterWithMilli(value) + ' Seconds';
    }
};

const getMinX = (plotData) => {
    return plotData.reduce((min, p) => p.x < min ? p.x : min, plotData[0].x);
};
const getMaxX = (plotData) => {
    return plotData.reduce((max, p) => p.x > max ? p.x : max, plotData[0].x);
};

const ScatterView = ({plotData}) => {
    const xDomain = [getMinX(plotData), getMaxX(plotData)];

    const offset = (xDomain[1] - xDomain[0])/numTicks;
    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
        ticks.push(xDomain[0] + Math.round(i * offset));
    }

    return (
        <ResponsiveContainer width='100%' height={500}>
            <ScatterChart>
                <XAxis
                    dataKey='x'
                    name={xName}
                    domain={['auto', 'auto']}
                    scale='time'
                    type='number'
                    // tick={false}
                    ticks={ticks}
                    tickFormatter={dateFormatter}
                />
                <YAxis
                    label={{ value: 'Time in Seconds', angle: -90, position: 'insideLeft' }}
                    dataKey='y'
                    domain={['auto', 'auto']}
                    name={yName}
                    tickFormatter={timeFormatter}
                />
                <Tooltip formatter={formatTooltip} cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;