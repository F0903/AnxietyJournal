import Database, { DbDocument } from "./db";

export interface IJournalDocument {
	task: string;
	anxietyScale: number;
	date: Date;
	optionalNote?: string;
}

export class JournalDocument extends DbDocument implements IJournalDocument {
	task: string;
	anxietyScale: number;
	date: Date;
	optionalNote?: string;

	constructor(
		task: string,
		anxietyScale: number,
		date: Date,
		optionalNote?: string
	) {
		super();
		this.task = task;
		this.anxietyScale = anxietyScale;
		this.date = date;
		this.optionalNote = optionalNote;
	}
}

export default class JournalDatabase extends Database {
	constructor() {
		super("AnxietyJournal");
	}
}
