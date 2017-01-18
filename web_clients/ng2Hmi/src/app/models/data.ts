export class Data {
    
    date: Date;
    value: number;
    NodeID: string;
    
    constructor(obj?: any) {
        this.date = obj && obj.date || new Date;
        this.value = obj && obj.value || 0;
        this.NodeID   = obj && obj.nodeId  || 'X';
  }
}

