<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            
            // Check for updates
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New update available
                            console.log('New content is available; please refresh.');
                            // Optional: Automatically reload page once to show new content
                            // window.location.reload(); 
                        } else {
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        });
        
        // Reload page if the controller changes (e.g. new SW activated)
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }
</script>
    })
  );
  return self.clients.claim();
});
