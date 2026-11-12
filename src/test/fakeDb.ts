import { TransactionRollbackError } from "drizzle-orm";

export type FakeUpdate = {
    table: unknown;
    values: Record<string, unknown>;
    whereCalled: boolean;
    whereArg: unknown;
};

type FakeRow = Record<string, unknown>;

export class FakeDb {
    rows: FakeRow[] = [];
    updates: FakeUpdate[] = [];
    selectWhereCalled = false;
    selectWhereArg: unknown = undefined;
    transactionCommitted = false;
    transactionRolledBack = false;

    reset(rows: FakeRow[] = []) {
        this.rows = rows;
        this.updates = [];
        this.selectWhereCalled = false;
        this.selectWhereArg = undefined;
        this.transactionCommitted = false;
        this.transactionRolledBack = false;
    }

    select() {
        this.selectWhereCalled = false;
        this.selectWhereArg = undefined;

        return {
            from: (_table: unknown) => ({
                where: (arg: unknown) => {
                    this.selectWhereCalled = true;
                    this.selectWhereArg = arg;
                    return Object.assign(Promise.resolve(this.rows), {
                        all: () => this.rows,
                    });
                },
                all: () => this.rows,
            }),
        };
    }

    update(table: unknown) {
        const update: FakeUpdate = {
            table,
            values: {},
            whereCalled: false,
            whereArg: undefined,
        };
        this.updates.push(update);

        return {
            set: (values: Record<string, unknown>) => {
                update.values = values;
                return {
                    where: (arg: unknown) => {
                        update.whereCalled = true;
                        update.whereArg = arg;
                        return Object.assign(Promise.resolve({ changes: 1 }), {
                            run: () => ({ changes: 1 }),
                        });
                    },
                };
            },
        };
    }

    transaction(callback: (tx: FakeDb) => unknown) {
        this.transactionCommitted = false;
        this.transactionRolledBack = false;

        try {
            const result = callback(this);
            if (result instanceof Promise) {
                throw new Error("FakeDb.transaction expects a synchronous callback.");
            }
            this.transactionCommitted = true;
        } catch (error) {
            this.transactionRolledBack = true;
            this.updates = [];
            throw error;
        }
    }

    rollback(): never {
        throw new TransactionRollbackError();
    }
}

export const fakeDb = new FakeDb();
