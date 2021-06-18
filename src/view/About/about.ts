import { SetSidebarPage } from "../sidebar/sidebar";

export default function InitAbout(): void {
	const about = document.querySelector("#SidebarAbout") as HTMLElement;
	about.addEventListener("click", OnAboutClick);
}

function OnAboutClick() {
	SetSidebarPage("About");
}
