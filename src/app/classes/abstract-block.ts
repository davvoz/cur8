import { Utils } from "./my_utils";

export abstract class AbstractBlock {
    public id: string;
    public createdOn: Date;
    public modifiedOn: Date;

    constructor() {
        this.id = Utils.getProgressiveId('block').toString();
        this.createdOn = new Date();
        this.modifiedOn = new Date();
    }
}