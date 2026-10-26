import { fixtureDb } from "@/db/testing/fixtures/connection/fixture-database-connection.config";
import { RollbackSignal } from "@/db/testing/fixtures/transactions/rollback-signal.error";
import type { FixtureTransaction } from "@/types/db/testing/fixtures/transactions/fixture-transaction.interface";

// Each scenario runs in a transaction that is always rolled back.
export async function inRolledBackTransaction(
  scenario: (transaction: FixtureTransaction) => Promise<void>,
): Promise<void> {
  await fixtureDb
    .transaction(async (transaction) => {
      await scenario(transaction);
      throw new RollbackSignal();
    })
    .catch((error: unknown) => {
      if (!(error instanceof RollbackSignal)) throw error;
    });
}
