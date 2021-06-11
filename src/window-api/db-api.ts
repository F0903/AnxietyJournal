import { FilterQuery } from "mongodb";
import { IDbDocument } from "../db/db";
import { send, send_receive } from "./send-rec";

export const whitelist = ["db-get", "db-get-all", "db-set", "db-delete"];

export interface IDbApi {
	get: <Q>(
		colName: string,
		query: FilterQuery<Q>
	) => Promise<IDbDocument | null>;
	get_all: <Q>(
		colName: string,
		query: FilterQuery<Q>
	) => Promise<readonly IDbDocument[]>;
	set: (colName: string, value: IDbDocument) => Promise<void>;
	delete: <Q>(colName: string, query: FilterQuery<Q>) => Promise<void>;
}

export class DbApi implements IDbApi {
	get = async <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<IDbDocument | null> => {
		return send_receive("db-get", colName, query);
	};

	get_all = async <Q>(
		colName: string,
		query: FilterQuery<Q>
	): Promise<readonly IDbDocument[]> => {
		return send_receive("db-get-all", colName, query);
	};

	set = async (colName: string, value: IDbDocument): Promise<void> => {
		return send("db-set", colName, value);
	};

	delete = async <Q>(colName: string, query: FilterQuery<Q>): Promise<void> => {
		return send("db-delete", colName, query);
	};
}
