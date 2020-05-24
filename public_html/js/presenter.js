/* 
 * @licence CC BY-SA 4.0
 * @author Paul Kluge
 */

"use strict";
const presenter = (function () {
    // private Variablen und Funktionen
    let init = false;
    let owner = undefined;

    // Initialisiert die statischen Teile der Seite (Header/Footer)
    function initPage() {
        console.log("Presenter: Init Page");
        let headerH3 = document.querySelector("body header h3");
        init = true;
        // Holt sich den Benutzername aus model.
        model.getSelf((result) => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer ${owner} hat sich angemeldet.`);
            headerH3.innerHTML = `${owner}`;
        });
    }

    // Erstellt die Hauptnavigation.
    function initNav(page) {
        console.log("Presenter: initNav");
        let main = document.getElementById('header');
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (page) {
            main.append(page);
        }
    }

    // Ersetzt die drei Abschnitte des main-contents.
    function replaceUp(page) {
        let main = document.getElementById('firstSection');
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (page) {
            main.append(page);
        }
    }

    function replaceMid(page) {
        let main = document.getElementById('secondSection');
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (page) {
            main.append(page);
        }
    }

    function replaceLo(page) {
        let main = document.getElementById('thirdSection');
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (page) {
            main.append(page);
        }
    }

    // Öffentliche Schnittstelle des Presenters
    return {

        // Zeigt die Startseite der Anwendung
        showStartPage() {
            console.log("Presenter: Aufruf von showStartPage");
            // Erst nach erfolgreicher Abfrage, ob "model.isLoggedIn()"-Funktion true ist,
            // wird initPage() aufgerufen. Prüft also ob User eingeloggt ist.
            if (model.isLoggedIn()) {
                initPage();
                router.navigateToPage("/overview");
            }
        },

        // Wird aufgerufen, wenn die Übersichtsseite angezeigt werden soll
        showOverview(id) {
            if (!init)
                initPage();
            // Die zu rendernden Daten vom Model beziehen
            // Variable im größtmöglichen Scope der Funktion definieren.
            var newest = 0;
            var ID = 0;

            if (!id) {
                console.log("Presenter: Aufruf von showOverview Init");
                // Frägt ab, ob Rückgabewert von isLoggedIn (loggedIn) true ist.                
                if (model.isLoggedIn()) {
                    // Die Callback-Funktion ermöglicht es, mit Werten (z.B. Objekten) zu arbeiten, welche aus einer Datenbank stammen.
                    model.getAllBlogs((result) => {

                        // Blog mit der letzten Änderung finden.
                        for (let updated of result) {                           
                            let newestTest = Date.parse(updated.updated);
                            // hätte updated wieder Key-Value-Pairs, dann blog.updated.foo
                            if (newestTest > newest) {
                                newest = newestTest;
                            }
                        }

                        // Blog mit letzter Änderung "auswählen" und mit Model/View rendern.
                        for (let blog of result) {
                            if (Date.parse(blog.updated) === newest) {
                                ID = blog.id;
                            }
                        }

                    });

                    // Rendern der Navigation. result ist dabei das Objekt in der Datenbank.
                    model.getAllBlogs((result) => {
                        // Aufruf der Render-Methode der View. Übergeben der Daten.

                        let page = overView.render(result);
                        initNav(page);

                        // Blog mit letzter Änderung "auswählen" und mit Model/View rendern.
                        model.getBlog(ID, (result) => {

                            let page = blogOverView.render(result);
                            let path = window.location.pathname.split('/overview')[0].trim();
                            router.navigateToPage(path + "/overview/" + ID);
                            console.log("Presenter: Blog mit letzter Änderung " + ID + " wird aufgerufen");
                            replaceUp(page);
                        });

                        // Render der Post-Übersicht.
                        model.getBlogPosts(ID, (result) => {
                            // Aufruf der render-Methode der View, übergeben der Daten
                            let page = postOverView.render(result);
                            replaceMid(page);
                        });

                    });
                    // Unterer Bereich wird nicht benötigt.
                    let page = undefined;
                    replaceLo(page);
                }
            } else {
                console.log("Presenter: Aufruf von showOverview mit ID");
                //      if (model.isLoggedIn()) {
                let ID = id;
                model.getBlog(ID, (result) => {
                    // Aufruf der render-Methode der View, übergeben der Daten
                    let page = blogOverView.render(result);
                    replaceUp(page);
                });
                model.getBlogPosts(ID, (result) => {
                    // Aufruf der render-Methode der View, übergeben der Daten
                    let page = postOverView.render(result);
                    replaceMid(page);
                });
                let page = undefined;
                replaceLo(page);
            }

            // router.navigateToPage("/blogOverview");
        },

        // Wird aufgerufen, wenn die Detailansicht der Person 
        // mit der id angezeigt werden soll.
        showDetail(bid, pid, sector) {
            console.log("Presenter: Aufruf von showDetail");
            if (!init)
                initPage();
            // Erst nach erfolgreicher Abfrage, ob "model.isLoggedIn()"-Funktion true ist,
            // wird initPage() aufgerufen. Ansonsten Fehlermeldung: "Uncaught ReferenceError: gapi is not defined"
            if (model.isLoggedIn()) {
                // Die zu rendernden Daten vom Model beziehen

                console.log("sector");
                console.log(sector);

                if (sector === "lo") {
                    model.getAllComments(bid, pid, (result) => {
                        // Aufruf der render-Methode der View, übergeben der Daten
                        let page = commentView.render(result);
                        replaceLo(page);
                    });

                } else {

                    model.getBlogFromPost(bid, (result) => {
                        // Aufruf der render-Methode der View, übergeben der Daten
                        let page = detailView.render(result);
                        replaceUp(page);
                    });
                    model.getPost(bid, pid, (result) => {
                        // Aufruf der render-Methode der View, übergeben der Daten
                        let page = postDetails.render(result);
                        replaceMid(page);
                    });
                    model.getAllComments(bid, pid, (result) => {
                        // Aufruf der render-Methode der View, übergeben der Daten
                        let page = commentView.render(result);
                        replaceLo(page);
                    });
                }
            }
        },

        // Editierungsansicht.
        showEdit(bid, pid) {
            console.log("Presenter: Aufruf von showEdit");
//            if (!init)
//                initPage();
            // Die zu rendernden Daten vom Model beziehen
            if (model.isLoggedIn()) {

                model.getBlog(bid, (result) => {
                    // Aufruf der render-Methode der View, übergeben der Daten
                    let page = editView.render(result);
                    replaceUp(page);
                });

                if (pid) {

                    // Der Funktionsparameter mit dem Übergabewert "result" ist die Callback-Funktion.
                    model.getPost(bid, pid, (result) => {
                        // Aufruf der render-Methode der View, übergeben der Daten
                        // Schickt einen Boolean, ob pid existiert.
                        let page = editPostView.render(true, result);
                        replaceMid(page);
                    });
                } else {

                    let page = editPostView.render(false);
                    replaceMid(page);


                }


                let page = undefined;
                replaceLo(page);


            }


        },

        // Neuer Post.
        showCreate(bid) {
            console.log("Presenter: Aufruf von showCreate");
//            if (!init)
//                initPage();
            // Die zu rendernden Daten vom Model beziehen
            if (model.isLoggedIn()) {

                model.getBlog(bid, (result) => {
                    // Aufruf der render-Methode der View, übergeben der Daten
                    let page = createView.render(result);
                    replaceUp(page);
                });

                let page = undefined;
                replaceMid(page);

                let pageLo = undefined;
                replaceLo(pageLo);
            }
        }
    };
})();

