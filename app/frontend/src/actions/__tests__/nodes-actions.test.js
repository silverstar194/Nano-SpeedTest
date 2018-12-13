import {
    addNodes,
    ADD_NODES
} from '../nodes';

describe('Actions - nodes', () => {
    it('should correctly setup addNodes action', () => {
        const nodesArray = [
            {
                origin: 'Singapore',
                destination: 'New York'
            }
        ];
        const action = addNodes(nodesArray);

        expect(action).toEqual({
            type: ADD_NODES,
            nodesArray
        });
    });
});
