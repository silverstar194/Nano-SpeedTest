import {ADD_NODES} from 'actions/nodes';
import { convertCoordsToString } from 'util/helpers';

export const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_NODES:
            const nodes = {};
            action.nodesArray.forEach((node) => {
                node.coords = convertCoordsToString(node);
                nodes[node.id] = node;
            });
            return {...nodes};
        default:
            return state;
    }
};