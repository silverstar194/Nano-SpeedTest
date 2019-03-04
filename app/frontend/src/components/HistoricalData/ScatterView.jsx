import React from 'react';
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from 'recharts';
import 'styles/ScatterTooltip.css';
import {scaleLog} from 'd3-scale'

const xName = 'Date';
const yName = 'Elapsed time';

const dateFormatterWithHMS = (tick) => (new Date(tick)).toLocaleDateString({}, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
});

const timeFormatter = (value) => parseFloat(value/1000.0);
const timeFormatterWithMilli = (value) => (value/1000.0).toFixed(3);
const scale = scaleLog().base(10)
const PoWCache = (value) => (value) ? ("Yes.") : ((value == null)  ? ("Unknown.") : ( "No."))


const CustomTooltip = ({active, payload}) => {
    if (!active) return null;
    //active means someone is hovering over a transaction
    // payload[0] gives multiple fields include another payload, so payload[0].payload gives access to all information on a point
    const data = payload[0].payload;

    return (
        <div className='custom-tooltip bg-light shadow rounded'>
        <p>{`Date: ${dateFormatterWithHMS(data.date)}`}</p>
        <p>{`Seconds: ${timeFormatterWithMilli(data.y)}`}</p>
        <p>{`Origin: ${data.origin}`}</p>
        <p>{`Destination: ${data.destination}`}</p>
        <p>{`PoW Cached: ${PoWCache(data.PoWCached)}`}</p>
        </div>
    );
};

const ScatterView = ({plotData}) => {

    return (
        <ResponsiveContainer width='100%' height={500}>
            <ScatterChart>
                <XAxis
                    label={{ value: 'Ordered Chronologically By Date', position: 'insideBottom' }}
                    dataKey='x'
                    name={xName}
                    domain={['auto', 'auto']}
                    type='number'
                    tick={false}
                />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <YAxis
                    label={{ value: 'Time in Seconds', angle: -90, position: 'insideLeft' }}
                    dataKey='y'
                    domain={['auto', 'auto']}
                    name={yName}
                    tickFormatter={timeFormatter}
                    scale={scale}
                />
                <Tooltip content={<CustomTooltip/>} cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;