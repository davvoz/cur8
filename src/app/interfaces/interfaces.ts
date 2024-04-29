import { Client } from "dsteem";

export class MYSTEEMClient extends Client {
  constructor(url: string) {
    super(url);
  }
}

export interface IMRiddData {
  delegaCur8: number;
  ultimoPagamento: number;
}