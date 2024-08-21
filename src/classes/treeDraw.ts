import { ITree } from "../interfaces";

export class TreeDraw {
    private _tree!: ITree;
    private _board!: HTMLElement;
    private _config = {
        minDistanceBetweenNodes: {
            x: 110,
            y: 130
        },
        nodeSize: 42,
        lineSize: 3
    };

    constructor(tree: ITree, board: HTMLElement) {
        this._tree = tree;
        this._board = board;
    }


}