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
  C6: { childrenIds: ["C13"] },
  C7: { childrenIds: ["C8", "C16"] },
  C8: {},
  C9: { childrenIds: ["C10"] },
  C10: { mergeIds: ["C16"] },
  C11: { mergeIds: ["C6"] },
  C12: {},
  C13: {},
  C14: {},
  C15: { childrenIds: ["C17"] },
  C16: {},
  C17: {},
};

const board = document.querySelector(".board") as HTMLElement;
const treeDraw = new TreeDraw(nodeDict, board);

treeDraw.draw();
// setTimeout(() => {
//   treeDraw.createBranch("main", "C1");
//   treeDraw.createBranch("feat1", "C1");
//   treeDraw.createBranch("feat1", "C2");
//   treeDraw.createBranch("feat1", "C3");


//   treeDraw.nodes["C11"] = { ...treeDraw.nodes["C11"], childrenIds: ["C18", "C19", "C20", "C21"] };
//   treeDraw.nodes["C18"] = {};
//   treeDraw.nodes["C19"] = {};
//   treeDraw.nodes["C20"] = {};
//   treeDraw.nodes["C21"] = {};
//   console.log(treeDraw.nodes);

//   treeDraw._tree.setDepthDict("C0", 0);
//   treeDraw.getTreeDrawInfo();
//   treeDraw.draw();

// }, 30000);
