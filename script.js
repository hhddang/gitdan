const TREE = {
  C0: { childrenIds: ["C1", "C2", "C15"], isRoot: true },
  C1: { childrenIds: ["C3", "C4", "C12"] },
  C2: { childrenIds: ["C6", "C7", "C14"] },
  C3: { childrenIds: ["C9"] },
  C4: { childrenIds: ["C5"] },
  C5: { childrenIds: ["C11"] },
  C6: { childrenIds: ["C13", "C16"] },
  C7: { childrenIds: ["C8"] },
  C8: { childrenIds: [] },
  C9: { childrenIds: ["C10"] },
  C10: { childrenIds: [] },
  C11: { childrenIds: [] },
  C12: { childrenIds: [] },
  C13: { childrenIds: [] },
  C14: { childrenIds: [] },
  C15: { childrenIds: [] },
  C16: { childrenIds: [] },
};
const SPACE_X = 80;
const SPACE_Y = 100;
const COMMIT_SIZE = 42;
const LINE_WIDTH = 3;

var coordinateDict = {};
var tree = TREE;


const calculateCoordinateDict = () => {
  var depth = 0;
  var nodeIdList = ["C0"];
  const depthNodeIdListDict = { 0: ["C0"] };

  coordinateDict = {};

  while (true) {
    depth++;

    nodeIdList = nodeIdList.reduce((accumulateIds, nodeId) => {
      const ids =
        tree[nodeId].childrenIds.length >= 1
          ? tree[nodeId].childrenIds
          : [nodeId];
      return [...accumulateIds, ...ids];
    }, []);

    depthNodeIdListDict[depth] = nodeIdList;

    if (nodeIdList.every((nodeId) => tree[nodeId].childrenIds.length === 0)) {
      break;
    }
  }

  for (let y = depth; y >= 0; y--) {
    const nodeIdList = depthNodeIdListDict[y];
    nodeIdList.forEach((nodeId, index) => {
      if (y === depth) {
        coordinateDict[nodeId] = { x: index * SPACE_X, y: y * SPACE_Y };
      } else {
        if (coordinateDict[nodeId]) {
          coordinateDict[nodeId] = {
            ...coordinateDict[nodeId],
            y: y * SPACE_Y,
          };
        } else {
          const childrenIds = tree[nodeId].childrenIds;
          const avgX =
            childrenIds.reduce(
              (accumulate, id) => accumulate + coordinateDict[id].x,
              0
            ) / childrenIds.length;

          coordinateDict[nodeId] = {
            x: avgX,
            y: y * SPACE_Y,
          };
        }
      }
    });
  }
};

const draw = (board) => {
  calculateCoordinateDict(tree);

  Object.keys(tree).forEach((nodeId, index) => {
    setTimeout(() => {
      const commit = document.querySelector(`[commit="${nodeId}"]`);
      if (commit) {

        const relatedLines = [
          ...document.querySelectorAll(`[from=${nodeId}]`),
          ...document.querySelectorAll(`[to=${nodeId}]`)
        ];

        relatedLines.forEach((line) => {
          const fromId = line.getAttribute('from');
          const toId = line.getAttribute('to');
          updateLine(fromId, toId, board);
        });

        updateCommit(nodeId);

        // relatedLines.forEach((line) => {
        //   const fromId = line.getAttribute('from');
        //   const toId = line.getAttribute('to');
        //   updateLine(fromId, toId, board);
        // });

      } else {
        createCommit(nodeId, board);

        const parentId = Object.entries(tree).filter(([parentId, data]) =>
          data.childrenIds.includes(nodeId)
        )[0]?.[0] || null;

        if (parentId) {
          crateLine(parentId, nodeId, board);
        }
      }
    }, 100 * index);
  });
};

const createCommit = (nodeId, board) => {
  const commit = div(nodeId, {
    class: 'commit',
    commit: nodeId,
    style: `
      --size: ${COMMIT_SIZE}px;
      top: ${coordinateDict[nodeId].y}px;
      left: ${coordinateDict[nodeId].x}px
      `
  });

  commit.onclick = () => {
    pushCommit(nodeId);
    draw(board);
  };

  board.append(commit);
};

const crateLine = (fromId, toId, board) => {
  const startCoor = coordinateDict[fromId];
  const endCoor = coordinateDict[toId];

  const xBar = endCoor.x - startCoor.x;
  const yBar = endCoor.y - startCoor.y;
  const long = Math.sqrt(xBar ** 2 + yBar ** 2) - COMMIT_SIZE;
  const degree = -1 * (Math.atan((xBar / 2) / (yBar / 2)) * 180) / Math.PI;

  const line = div({
    from: fromId,
    to: toId,
    class: 'line',
    style: `
      top: ${startCoor.y + yBar / 2 + COMMIT_SIZE / 2}px;
      left: ${startCoor.x + xBar / 2 + COMMIT_SIZE / 2}px;
      --long: ${long}px;
      --width: ${LINE_WIDTH}px;
      --color: #777777;
      transform: translate(-50%, -50%) rotate(${degree}deg)
  `
  });

  board.append(line);
};

const updateCommit = (nodeId) => {
  const commit = document.querySelector(`[commit="${nodeId}"]`);
  const { x, y } = coordinateDict[nodeId];
  commit.style.left = x + "px";
  commit.style.top = y + "px";
};

const updateLine = (fromId, toId, board) => {
  const oldLine = document.querySelector(`[from="${fromId}"][to="${toId}"]`);
  oldLine.remove();
  setTimeout(() => {
    crateLine(fromId, toId, board);
  }, 500);
};

const pushCommit = (headId) => {
  const newId = "C" + Object.keys(tree).length;

  tree[headId].childrenIds.push(newId);
  tree[newId] = { childrenIds: [] };
};

const createBranch = (name, nodeId) => {
  const commit = document.querySelector(`[commit=${nodeId}]`);
  if (commit) {
    const branch = div(name, { class: 'branch' });

    const branchWrapper = commit.querySelector('.branch-wrapper');
    if (branchWrapper) {
      branchWrapper.append(branch);
    } else {
      const newBranchWapper = div({ class: 'branch-wrapper' });
      commit.append(newBranchWapper);

      newBranchWapper.append(branch);
    }

  }

};

function div(params) {
  if (arguments.length > 2) {
    return error;
  }

  const div = document.createElement('div');
  var content = undefined;
  var attrs = undefined;

  if (arguments.length === 1) {
    const arg = arguments[0];
    if (typeof arg === 'string') content = arg;
    if (typeof arg === 'object') attrs = arg;
  }
  if (arguments.length === 2) {
    content = arguments[0];
    attrs = arguments[1];
  }

  if (content) {
    div.innerHTML = content;
  }

  if (attrs) {
    Object.entries(attrs).forEach(([attr, value]) => {
      div.setAttribute(attr, value);
    });
  }

  return div;
};

// =============================================

const board = document.querySelector(".board");
calculateCoordinateDict(tree);
draw(board);

setTimeout(() => {

  createBranch('main', 'C1');
  createBranch('main222dsdfsdfsdfds', 'C1');
  createBranch('main222dsdfsdfsdfds', 'C1');
  createBranch('main222dsdfsdfsdfds', 'C1');
  createBranch('main222dsdfsdfsdfds', 'C1');
}, 2000);
