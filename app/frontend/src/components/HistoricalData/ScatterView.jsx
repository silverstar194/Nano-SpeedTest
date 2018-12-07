import React from 'react';
import PropTypes from 'prop-types';
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
    console.log(value, unit, plotData)
    if (unit === yName) { // dates
        return timeFormatterWithMilli(value) + ' Seconds';
    } else { // if the unit is date it is really array index so need to convert the displayed value to a date
        const point = plotData[value];
        return `${dateFormatterWithHMS(point.date)} &nbsp; Origin: ${point.origin} \nDestination: ${point.destination}`;
    }
};

class CustomTooltip extends React.Component {
    render() {
      const { active } = this.props;
      if (active) {
        // .payload[0] gives a x axis payload and .payload[0].payload gives access to all information on a point
        const data = this.props.payload[0].payload;
        debugger;

        return (
          <div className='custom-tooltip'>
            {/* <p>{`Date: ${payload[0].value}`}</p>
            <p className='label'>{`${label} : ${payload[0].value}`}</p>
            <p className='intro'>{this.getIntroOfPage(label)}</p>
            <p className='desc'>Anything you want can be displayed here.</p> */}
          </div>
        );
      }

      return null;
    }
}

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
                {/* formatter={(value, unit) => formatTooltip(value, unit, plotData)} */}
                <Tooltip content={<CustomTooltip/>} cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name='Transactions' data={plotData} fill='#8884d8' />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterView;