/* 
 * @licence CC BY-SA 4.0
 * @author Paul Kluge
 */

//  Fordert die Einhaltung strikter Programmierkonventionen.
"use strict";
// Funktion für Rückfrage vor dem Speichern.
function ask(question, yes, no) {
    if (confirm(question))
        yes();
    else
        no();
}

// Formatiert den Datum-String in date in zwei mögliche Datum-Strings:
// long = true: Mittwoch, 24. Oktober 2018, 12:21
function formatDate(date, long) {
    date = new Date(date);
    let options;
    if (long === true) {
        options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
    } else {
        options = {
            weekday: 'short',
            year: '2-digit',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        };
    }
    return date.toLocaleDateString('de-DE', options);
}

// Die View der Übersicht (Hauptnavigation)
const overView = {
    render(data) {
        // EventHandler für die Listenelemente
        let handleEvent = function (event) {
            let li = event.target;
            let page = li.dataset.action;
            router.navigateToPage(page + "/" + li.id);
        };
        console.log("View: render von overView");
        // Klonen des Template-Knotens für die Seite. Hier wird die div id benötigt.
        let page = document.getElementById('overview').cloneNode(true);        
        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data);
        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)
        let ul = page.querySelector("ul");
        // Template für LIs entfernen (wird in der for-of-Schleife neu erstellt)
        ul.firstElementChild.remove();
        // Erstellen eines li-Elements für jeden Blog. 
        for (let p of data) {
            // Klonen des Template-Knotens für das Listenelement
            let li = document.getElementById('li').cloneNode(true);
            // Ersetzen der Platzhalter durch die gleichnamigen Werte des Objekts
            helper.setDataInfo(li, p, false);
            li.id = p.id;
            ul.appendChild(li);
            // Bindet handleEvent an den Router (abstrakt Modul in Form von Konstante oder Variable).
            // Hier nicht notwendig, da overView in der view Funktion mit navigateToPage hat.
            // let handleEvent = router.handleNavigationEvent.bind(router);
        }
        // Eventhandler wird für Liste gesetzt (Delegation)      
        ul.addEventListener("click", handleEvent);
        // Aufruf zum Ersetzen der alten Seite
        return page;
    }
};

// Die View der Blog-Übersicht.
const blogOverView = {
    render(data) {
        // EventHandler für die Google Blog-Ansicht
        let handleEvent = function (event) {           
            let a = event.target;
            let url = a.dataset.action;
            window.open(url);


        };
        console.log("View: render von blogOverView");
        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('blogOverView').cloneNode(true);

        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data);



        let button = page.querySelector("button");
        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)

        let eventHandler = router.handleNavigationEvent.bind(router);
        // a.addEventListener("click", eventHandler);

        // Eventhandler wird für Liste gesetzt (Delegation)      
        button.addEventListener("click", handleEvent);

        return page;
    }
};

