import "./style/index.scss";
import { TreeDraw } from "./classes/treeDraw";
import { INodeDict } from "./interfaces";

const nodeDict: INodeDict = {
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

const board = document.querySelector(".board") as HTMLElement;
const treeDraw = new TreeDraw(nodeDict, board);






treeDraw.draw();
setTimeout(() => {
  treeDraw.createBranch('main', 'C1');
  treeDraw.createBranch('feat1', 'C1');
  treeDraw.createBranch('feat2', 'C3');
  treeDraw.createBranch('fix', 'C2');
  treeDraw.createBranch('test', 'C14');
}, 8000);