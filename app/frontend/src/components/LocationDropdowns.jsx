import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import '../styles/LocationDropdowns.css'

// Need to make this a class component so it can have some local state
class LocationDropdowns extends Component {

    render() {
        const { nodes, settings} = this.props;
        return (
            <div>
                <form>
                    <label className='label'>Origin</label>
                    <Field name='origin' component='select'>
                        <option></option>
                        {
                            nodes && Object.keys(nodes).filter((nodeId) => {
                                if (settings && settings.advSettings && settings.advSettings.values //grab the origin nodes value and don't show it
                                    && settings.advSettings.values.destination) {
                                    return settings.advSettings.values.destination !== nodeId;
                                } else {
                                    return true;
                                }
                            }).map(nodeKey => {
                                return <option
                                    key={nodeKey}
                                    value={nodes[nodeKey].id}
                                >{nodes[nodeKey].location}</option>;
                            })
                        }
                    </Field>
                    <label className='label'>Destination</label>
                    <Field name='destination' component='select'>
                        <option></option>
                        {
                            nodes && Object.keys(nodes).filter((nodeId) => {
                                if (settings && settings.advSettings && settings.advSettings.values //grab the origin nodes value and don't show it
                                    && settings.advSettings.values.origin) {
                                    return settings.advSettings.values.origin !== nodeId;
                                } else {
                                    return true;
                                }
                            })
                                .map(nodeKey => {
                                    return <option
                                        key={nodeKey}
                                        value={nodes[nodeKey].id}
                                    >{nodes[nodeKey].location}</option>;
                                })
                        }
                    </Field>
                </form>
            </div>
        );
    }
}

// Allows form to communicate with store
LocationDropdowns = reduxForm({
    // a unique name for the form
    form: 'advSettings'
})(LocationDropdowns);

export default LocationDropdowns;