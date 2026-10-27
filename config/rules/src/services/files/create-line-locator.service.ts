export function createLineLocator(text: string): (offset: number) => number {
  const lineStarts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "\n") lineStarts.push(index + 1);
  }

  return (offset) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      const start = lineStarts[middle];
      if (start !== undefined && start <= offset) low = middle;
      else high = middle - 1;
    }
    return low + 1;
  };
}
