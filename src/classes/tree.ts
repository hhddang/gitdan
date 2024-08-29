import { DepthDict, INode, INodeDict } from "../interfaces";

export class Tree {
    public nodeDict!: INodeDict;
    public depthDict: DepthDict = {};

    constructor(nodeDict: INodeDict) {
        this.nodeDict = nodeDict;
        this.setDepthDict(this.rootId, 0);
    }

    public get rootId(): string {
        return Object.entries(this.nodeDict).filter(
            ([_, nodeInfo]) => nodeInfo.isRoot
        )[0][0];
    }

    public setDepthDict(nodeId: string, depth: number): void {
        if (depth > this.depthDict[nodeId] || this.depthDict[nodeId] === undefined) {
            this.depthDict = {
                ...this.depthDict,
                [nodeId]: depth,
            };
        }

        this.nodeDict[nodeId].childrenIds?.map((childId) =>
            this.setDepthDict(childId, depth + 1)
        );
        this.nodeDict[nodeId].mergeIds?.map((childId) => {
            this.setDepthDict(childId, depth + 1);
        }
        );
    }

    public getLeafNodes(): string[] {
        const getChildrenIds = (nodeId: string): string[] => {
            if (this.nodeDict[nodeId].childrenIds) {
                return this.nodeDict[nodeId].childrenIds.reduce<string[]>(
                    (accumulateIds, childIds) => {
                        return [...accumulateIds, ...getChildrenIds(childIds)];
                    },
                    []
                );
            } else {
                return [nodeId];
            }
        };
        return getChildrenIds(this.rootId);
    }

    public getDirectParent(nodeId: string): string | null {
        const filterParentIds = Object.keys(this.nodeDict).filter((parentId) => this.nodeDict[parentId].childrenIds?.includes(nodeId));
        if (filterParentIds.length > 0) return filterParentIds[0];
        return null;
    }
    public getMergeParent(nodeId: string): string {
        return '';
    }
}
