import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

// Need to make this a class component so it can have some local state
class LocationDropdowns extends Component {

    render() {
        const { handleHomeLocationsChange, nodes, homeDropdownsForm } = this.props;
        return (
            <div>
                <form>
                    <label>Origin</label>
                    <Field name='origin' component='select'>
                        <option></option>
                        {
                            nodes && Object.keys(nodes).map(nodeKey => {
                                return <option
                                    key={nodeKey}
                                    value={nodes[nodeKey].id}
                                >{nodes[nodeKey].location}</option>;
                            })
                        }
                    </Field>
                    <label>Destination</label>
                    <Field name='destination' component='select'>
                        <option></option>
                        {
                            nodes && Object.keys(nodes).filter((nodeId) => {
                                if (homeDropdownsForm) {
                                    return homeDropdownsForm !== nodeId;
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