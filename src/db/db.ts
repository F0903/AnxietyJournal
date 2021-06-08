import { Db, FilterQuery, MongoClient, Collection } from "mongodb";
import { ObjectId } from "mongodb";

const dbUri = "mongodb://localhost:27017/";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDocument {}

export class Document implements IDocument {
	_id: ObjectId = new ObjectId();
}

export default class Database<T extends Document> {
	protected dbName: string;
	private mongo: MongoClient;
	private db: Db;

	public constructor(dbName: string) {
		const mongo = (this.mongo = new MongoClient(dbUri + dbName, {
			useUnifiedTopology: true,
		}));
		mongo.connect();
		this.db = this.mongo.db();
		this.dbName = dbName;
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
	): Promise<readonly T[]> {
		const col = await this.findOrCreateCol(collectionName);
		const vals = col.find(query);
		return vals.toArray();
	}

	async setValue(collectionName: string, doc: T): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		if (!doc["_id"]) doc._id = new ObjectId();
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