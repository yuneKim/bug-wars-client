export function getLabels(content: string) {
  return content
    .split('\n')
    .filter((line) => line.startsWith(':'))
    .map((line) => line.slice(1));
}
