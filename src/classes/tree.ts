import { DepthDict, INode, INodeDict } from "../interfaces";

export class Tree {
    public nodeDict!: INodeDict;
    public depthDict: DepthDict = {};

    constructor(nodeDict: INodeDict) {
        this.nodeDict = nodeDict;
        this.setDepthDict(this.rootId, 0);
        console.log(this.depthDict);

        console.log(this.getLeafNodes());

        console.log(this.getDirectParents('C16'));

    }

    public get rootId(): string {
        return Object.entries(this.nodeDict).filter(
            ([_, nodeInfo]) => nodeInfo.isRoot
        )[0][0];
    }

    private setDepthDict(nodeId: string, depth: number): void {
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

    public getDirectParents(nodeId: string): string[] {
        return Object.entries(this.nodeDict).reduce<string[]>((accummulate, [parentId, parentInfo]) => {
            if (parentInfo.childrenIds?.includes(nodeId) || parentInfo.mergeIds?.includes(nodeId)) {

                return [...accummulate, parentId];
            }
            return accummulate;
        }, []);
    }
}
