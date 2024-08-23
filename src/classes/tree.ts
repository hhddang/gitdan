import { DepthDict, INode, INodeDict } from "../interfaces";

export class Tree {
    public nodeDict!: INodeDict;
    public depthDict!: DepthDict;

    constructor(nodeDict: INodeDict) {
        this.nodeDict = nodeDict;
        this.setDepthDict(this.rootId, 0);
        console.log(this.getLeafNodes());

    }

    private get rootId(): string {
        return Object.entries(this.nodeDict).filter(([_, nodeInfo]) => nodeInfo.isRoot)[0][0];
    }

    private setDepthDict(nodeId: string, depth: number): void {
        this.depthDict = {
            ...this.depthDict,
            [nodeId]: depth
        };
        this.nodeDict[nodeId].childrenIds?.map(childId => this.setDepthDict(childId, depth + 1));
    }

    public getLeafNodes(): string[] {
        const abc = (nodeId: string): string[] => {
            if (this.nodeDict[nodeId].childrenIds) {
                return this.nodeDict[nodeId].childrenIds.reduce<string[]>((accumIds, childId) => {
                    return [...accumIds, ...abc(childId)];
                }, []);
            } else {
                return [nodeId];
            }
        };
        return abc(this.rootId);
    }
}