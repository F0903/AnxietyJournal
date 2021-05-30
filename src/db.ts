import { Db, FilterQuery, MongoClient, Collection } from "mongodb";

const dbUri = "mongodb://localhost:27017/AxietyJournal";

export interface ServerDocument {
	readonly _id?: string;
	name: string;
	imgUrl: string;
}

export default class Database {
	private mongo: MongoClient;
	private db: Db;

	constructor() {
		this.mongo = new MongoClient(dbUri, { useUnifiedTopology: true });
		this.mongo.connect();
		this.db = this.mongo.db();
	}

	private async findOrCreateCol(colName: string): Promise<Collection> {
		const cols = await this.db.collections();
		let col = cols.find((x) => x.collectionName === colName);
		if (!col) col = await this.db.createCollection(colName);
		return Promise.resolve(col);
	}

	async close(): Promise<void> {
		await this.mongo.close();
	}

	async getValue<T, Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<T | null> {
		const col = await this.findOrCreateCol(collectionName);
		return col.findOne(query);
	}

	async getAll<T, Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<T[]> {
		const col = await this.findOrCreateCol(collectionName);
		const vals = col.find(query);
		return vals.toArray();
	}

	async setValue(collectionName: string, doc: ServerDocument): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		await col.updateOne({ name: doc.name }, { $set: doc }, { upsert: true });
	}

	async deleteValue<Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		await col.deleteOne(query);
	}
}
