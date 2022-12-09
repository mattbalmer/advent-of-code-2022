export const toPrint: [string, string][] = [];

export const printWithAnswer = (label: string, value: string) => {
  toPrint.push([label, value]);
}