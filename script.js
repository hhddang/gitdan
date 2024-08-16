

var TREE = [
    { id: 'C0', childrenIds: ['C1', 'C2'], isRoot: true },
    { id: 'C1', childrenIds: ['C3', 'C4'] },
    { id: 'C2', childrenIds: ['C6', 'C7'] },
    { id: 'C3', childrenIds: ['C9'] },
    { id: 'C4', childrenIds: ['C5'] },
    { id: 'C6', childrenIds: [] },
    { id: 'C7', childrenIds: ['C8'] },
    { id: 'C9', childrenIds: ['C10'] },
    { id: 'C5', childrenIds: ['C11'] },
    { id: 'C8', childrenIds: [] },
    { id: 'C10', childrenIds: [] },
    { id: 'C11', childrenIds: [] },
];

const board = document.querySelector('.board');


const createMethods = (tree) => {
    const methodTree = [...tree];
    // methodTree
    var depthNodeIdsDict = { 0: [methodTree.filter(node => node.isRoot)[0].id] };


    // Calculate depth-nodes dictionary: { <depth>: [<nodeIds>] }
    var depth = 0;
    while (true) {
        const nodeIds = depthNodeIdsDict[depth].reduce((accumChildrenIds, nodeId) => {
            const node = methodTree.filter(node => node.id === nodeId)[0];

            if (node && node.childrenIds.length > 0) {
                return [...accumChildrenIds, ...node.childrenIds];
            } else {
                // log;
                console.log([...methodTree.filter(node => node.id === nodeId)[0].childrenIds]);
                console.log(123321, TREE);

                methodTree.filter(node => node.id === nodeId)[0].childrenIds.push('XX' + nodeId);
                console.log([...methodTree.filter(node => node.id === nodeId)[0].childrenIds]);

                methodTree.push({ id: 'X' + nodeId, childrenIds: [] });
                return [...accumChildrenIds, 'X' + nodeId];
            }
        }, []);


        if (nodeIds.every(nodeId => nodeId.includes('X'))) {
            break;
        } else {
            depthNodeIdsDict[depth + 1] = nodeIds;
            depth++;
        }
    }
    return { methodTree, depthNodeIdsDict, depth };

};


const calculateCoordinates = (methodTree, depthNodeIdsDict, depth) => {
    const nodeIdCoordinateDict = {};
    for (let i = depth; i >= 0; i--) {
        depthNodeIdsDict[i].forEach((nodeId, index) => {
            var x = 0;
            if (i === depth) {
                x = 100 * index;
            } else {
                const childrenIds = methodTree.filter(node => node.id === nodeId)[0].childrenIds;
                // console.log('aha: ', nodeId, childrenIds);

                childrenIds.forEach(childrenId => {
                    // console.log('aha222: ', childrenId, snodeIdCoordinateDict[childrenId]);
                    x += nodeIdCoordinateDict[childrenId].x;
                });
                x /= childrenIds.length;
            }


            nodeIdCoordinateDict[nodeId] = {
                x,
                y: 120 * i,
            };
        });
    }

    // console.log(nodeIdCoordinateDict);
    return nodeIdCoordinateDict;
};

const draw = (nodeIdCoordinateDict) => {
    Object.keys(nodeIdCoordinateDict).forEach(nodeId => {


        if (nodeId.includes('X')) return;

        const { x, y } = nodeIdCoordinateDict[nodeId];
        // console.log(123321, nodeId, left, top);

        const commit = document.getElementById(nodeId);


        if (commit) {
            commit.style.left = x + 'px';
            commit.style.top = y + 'px';
        } else {
            const newCommit = createCommit(nodeId, y, x);
            board.append(newCommit);
        }
    });
};


const createCommit = (id, top, left) => {
    const commit = document.createElement('div');
    commit.className = 'commit';
    commit.innerHTML = id;
    commit.id = id;
    commit.style.top = top + 'px';
    commit.style.left = left + 'px';
    return commit;


};


const run = (tree) => {
    const { methodTree, depthNodeIdsDict, depth } = createMethods(tree);
    const nodeIdCoordinateDict = calculateCoordinates(methodTree, depthNodeIdsDict, depth);
    draw(nodeIdCoordinateDict);
};

run([...TREE]);
console.log(TREE);


const input = document.querySelector('input');
const button = document.querySelector('button');

if (input && button) {
    button.addEventListener('click', () => {
        const head = input.value;
        const newTree = [...TREE];
        newTree.filter(node => node.id === head)[0].childrenIds.push('C' + newTree.length);
        newTree.push({ id: 'C' + newTree.length, childrenIds: [] });
        run(newTree);
    });
}




