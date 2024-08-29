import { ICoordinate, ICoordinateDict, INodeDict } from "../interfaces";
import { div } from "../utils";
import { Tree } from "./tree";

export class TreeDraw {
  public _tree!: Tree;
  private _board!: HTMLElement;
  private _coordinateDict: ICoordinateDict = {};
  private _config = {
    nodeSize: 42,
    lineSize: 3,
    distance: {
      x: 110,
      y: 130,
    },
    animateDuration: {
      node: 100,
      line: 400,
    },
  };

  constructor(nodeDict: INodeDict, board: HTMLElement) {
    this._tree = new Tree(nodeDict);
    this._board = board;
    this.getTreeDrawInfo();
  }

  get distanceX(): number {
    return this._config.distance.x;
  }

  get nodeSize(): number {
    return this._config.nodeSize;
  }

  get lineSize(): number {
    return this._config.lineSize;
  }

  get distanceY(): number {
    return this._config.distance.y;
  }

  get nodeAnimateDuration(): number {
    return this._config.animateDuration.node;
  }

  get lineAnimateDuration(): number {
    return this._config.animateDuration.line;
  }

  get rootId(): string {
    return Object.keys(this.nodes)[0];
  }

  get nodes(): INodeDict {
    return this._tree.nodeDict;
  }

  getEffectedNodes(nodeId: string): string[] {
    const getEffect = (nodeId: string, causeId: string, affectedIdList: string[]) => {

      const parentId = this._tree.getDirectParent(nodeId);

      if (parentId) {
        const siblings = this.nodes[parentId].childrenIds;
      }

    };

    return [];
  }

  getTreeDrawInfo() {
    const leafNodes = this._tree.getLeafNodes();
    const getNodeCoordinate = (nodeId: string): ICoordinate => {
      if (leafNodes.includes(nodeId)) {
        this._coordinateDict[nodeId] = {
          x: leafNodes.indexOf(nodeId) * this.distanceX,
          y: this._tree.depthDict[nodeId] * this.distanceY,
        };
      } else {
        const coordinateList = this.nodes[nodeId].childrenIds?.map((childId) =>
          getNodeCoordinate(childId)
        );

        if (coordinateList) {
          this._coordinateDict[nodeId] = {
            x:
              coordinateList.reduce(
                (accumulate, coordinate) => accumulate + coordinate.x,
                0
              ) / coordinateList.length,
            y: this._tree.depthDict[nodeId] * this.distanceY,
          };
        }
      }
      return this._coordinateDict[nodeId];
    };
    getNodeCoordinate(this._tree.rootId);
  }

  createCommit(nodeId: string): Promise<void> {
    const commit = div(nodeId, {
      class: "commit",
      commit: nodeId,
      style: `
            --size: ${this.nodeSize}px;
            --animate-duration: ${this.nodeAnimateDuration}ms;
            top: ${this._coordinateDict[nodeId].y}px;
            left: ${this._coordinateDict[nodeId].x}px;
            `,
    });

    commit.onclick = () => {
      this.pushCommit(nodeId);
      this.draw();
    };

    this._board.append(commit);

    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, this.nodeAnimateDuration);
    });
  }

  crateLine(fromId: string, toId: string) {
    const startCoor = this._coordinateDict[fromId];
    const endCoor = this._coordinateDict[toId];

    const xBar = endCoor.x - startCoor.x;
    const yBar = endCoor.y - startCoor.y;
    const long = Math.sqrt(xBar ** 2 + yBar ** 2) - this.nodeSize;
    const degree = (-1 * (Math.atan(xBar / 2 / (yBar / 2)) * 180)) / Math.PI;

    const line = div({
      from: fromId,
      to: toId,
      class: "line",
      style: `
                top: ${startCoor.y + yBar / 2 + this.nodeSize / 2}px;
                left: ${startCoor.x + xBar / 2 + this.nodeSize / 2}px;
                --long: ${long}px;
                --width: ${this.lineSize}px;
                --color: #777777;
                transform: translate(-50%, -50%) rotate(${degree}deg)
            `,
    });

    this._board.append(line);
  }

  updateCommit(nodeId: string) {
    const commit = document.querySelector(
      `[commit="${nodeId}"]`
    ) as HTMLElement;
    const { x, y } = this._coordinateDict[nodeId];
    commit.style.left = x + "px";
    commit.style.top = y + "px";
  }

  updateLine(fromId: string, toId: string) {
    const oldLine = document.querySelector(
      `[from="${fromId}"][to="${toId}"]`
    ) as HTMLElement;
    oldLine.remove();
    this.crateLine(fromId, toId);
  }

  pushCommit(headId: string) {
    const newId = "C" + Object.keys(this.nodes).length;

    if (this.nodes[headId].childrenIds) {
      this.nodes[headId].childrenIds.push(newId);
    } else {
      this.nodes[headId].childrenIds = [newId];
    }
    this.nodes[newId] = { childrenIds: [] };
  }

  draw() {
    const nodeIds = Object.keys(this.nodes);
    var i = 0;

    const createNextCommit = (nodeId: string) => {
      this.createCommit(nodeId).then(() => {
        console.log("create ", nodeId);
        const parentId = this._tree.getDirectParent(nodeId);
        if (parentId) {
          this.crateLine(parentId, nodeId);
        }

        if (++i < nodeIds.length) {
          createNextCommit(nodeIds[i]);
        }
      });
    };

    createNextCommit(nodeIds[i]);
  }

  createBranch(name: string, nodeId: string) {
    const commit = document.querySelector(`[commit=${nodeId}]`);
    if (commit) {
      const branch = div(name, { class: "branch" });

      const branchWrapper = commit.querySelector(".branch-wrapper");
      if (branchWrapper) {
        branchWrapper.append(branch);
      } else {
        const newBranchWapper = div({ class: "branch-wrapper" });
        commit.append(newBranchWapper);
        newBranchWapper.append(branch);
      }
    }
  }
}