// Die Übersicht aller Posts in einem Blog. Wird als Startseite geladen.
const postOverView = {
    render(data) {

        // EventHandler für Details
        let eventHandler = function (event) {
            let Button = event.target;
            let pageName = Button.dataset.action;
            console.log(Button.id);
            // Holt aus dem selfLink die bid und die pid            
            var id = Button.id.split('/blogs/')[1].trim();
            var bid = id.split('/posts/')[0].trim();
            var pid = id.split('/posts/')[1].trim();
            router.navigateToPage(pageName + "/" + bid + "/post/" + pid);
            if (pageName === "/create") {
                router.navigateToPage(pageName + "/" + bid + "/post/new");
            }

            if (pageName === '/delete') {
                ask(
                        "Bist du sicher?",
                        function () {
                            //Einsetzen der Attributwerte
                            model.deletePost(bid, pid);
                            // Holt aus dem selfLink die bid und die pid            
                            router.navigateToPage(pageName);
                        },
                        function () {
                            alert("Du hast den Vorgang abgebrochen.");
                        },
                        );

            }

        };
        console.log("View: render von postOverView");
        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('postView').cloneNode(true);
  
        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        helper.setDataInfo(page, data);

        //Einsetzen der Attributwerte
        // Bindet handleEvent an den Router (abstrakt Modul in Form von Konstante oder Variable).
        // Hier nicht notwendig, da overView in der view Funktion mit navigateToPage hat.
        // let handleEvent = router.handleNavigationEvent.bind(router);
        let ul = page.querySelector("ul");

        // Template für LIs entfernen
        ul.firstElementChild.remove();

        // Rendert die Übersicht jedes (im Blog enthaltenen) Posts.
        if (data) {
            for (let p of data) {
                // Klonen des Template-Knotens für das Listenelement
                let li = document.getElementById('postId').cloneNode(true);
                // Ersetzen der Platzhalter durch die gleichnamigen Werte des Objekts
                helper.setDataInfo(li, p);
                li.id = p.id;
                ul.appendChild(li);
                // Bindet handleEvent an den Router (abstrakt Modul in Form von Konstante oder Variable).
                // Hier nicht notwendig, da overView in der view Funktion mit navigateToPage hat.
                // let handleEvent = router.handleNavigationEvent.bind(router);
            }
        } else {
            console.log("View: Keine Kommentare vorhanden.");
        }

        let a = page.querySelector("a");
        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)
        // let eventHandler = router.handleNavigationEvent.bind(router);
        let button = page.querySelector("button");
        ul.addEventListener("click", eventHandler);
        // Für den "Post hinzufügen" Button
        button.addEventListener("click", eventHandler);

        // button.addEventListener("click", eventHandler);

        // Eventhandler wird für Liste gesetzt (Delegation)      
        // a.addEventListener("click", handleEvent);

        return page;
    }
};

// Die Daten zur Detailansicht.
const detailView = {
    render(data) {
        // EventHandler für Übersicht-Button
        let eventHandler = function (event) {
            let overviewButton = event.target;
            let page = overviewButton.dataset.action;
            var id = overviewButton.id.split('/blogs/')[1].trim();
            var id = id.split('/posts/')[0].trim();
            router.navigateToPage(page + "/" + id);
        };
        console.log("View: render von detailView");
        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('detail').cloneNode(true);

        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data, true);

        let button = page.querySelector("button");

        // let a = page.querySelector("a");
        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)

        // let eventHandler = router.handleNavigationEvent.bind(router);
        // a.addEventListener("click", eventHandler);
        button.addEventListener("click", eventHandler);

        return page;
    }
};

const postDetails = {
    render(data) {
        console.log("View: render von postDetailView");
        console.log(data);

        // EventHandler für "Post editieren"
        let eventHandler = function (event) {
            let editButton = event.target;
            console.log("Handler springt darauf an.");
            let page = editButton.dataset.action;
            var id = editButton.id.split('/blogs/')[1].trim();
            var bid = id.split('/posts/')[0].trim();
            var pid = id.split('/posts/')[1].trim();

            console.log(page);
            if (page === "/delete") {
                ask(
                        "Bist du sicher?",
                        function () {
                            //Einsetzen der Attributwerte
                            model.deletePost(bid, pid);
                            // Holt aus dem selfLink die bid und die pid            
                            router.navigateToPage("detail/" + bid + "/post/" + pid);
                        },
                        function () {
                            alert("Du hast den Vorgang abgebrochen.");
                        },
                        );


            } else if (page === '/edit') {
                router.navigateToPage(page + "/" + bid + "/post/" + pid);
            }
        };

        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('postDetail').cloneNode(true);

        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data, true);
        console.log("Das ist page");
        console.log(page);
        let button = page.querySelector("button");
        let footer = page.querySelector("footer");
        footer.addEventListener("click", eventHandler);
        // Eventhandler wird für Liste gesetzt (Delegation)      
        // a.addEventListener("click", handleEvent);

        return page;
    }
};


