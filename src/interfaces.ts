export interface INode {
  childrenIds?: string[];
  mergeIds?: string[];
  isRoot?: boolean;
}

export type INodeDict = {
  [nodeId: string]: INode;
};

export type IDepthNodeIdListDict = {
  [depth: number]: string[];
};

export type ICoordinateDict = {
  [nodeId: string]: {
    x: number;
    y: number;
  };
};

export interface ICoordinate {
  x: number;
  y: number;
}

export type DepthDict = {
  [nodeId: string]: number;
};
