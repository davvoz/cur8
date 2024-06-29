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

export interface SteemData {
  account_name: string;
  curation_rewards_sp: number;
  date: string;
  id: number;
}

export interface MyPost {
  title: string;
  imageUrl : string;
  url: string;
  author: string;
}

export interface  GlobalPrezzi {
  price: number;
  price_dollar: number;
}

export interface OutputFetchPostDC{
  trovato : boolean;
  post : MyPost|null;
}