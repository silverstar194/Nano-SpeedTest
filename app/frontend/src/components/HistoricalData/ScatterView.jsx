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
    // function getMinX() {
    //     return plotData.reduce((min, p) => p.x < min ? p.x : min, plotData[0].x);
    //   }
    //   function getMaxX() {
    //     return plotData.reduce((max, p) => p.x > max ? p.x : max, plotData[0].x);
    //   }
    // const domainToday = [getMinX(), getMaxX()];
    const timeFormatter = (tick) => (new Date(tick)).toLocaleDateString({}, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    // const offset = (domainToday[1] - domainToday[0])/5;
    // const ticks = [];
    // for (let i = 0; i < 5; i++) {
    //     ticks.push(domainToday[0] + Math.round(i * offset));
    // }

    const xName = 'Date';
    const yName = 'Elapsed time';

    const formatTooltip = (value, unit) => {
        if (unit === xName) { // dates
            return timeFormatter(value);
        } else { // elasped time
            return (value/1000).toFixed(3) + ' Seconds';
        }
    };

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
                    // ticks={ticks}
                    tickFormatter={timeFormatter}
                />
                <YAxis
                    label={{ value: 'Time', angle: -90, position: 'insideLeft' }}
                    dataKey='y'
                    name={yName}
                />
                <Tooltip formatter={formatTooltip} cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;