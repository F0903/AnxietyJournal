import { ObjectId } from "mongodb";

export interface IDbDocument {
	_id: ObjectId;
}

export class DbDocument implements IDbDocument {
	_id: ObjectId = new ObjectId();
}

export interface IJournalDocument extends IDbDocument {
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
