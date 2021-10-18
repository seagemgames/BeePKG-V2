import { BeePackage } from "./BeePackage.class.js";

/*
	Index.js
*/

function q(x,p=document) { return p.querySelector(x) }

// Create package object
var pkg = new BeePackage();
// Make public ( for development only!! )
window.pkg = pkg;

// Run HTML setup, append generated html to container
q('#pkg-container').appendChild(pkg.html());

const btnDownload = q('#btn-download')

btnDownload.onclick = () => {
	btnDownload.disabled = true;
	if (pkg.json.items.filter(x => {
		// Ensure icons aren't too big, and exist
		if (x.json.files.icon) {
			if (x.json.files.icon.width > 1000 || x.json.files.icon.height > 1000) {
				!confirm('Warning!\nAn uploaded image is abnormally large. This may cause extended processing times and possibly crash the window. Suggested Resolution: 256x256px To continue, press OK.')
				return;
			}
		} else {
			!confirm('Error!\nAn item is missing an icon.')
			return true;
		}

		// Ensure names exist
		if (!x.json.name) {
			!confirm('Error!\nAn item is missing a name.')
			return true;
		}
	}).length) {
		btnDownload.disabled = false;
		btnDownload.innerText = 'Download';
		return;
	}
	btnDownload.innerText = 'Processing...';
	pkg.export().then((x)=>{
		saveAs(x, `ucp_${pkg.idl}.bee_pack`);
		btnDownload.disabled = false;
		btnDownload.innerText = 'Download';
	})
}

