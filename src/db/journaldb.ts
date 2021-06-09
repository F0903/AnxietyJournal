import Database, { Document } from "./db";

export interface IJournalDocument {
	task: string;
	anxietyScale: number;
	date: Date;
	optionalNote?: string;
}

export class JournalDocument extends Document implements IJournalDocument {
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

export default class JournalDatabase extends Database<JournalDocument> {
	constructor() {
		super("AnxietyJournal");
	}
}
