import "./style/index.scss";
import { IDepthNodeIdListDict, ITree, ICoordinateDict } from "./interfaces";

const TREE: ITree = {
  C0: { childrenIds: ["C1", "C2", "C15"], isRoot: true },
  C1: { childrenIds: ["C3", "C4", "C12"] },
  C2: { childrenIds: ["C6", "C7", "C14"] },
  C3: { childrenIds: ["C9"] },
  C4: { childrenIds: ["C5"] },
  C5: { childrenIds: ["C11"] },
  C6: { childrenIds: ["C13", "C16"] },
  C7: { childrenIds: ["C8"] },
  C8: {},
  C9: { childrenIds: ["C10"] },
  C10: {},
  C11: {},
  C12: {},
  C13: {},
  C14: {},
  C15: {},
  C16: {},
};
const SPACE_X = 110;
const SPACE_Y = 130;
const COMMIT_SIZE = 42;
const LINE_WIDTH = 3;

var coordinateDict: ICoordinateDict = {};
var tree = TREE;

const calculateCoordinateDict = () => {
  var depth = 0;
  var nodeIdList: string[] = ["C0"];
  const depthNodeIdListDict: IDepthNodeIdListDict = { 0: ["C0"] };

  coordinateDict = {};

  while (true) {
    depth++;

    nodeIdList = nodeIdList.reduce<string[]>((accumulateIds, nodeId) => {
      const ids = tree[nodeId].childrenIds ? tree[nodeId].childrenIds : [nodeId];
      return [...accumulateIds, ...ids];
    }, []);

    depthNodeIdListDict[depth] = nodeIdList;

    if (nodeIdList.every((nodeId) => !tree[nodeId].childrenIds)) {
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
          if (childrenIds) {
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
      }
    });
  }
};

const draw = (board: HTMLElement) => {
  calculateCoordinateDict();

  Object.keys(tree).forEach((nodeId, index) => {
    setTimeout(() => {
      const commit = document.querySelector(`[commit="${nodeId}"]`);
      if (commit) {

        const relatedLines = [
          ...document.querySelectorAll(`[from=${nodeId}]`),
          ...document.querySelectorAll(`[to=${nodeId}]`)
        ];

        relatedLines.forEach((line) => {
          const fromId = line.getAttribute('from')!;
          const toId = line.getAttribute('to')!;
          updateLine(fromId, toId, board);
        });

        updateCommit(nodeId);
      } else {
        createCommit(nodeId, board);

        const parentId = Object.entries(tree).filter(([_, data]) =>
          data.childrenIds?.includes(nodeId)
        )[0]?.[0] || null;

        if (parentId) {
          crateLine(parentId, nodeId, board);
        }
      }
    }, 100 * index);
  });
};

const createCommit = (nodeId: string, board: HTMLElement) => {
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

const crateLine = (fromId: string, toId: string, board: HTMLElement) => {
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

const updateCommit = (nodeId: string) => {
  const commit = document.querySelector(`[commit="${nodeId}"]`) as HTMLElement;
  const { x, y } = coordinateDict[nodeId];
  commit.style.left = x + "px";
  commit.style.top = y + "px";
};

const updateLine = (fromId: string, toId: string, board: HTMLElement) => {
  const oldLine = document.querySelector(`[from="${fromId}"][to="${toId}"]`) as HTMLElement;
  oldLine.remove();
  setTimeout(() => {
    crateLine(fromId, toId, board);
  }, 500);
};

const pushCommit = (headId: string) => {
  const newId = "C" + Object.keys(tree).length;

  if (tree[headId].childrenIds) {
    tree[headId].childrenIds.push(newId);
  } else {
    tree[headId].childrenIds = [newId];
  }
  tree[newId] = { childrenIds: [] };
};

const createBranch = (name: string, nodeId: string) => {
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



function div(content: string): HTMLElement;
function div(attributes: object): HTMLElement;
function div(content: string, attributes: object): HTMLElement;
function div(...args: any): HTMLElement {
  const div = document.createElement('div');
  var content = undefined;
  var attrs = undefined;

  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') content = arg;
    if (typeof arg === 'object') attrs = arg;
  }
  if (args.length === 2) {
    content = args[0];
    attrs = args[1];
  }

  if (content) {
    div.innerHTML = content;
  }

  if (attrs) {
    Object.entries<string>(attrs).forEach(([attr, value]) => {
      div.setAttribute(attr, value);
    });
  }

  return div;
};

// =============================================

const board = document.querySelector(".board") as HTMLElement;
calculateCoordinateDict();
draw(board);

setTimeout(() => {

  createBranch('main', 'C1');
  createBranch('feat1', 'C1');
  createBranch('feat2', 'C3');
  createBranch('fix', 'C2');
  createBranch('test', 'C14');
}, 2000);

