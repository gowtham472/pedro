/**
 * Seeds Firestore with Pedro's content (domains, lessons, tasks) from
 * lib/content/*. This is the ONLY place lib/content should be imported
 * outside of unit tests - at runtime the app always reads content back out
 * of Firestore (see lib/server/dal/content.ts), so admin edits made later
 * take effect without a rebuild.
 *
 * Usage: pnpm seed
 * Safe to re-run - every write is an idempotent upsert keyed by content id.
 */
import { adminDb } from "../lib/firebase/admin";
import { ALL_DOMAINS, ALL_LESSONS, ALL_TASKS } from "../lib/content";
import { upsertDomain, upsertLesson, upsertTask } from "../lib/server/dal/content";
import { DEFAULT_SCORING_WEIGHTS } from "../lib/server/scoring/defaults";

async function seed() {
  console.log(`Seeding ${ALL_DOMAINS.length} domains...`);
  for (const domain of ALL_DOMAINS) {
    await upsertDomain(domain);
  }

  console.log(`Seeding ${ALL_LESSONS.length} lessons...`);
  for (const lesson of ALL_LESSONS) {
    await upsertLesson(lesson);
  }

  console.log(`Seeding ${ALL_TASKS.length} tasks...`);
  for (const task of ALL_TASKS) {
    await upsertTask(task);
  }

  const scoringConfigDoc = await adminDb.collection("scoringConfig").doc("global").get();
  if (!scoringConfigDoc.exists) {
    console.log("Seeding default scoring weights...");
    await adminDb.collection("scoringConfig").doc("global").set(DEFAULT_SCORING_WEIGHTS);
  }

  console.log("Done.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
