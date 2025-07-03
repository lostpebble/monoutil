export async function processPromisesInBatches<T>(
  promiseFunctions: (() => Promise<T>)[],
  batchSize = 500,
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < promiseFunctions.length; i += batchSize) {
    const batch = promiseFunctions.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);

    // Optional progress logging
    console.log(
      `Processed batch ${i / batchSize + 1}/${Math.ceil(promiseFunctions.length / batchSize)}`,
    );
  }

  return results;
}
