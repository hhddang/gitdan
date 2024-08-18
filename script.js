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

const SPACE_X = 100;
const SPACE_Y = 120;

var coordinateDict = {};

const calculateCoordinateDict = (tree) => {
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

const draw = () => {
  const board = document.querySelector(".board");
  Object.keys(tree).forEach((nodeId, index) => {
    setTimeout(() => {
      const { x, y } = coordinateDict[nodeId];
      const commit = document.getElementById(nodeId);
      if (commit) {
        commit.style.left = x + "px";
        commit.style.top = y + "px";

        const fromLines = document.querySelectorAll(`[from=${nodeId}]`);
        const toLines = document.querySelectorAll(`[to=${nodeId}]`);

        fromLines.forEach((line) => {
          const from = line.getAttribute("from");
          const to = line.getAttribute("to");
          line.remove();
          const newLine = crateLine(
            coordinateDict[from],
            coordinateDict[to],
            from,
            to
          );

          board.append(newLine);
        });

        toLines.forEach((line) => {
          const from = line.getAttribute("from");
          const to = line.getAttribute("to");
          line.remove();
          const newLine = crateLine(
            coordinateDict[from],
            coordinateDict[to],
            from,
            to
          );

          board.append(newLine);
        });
      } else {
        const newCommit = createCommit(nodeId, y, x);

        const parentId =
          Object.entries(tree).filter(([parentId, data]) =>
            data.childrenIds.includes(nodeId)
          )[0]?.[0] || null;

        board.append(newCommit);
        if (parentId) {
          const line = crateLine(
            coordinateDict[parentId],
            { x, y },
            parentId,
            nodeId
          );
          board.append(line);
        }
      }
    }, 100 * index);
  });
};

const createCommit = (id, top, left) => {
  const commit = document.createElement("div");
  commit.className = "commit";
  commit.innerHTML = id;
  commit.id = id;
  commit.style.top = top + "px";
  commit.style.left = left + "px";
  return commit;
};

const crateLine = (start, end, from, to) => {
  const line = document.createElement("div");

  const length =
    Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) - 60;

  line.style.height = length + "px";
  line.style.width = "1px";
  line.style.borderLeft = "1px solid red";
  line.style.position = "absolute";
  line.style.top = start.y + (end.y - start.y) / 2 + 30 + "px";
  line.style.left = start.x + (end.x - start.x) / 2 + 30 + "px";
  line.setAttribute("from", from);
  line.setAttribute("to", to);
  var deg =
    (Math.atan((end.x - start.x) / 2 / ((end.y - start.y) / 2)) * 180) /
    Math.PI;

  line.style.transform = `translateY(-50%) rotate(${-deg}deg)`;
  return line;
};

var tree = TREE;
calculateCoordinateDict(tree);
draw();
const board = document.querySelector(".board");

const input = document.querySelector("input");
const button = document.querySelector("button");

if (input && button) {
  button.addEventListener("click", () => {
    const head = input.value;
    const newId = "C" + Object.keys(tree).length;
    tree[head].childrenIds.push(newId);
    tree[newId] = { childrenIds: [] };

    calculateCoordinateDict(tree);
    draw();
  });
}
