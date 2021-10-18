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
	pkg.json.items.filter(x => {
		if (x.json.files.icon) {
			if (x.json.files.icon.width > 1000 || x.json.files.icon.height > 1000) {
				!confirm('Warning!\nAn uploaded image is abnormally large. This may cause extended processing times and possibly crash the window. To continue, press OK.')
			}
		} else {
			!confirm('Warning!\nAn item is missing an icon. To continue, press OK.')
		}
	}).length
	btnDownload.innerText = 'Processing...';
	try {
		pkg.export().then((x)=>{
			saveAs(x, `ucp_${pkg.idl}.bee_pack`);
			btnDownload.disabled = false;
			btnDownload.innerText = 'Download';
		})
	} catch(err) {
		btnDownload.innerText = "Export Failed! F12 for info"
	}
}