const commentView = {
    render(data) {
        console.log("View: render von commentView");
        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('comments').cloneNode(true);

        // EventHandler für "Abbrechen"
        let eventHandler = function (event) {
            console.log(event);
            let deleteButton = event.target;
            var id = deleteButton.dataset.action.split('/blogs/')[1].trim();
            let bid = id.split('/posts/')[0].trim();
            let pid = id.split('/posts/')[1].trim();
            pid = pid.split('/comments/')[0].trim();
            let cid = id.split('/comments/')[1].trim();
            console.log(bid);
            console.log(pid);
            console.log(cid);
            model.deleteComment(bid, pid, cid);
            let lo = "lo";
            router.navigateToPage("/detail/" + bid + "/post/" + pid, lo);
        };

        console.log(page);
        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data, true);
        let ul = page.querySelector("ul");
        // Template für LIs entfernen (wird in der for-of-Schleife neu erstellt)
        ul.firstElementChild.remove();

        if (data) {
            for (let p of data) {
                // Klonen des Template-Knotens für das Listenelement
                let li = document.getElementById('%idc').cloneNode(true);
                // Ersetzen der Platzhalter durch die gleichnamigen Werte des Objekts
                helper.setDataInfo(li, p, true);
                li.id = p.id;
                ul.appendChild(li);
                console.log(data);
                // Bindet handleEvent an den Router (abstrakt Modul in Form von Konstante oder Variable).
                // Hier nicht notwendig, da overView in der view Funktion mit navigateToPage hat.
                // let handleEvent = router.handleNavigationEvent.bind(router);
            }
        } else {
            page.innerHTML = '<div class= "content"><p>Noch keine Kommentare</p></div>';

            // let part = page.split('<h3>Kommentare</h3>')[1];
        }

        let button = page.querySelector("button");
        console.log(button);

        ul.addEventListener("click", eventHandler);

        // let a = page.querySelector("a");
        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)

        // let eventHandler = router.handleNavigationEvent.bind(router);
        // a.addEventListener("click", eventHandler);
        // button.addEventListener("click", eventHandler);

        return page;
    }
};


const editView = {
    render(data) {


        console.log("View: render von Edit");
        // Klonen des Template-Knotens für die Seite
        let page = document.getElementById('edit').cloneNode(true);
        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        //Einsetzen der Attributwerte
        helper.setDataInfo(page, data);
        let a = page.querySelector("a.d1");


        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)
        // let eventHandler = router.handleNavigationEvent.bind(router);
        // a.addEventListener("click", eventHandler);
        return page;
    }
};

// Zeigt "Post erstellen" und "Post editieren" an.
const editPostView = {
    render(pidExist, data) {
        console.log("View: render von EditPost");
        console.log(data);
        let page = document.getElementById('editPost').cloneNode(true);

        // EventListener für Formular
        let eventHandler = function (event) {
            event.preventDefault();
            let editButton = event.target;
            let pageName = editButton.dataset.action;

            function getBid(pidExist) {
                if (pidExist == true) {
                    var id = editButton.id.split('/blogs/')[1].trim();
                    let bid = id.split('/posts/')[0].trim();
                    return bid;
                } else if (pidExist == false) {
                    let bid = window.location.pathname.split('/create/')[1].trim();
                    bid = bid.split('/post/')[0];
                    return bid;
                }

            }

            function getPid(pidExist) {
                if (pidExist == true) {
                    var id = editButton.id.split('/blogs/')[1].trim();
                    let bid = id.split('/posts/')[0].trim();
                    let pid = id.split('/posts/')[1].trim();
                    return pid;
                }

            }

            // EventHandler für "Abbrechen"
            if (pageName === "cancel") {
                window.history.back();
            } else if (pageName === "/overview") {
                console.log("EditButton");
                console.log(editButton.id);



                // Aus var bid = window.location.pathname.split('/edit/')[1].trim(); die bid rausziehen               

                let blog = {};
                let form = document.forms[0];
                // form.titel ist das Feld für den neuen Titel.
                blog[form.titel.id] = form.titel.value;
                // Text aus dem Formular auslesen.
                let text = document.getElementById('postText').innerHTML;
                // Titel aus dem Formular auslesen.
                let content = blog[form.titel.id];

                // Funktionsaufruf
                if (pidExist == true) {
                    ask(
                            "Bist du sicher?",
                            function () {
                                //Einsetzen der Attributwerte
                                model.updatePost(getBid(pidExist), getPid(pidExist), content, text);
                                // Holt aus dem selfLink die bid und die pid            
                                router.navigateToPage(pageName);
                            },
                            function () {
                                alert("Du hast den Vorgang abgebrochen.");
                            },
                            );
                } else if (pidExist == false) {
                    model.createPost(getBid(pidExist), content, text);
                    router.navigateToPage(pageName);
                }
            }
        };


        // Klonen des Template-Knotens für die Seite

        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");


        if (pidExist == true) {
            //Einsetzen der Attributwerte
            helper.setDataInfo(page, data, true);
        } else if (pidExist == false) {
            console.log("keine PID");
            helper.makeBlank(page);
        }


        // Hier muss die Methode von router an router gebunden werden, da 
        // in dieser Methode this aufgerufen wird. Bei einem EventHandler 
        // bezieht sich this standardmaeßig auf den Knoten, auf dem der 
        // EventHandler ausgelöst wurde (this=event.currentTarget)
        // let button = page.querySelector("button");
        let cancelBut = page.querySelectorAll("button")[0];
        let updateBut = page.querySelectorAll("button")[1];


//        button.addEventListener("submit", (event) => {
//            console.log("nEIN");
//            let blog = {};
//            blog[form.titel.id] = form.titel.value;
//            event.preventDefault();
//        });

        cancelBut.addEventListener("click", eventHandler);
        updateBut.addEventListener("click", eventHandler);
        console.log("page");
        console.log(page);
        // let eventHandler = router.handleNavigationEvent.bind(router);
        // a.addEventListener("click", eventHandler);
//        let seg = document.getElementById('first_segment');
//        console.log("Segment");
//        console.log(seg);
//        let field = document.getElementById('editArea');
//        field.innerHTML = seg;
        return page;
    }
};


