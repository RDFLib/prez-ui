import type { SimpleQueryResult } from "@/stores/search";

export type ButtonOption = {
  value: string;
  text: string;
}


export function enumToOptions<T extends Record<string, string>>(myEnum: T): ButtonOption[] {
    return Object.keys(myEnum)
      .map(key => ({
        value: myEnum[key],
        text: key,
      }));
  }

export function simpleQueryResultToOptions(queryResults: SimpleQueryResult[]): ButtonOption[] {
  return queryResults.map(item=>{
    return {value: item.subject, text: item.object}
  })
}
