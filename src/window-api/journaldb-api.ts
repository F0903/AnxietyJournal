import { FilterQuery } from "mongodb";
import { IJournalDocument, JournalDocument } from "../db/journaldb";
import { send, send_receive } from "./send-rec";

export const whitelist = ["db-get-all", "db-set"];

export interface IJournalDbApi {
	get_all: <Q>(
		colName: string,
		query: FilterQuery<Q>
	) => Promise<readonly JournalDocument[]>;

	set: (colName: string, value: IJournalDocument) => Promise<void>;
}

export class JournalDbApi implements IJournalDbApi {
	get_all = <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<readonly JournalDocument[]> => {
		return send_receive("db-get-all", colName, query);
	};

	set = (colName: string, value: IJournalDocument): Promise<void> => {
		return send("db-set", colName, value);
	};
}
