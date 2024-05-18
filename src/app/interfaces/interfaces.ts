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

export interface HiveData {
  account_name: string;
  curation_rewards_hp: number;
  date: string;
  id: number;
}