import Database, { Document } from "./db";

export interface IJournalDocument {
	task: string;
	anxietyScale: number;
	optionalNote?: string;
}

export class JournalDocument extends Document implements IJournalDocument {
	task: string;
	anxietyScale: number;
	optionalNote?: string;

	constructor(task: string, anxietyScale: number, optionalNote?: string) {
		super();
		this.task = task;
		this.anxietyScale = anxietyScale;
		this.optionalNote = optionalNote;
	}
}

export default class JournalDatabase extends Database<JournalDocument> {
	constructor() {
		super("AnxietyJournal");
	}
}
