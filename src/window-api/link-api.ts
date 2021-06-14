import { send } from "./send-rec";

export interface ILinkApi {
	link_open: (link: string) => Promise<void>;
}

export class LinkApi {
	link_open = (link: string): Promise<void> => {
		return send("link-open", link);
	};
}
