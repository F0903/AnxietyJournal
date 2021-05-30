import { Db, FilterQuery, MongoClient, Collection, ObjectId } from "mongodb";

const dbUri = "mongodb://localhost:27017/AnxietyJournal";

export interface IJournalDocumentFrame {
	task: string;
	anxietyScale: number;
	optionalNote?: string;
}

export interface IJournalDocument {
	readonly _id: ObjectId;
	task: string;
	anxietyScale: number;
	optionalNote?: string;
}

export class JournalDocument implements IJournalDocument {
	readonly _id = new ObjectId();
	task: string;
	anxietyScale: number;
	optionalNote?: string;

	constructor(task: string, anxietyScale: number, optionalNote?: string) {
		this.task = task;
		this.anxietyScale = anxietyScale;
		this.optionalNote = optionalNote;
	}
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

	async setValue(
		collectionName: string,
		doc: IJournalDocumentFrame | IJournalDocument
	): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		let actualDoc: IJournalDocument;
		if (!("_id" in doc)) {
			actualDoc = new JournalDocument(
				doc.task,
				doc.anxietyScale,
				doc.optionalNote
			);
		} else actualDoc = doc;
		await col.updateOne(
			{ _id: actualDoc._id },
			{ $set: doc },
			{ upsert: true }
		);
	}

	async deleteValue<Q>(
		collectionName: string,
		query: FilterQuery<Q>
	): Promise<void> {
		const col = await this.findOrCreateCol(collectionName);
		await col.deleteOne(query);
	}
}
