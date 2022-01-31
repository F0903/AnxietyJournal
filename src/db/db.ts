import { FilterQuery, MongoClient, Collection, ObjectID } from "mongodb";
import { DbDocument } from "./document";

const dbUri = "mongodb://localhost:27017/";
const defaultDbName = "AnxietyJournal";

class DB {
	private mongo: MongoClient;

	public constructor(dbName: string) {
		this.mongo = new MongoClient(dbUri + dbName, {
			useUnifiedTopology: true,
		});
	}

	private async findOrCreateCol(colName: string): Promise<Collection> {
		const db = this.mongo.db();
		const cols = await db.collections();
		let col = cols.find((x) => x.collectionName === colName);
		if (!col) col = await db.createCollection(colName);
		return col;
	}

	async connect(): Promise<void> {
		await this.mongo.connect();
	}

	async close(): Promise<void> {
		await this.mongo.close();
	}

	async getValue<Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<DbDocument | null> {
		const col = await this.findOrCreateCol(collectionName);
		return col.findOne(query);
	}

	async getAll<Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<readonly DbDocument[]> {
		const col = await this.findOrCreateCol(collectionName);
		const vals = col.find(query);
		return vals.toArray();
	}

	async setValue(collectionName: string, doc: DbDocument): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		if (!doc["_id"]) doc._id = new ObjectID().toHexString();
		await col.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
	}

	async deleteValue<Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		await col.deleteOne(query);
	}
}

export default class Database {
	private static dbName: string = defaultDbName;

	static setActiveDatabase(dbName: string = defaultDbName): void {
		this.dbName = dbName;
	}

	static async do<T>(fn: (db: DB) => Promise<T>): Promise<T> {
		const db = new DB(this.dbName);
		await db.connect();
		const ret = await fn(db);
		await db.close();
		return ret;
	}
}
