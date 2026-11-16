if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		// A page that already had a service worker gets a new one when the
		// site is updated (sw.js activates it right away). That page is still
		// showing the old version, so offer a reload instead of doing it
		// ourselves — reloading mid-puzzle would throw the board away.
		var hadController = !!navigator.serviceWorker.controller;
		navigator.serviceWorker.addEventListener('controllerchange', function () {
			if (hadController) showUpdateBanner();
		});

		navigator.serviceWorker.register('sw.js').then(function (reg) {
			// An installed app (iPhone especially) is usually resumed rather
			// than reopened, which never checks for a new version, so check
			// whenever it comes back to the foreground.
			document.addEventListener('visibilitychange', function () {
				if (document.visibilityState === 'visible') reg.update().catch(function () {});
			});
		}).catch(function () {});
	});
}

function showUpdateBanner() {
	if (document.getElementById('updateBanner')) return;
	var bar = document.createElement('div');
	bar.id = 'updateBanner';
	bar.setAttribute('role', 'status');
	bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);'
		+ 'top:calc(8px + env(safe-area-inset-top));z-index:200;'
		+ 'display:flex;align-items:center;gap:10px;padding:8px 10px 8px 14px;'
		+ 'background:#1b2340;color:#e7eaf5;border:1px solid #5b86ff;border-radius:10px;'
		+ 'box-shadow:0 4px 18px rgba(0,0,0,.45);font-size:14px;white-space:nowrap;';
	var text = document.createElement('span');
	text.textContent = '新しい版があります';
	var update = document.createElement('button');
	update.textContent = '更新';
	update.style.cssText = 'border:0;border-radius:8px;padding:6px 14px;cursor:pointer;color:#fff;'
		+ 'font-weight:bold;background:linear-gradient(135deg,#5b86ff,#9a5cff);';
	update.addEventListener('click', function () { location.reload(); });
	var close = document.createElement('button');
	close.textContent = '✕';
	close.setAttribute('aria-label', '閉じる');
	close.style.cssText = 'border:0;background:none;color:#8b93ac;cursor:pointer;padding:4px 6px;font-size:14px;';
	close.addEventListener('click', function () { bar.parentNode.removeChild(bar); });
	bar.appendChild(text);
	bar.appendChild(update);
	bar.appendChild(close);
	document.body.appendChild(bar);
}
