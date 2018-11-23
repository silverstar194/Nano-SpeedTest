export const ADD_NODES = 'ADD_NODES';

export const addNodes = (nodesArray) => {
    return {
        type: ADD_NODES,
        nodesArray
    };
};