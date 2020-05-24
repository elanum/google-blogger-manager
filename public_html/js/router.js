/* 
 * @licence CC BY-SA 4.0
 * @author Paul Kluge
 */

"use strict";
// Router Objekt
const router = (function () {

    // Private Variable
    let mapRouteToHandler = new Map();

    // Öffentliche Methoden
    return {
        // Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu oder aktualisiert sie.       
        addRoute(route, handler) {
            // Aktualisiert ein Element.
            mapRouteToHandler.set(route, handler);
        },

        // Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll. "sector" informiert, welcher Abschnitt
        // neu geladen werden muss.
        navigateToPage(url, sector) {
            history.pushState(null, "", url);
            this.handleRouting(sector);

        },

        // Wird als Eventhandler an ein <a>-Element gebunden
        handleNavigationEvent(event) {
            event.preventDefault();
            // Holt sich href (z.B. /login) 
            let url = event.target.href;
            this.navigateToPage(url);
        },

        // Nimmt sich den Schlüssel, um die Funktion (Wert des Schlüssels) aufzurufen.
        // Wird außerdem als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt (popstate) werden
        handleRouting(sector) {
            // Nimmt sich das was sich hinter dem ersten '/' befindet.
            const currentPage = window.location.pathname.split('/')[1];
            console.log("Navigation URL: " + window.location.pathname);
            // Holt sich die Funktion mit dem entsprechenden Key.
            let routeHandler = mapRouteToHandler.get(currentPage);
            // console.log("routHandler: " + routeHandler);
            if (routeHandler === undefined)
                // console.log("routHandler ist undefined");
                routeHandler = mapRouteToHandler.get(''); //Startseite
            // Führt diese Funktion aus.
            routeHandler(sector);
        }
    };
})();

// Selbsaufrufende Funktionsdeklaration: (function name(){..})();
(function initRouter() {
    console.log("Router: Routen werden hinzugefügt. (initRouter)")
// Fügen Routen mit den Argumenten div id und handler hinzu.
    // The "Homepage".
    router.addRoute('', function () {
        presenter.showStartPage();
    });

    // Übersicht
    router.addRoute('overview', function () {
        // Falls eine ID aufgerufen wurde stoppt der Router hier.
        if (window.location.pathname.split('/overview/')[1]) {
            var id = window.location.pathname.split('/overview/')[1].trim();
            presenter.showOverview(id);
        } else {
            presenter.showOverview();
        }
    });

    router.addRoute('blogOverview', function () {
        // Aus dem location.hash die Objekt id lesen. Warum var?
        var id = window.location.pathname.split('/overview/')[1].trim();
        presenter.showBlogOverview(id);
    });

    router.addRoute('detail', function (sector) {
        // Aus dem location.hash die Objekt id lesen
        var bid = window.location.pathname.split('/detail/')[1].trim();
        var bid = bid.split('/post/')[0].trim();
        var pid = window.location.pathname.split('/post/')[1].trim();
        presenter.showDetail(bid, pid, sector);
    });

    // The "Edit".
    router.addRoute('edit', function () {
        var bid = window.location.pathname.split('/edit/')[1].trim();
        var bid = bid.split('/post/')[0].trim();
        var pid = window.location.pathname.split('/post/')[1].trim();
        presenter.showEdit(bid, pid);
    });

    // The "Create".
    router.addRoute('create', function () {
        var bid = window.location.pathname.split('/create/')[1].trim();
        var bid = bid.split('/post/')[0].trim();

        presenter.showEdit(bid);
    });

// popstate: Vor/Zurück-Button und das Initial-handleRouting.
    if (window) {
        window.addEventListener('popstate', (event) => {
            router.handleRouting();
        });
        // Navigieren zur Startseite.
        router.handleRouting();
       
    }
})();
