import addNodes, {INITIAL_STATE} from 'reducers/nodes';
import {ADD_NODES} from 'actions/nodes';

describe('Reducer - nodes', () => {
    it('should return the initial state', () => {
        expect(addNodes(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add nodes', () => {
        const nodesArray = [{
            origin: {
                location: 'Chicago',
                latitude: 1,
                longitude: 2
            },
            destination: {
                location: 'Chicago',
                latitude: 1,
                longitude: 2
            },
            id: 123
        }];
        const action = {
            type: ADD_NODES,
            nodesArray
        };
        const state = addNodes({}, action);
        expect(state).toEqual({123: nodesArray[0]});
    });

});