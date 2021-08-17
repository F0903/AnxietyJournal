import { ObjectID } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDbDocument {}

export class DbDocument implements IDbDocument {
	// Needs to be stored as a string. Otherwise it will be converted from an ObjectID when passed through electron IPC.
	_id: string = new ObjectID().toHexString();
}

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
