import { promises as fs } from "fs";

import { existsSync } from "node:fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

async function transformData() {
  console.log("⏳ Trimming column data ...");

  const start = Date.now();

  const options = await yargs(hideBin(process.argv))
    .usage("Usage: -i <election-id>")
    .option("i", {
      alias: "electionId",
      describe: "Election id",
      type: "string",
      demandOption: true,
    }).argv;

  const end = Date.now();

  const rawElectionsDataPath = `./raw-data/${options.i}.csv`;

  if (!existsSync(rawElectionsDataPath)) {
    throw new Error(`Could not find raw CSV file = ${rawElectionsDataPath}`);
  }

  const rawElectionsData = await fs.readFile(rawElectionsDataPath, "utf-8");

  // Step 2: Parse CSV
  const records: string[][] = parse(rawElectionsData, {
    trim: false,
    skipEmptyLines: false,
  });

  // Step 3: Trim each cell & remove empty rows
  const cleaned = records
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length > 0)); // remove empty rows

  // Step 4: Write cleaned CSV back to disk
  const output = stringify(cleaned);

  await fs.writeFile(rawElectionsDataPath, output, "utf8");

  console.log(`✅ Transformation completed in ${end - start}ms`);

  process.exit(0);
}

transformData().catch((err) => {
  console.error("❌ Trim columns failed");
  console.error(err);
  process.exit(1);
});
