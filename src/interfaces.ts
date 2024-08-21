export interface INode {
    childrenIds?: string[],
    isRoot?: boolean;
}

export type ITree = {
    [nodeId: string]: INode;
};

export type IDepthNodeIdListDict = {
    [depth: number]: string[];
};


export type ICoordinateDict = {
    [nodeId: string]: {
        x: number,
        y: number;
    };
};


