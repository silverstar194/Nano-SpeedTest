import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import '../styles/LocationDropdowns.css'

// Need to make this a class component so it can have some local state
class LocationDropdowns extends Component {

    render() {
        const { nodes, homeDropdownsForm, modalSettings} = this.props;
        let hasBothValuesInModal = modalSettings && modalSettings.values && modalSettings.values.origin && modalSettings.values.destination;
        let modalSettingsForHome = hasBothValuesInModal ? modalSettings.values : false;
        console.log(modalSettingsForHome);
        return (
            <div>
                <form>
                    <label className='label'>Origin</label>
                    <Field name='origin' component='select'>
                        <option></option>
                        {
                            nodes && Object.keys(nodes).filter((nodeId) => {
                                if (homeDropdownsForm && homeDropdownsForm.values && homeDropdownsForm.values.destination) {
                                    return homeDropdownsForm.values.destination !== nodeId;
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
                                if (homeDropdownsForm &&homeDropdownsForm.values && homeDropdownsForm.values.origin) {
                                    return homeDropdownsForm.values.origin !== nodeId;
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
    form: 'homepageLocations'
})(LocationDropdowns);

export default LocationDropdowns;