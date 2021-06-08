function TestFunc() {
	console.log("hello from journal!");
}

function OnJournalLoad() {
	window.api.db_get_all("journal", {});
}