// helper enthält Methoden, die in mehreren Views benötigt werden.
const helper = {
    // Ersetzt alle %bezeichner Texte in element durch die 
    // gleichnamigen Attributwerte des Objekts. 
    setDataInfo(element, object, dateKind) {
        let cont = element.innerHTML;
        for (let key in object) {
            // prüft ob sich Attributwert innerhalb des Objektattributs befindet.
            if (typeof object[key] == "object") {
                let innerObject = object[key];
                for (let innerKey in innerObject) {
                    let rexp = new RegExp("%" + innerKey, "g");
                    cont = cont.replace(rexp, innerObject[innerKey]);
                }
            } else
            {
                if (key === "published" || key === "updated") {

                    let newDate = formatDate(object[key], dateKind);
                    object[key] = newDate + " Uhr";
                }
                // Der HTML-Content wird durch rexp auf leere (gleichnamige) Attributfelder durchsucht. (für jeden Wert des Objekts)
                // g ist die Option für eine globale Suche. (Kein Stop nach dem ersten Treffer)
                let rexp = new RegExp("%" + key, "g");


                // Einmal gefunden, wird die Konstruktorfunktion für den Austausch mit dem gleichnamigen Datenbankwert verwendet.
                cont = cont.replace(rexp, object[key]);

            }
        }
        element.innerHTML = cont;
    },

    // emptyElement (EditView Teilbaum) wird durch eine angepasste Beschriftung ersetzt.
    makeBlank(emptyElement) {
        let cont = emptyElement.innerHTML;
        emptyElement.innerHTML = cont;
        let title = document.getElementById("createTitle");
        title.innerHTML = "";
        let updateButton = document.getElementsByName("updateBut")[0];
        console.log(updateButton);
        updateButton.innerHTML = "Erstellen";
        let titleCreate = document.getElementById('newTitle');
        titleCreate.innerHTML = "Titel wählen";
        let newContent = document.getElementById('newConent');
        newContent.innerHTML = "Inhalt";
        let newTitle = document.getElementById('titleCreate');
        newTitle.placeholder = "Titel";

        // Reglärer Ausruck sucht die Platzhalter.
        let rexp = new RegExp(/%\w+/, "g");
        cont = cont.replace(rexp, "-");
        emptyElement.innerHTML = cont;
    }

};