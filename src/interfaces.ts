export interface INode {
    childrenIds?: string[],
    isRoot?: boolean;
    drawInfo?: {
        depth: number;
        coordinate: ICoordinate;
    };
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

interface ICoordinate { x: number, y: number; }


