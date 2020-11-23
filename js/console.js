window.onload = function(){

    // EVENTHANDLER:
    document.getElementById('consoleframe').addEventListener('click', setFocus);	// Focus bei Klick auf Fenster immer auf Befehlseingabefeld
    var cmd = document.getElementById('cmd');
    cmd.addEventListener('keydown', keyhandler);                     // Eventhandler für Tastendruck
    cmd.addEventListener('input', setinput);                         // Eventhandler für Änderung im Eingabefeld (vollständig, da auswertung nach Keyup)


    // GLOBALE VARIABLEN:
    var commands = ["help", "about", "profile", "projects", "websites", "exit", "quit", "clear", "cls"];   // Liste möglicher Kommandos (muss mit entsprechenden node-IDs korrespondieren)
    commands.sort();
    var linkelemente = document.getElementsByClassName("links");    // Array aller Links auf der Seite
    var linknamen = [];                                                       // Array der Link-Texte
    for (let i=0; i<linkelemente.length; i++){
        linknamen[i] = linkelemente[i].text.slice(1, linkelemente[i].text.length-1);
    }
    var cmdin = document.getElementById("cmdin");
    var prompts = ["$ ", "> ", "% ", ": ", "- ", "# "];                 // $: standard, #: root
    var autofill = 0;
    var input = "";
    var tab = 0;
    var lastkey;

    // FUNKTIONEN:

    // komplette Eingabe verfügbar machen
    function setinput(e){
        input = e.target.value;
    }

    // Tastatureingabe auswerten
    function keyhandler(e){
        console.log(e.keyCode);
        //var cmdinval = input;//document.getElementById("cmdin").value;  // Kopie von Eingabefeld-Inhalt erstellen (bei e fehlt das letzte Zeichen)
        lastkey = e.keyCode;
        if (e.keyCode == 8){
            //e.preventDefault();
            console.log("BACKDEL");
            if (autofill > 0){
                document.getElementById("cmdin").value = input.slice(autofill, cmdinval.length);
                autofill = 0;
            }
        } else if (e.keyCode == 9){
            e.preventDefault();
            console.log("TAB");
            if (input.length > 0) {
                if (lastkey == 16) tab--;   // 16 = SHIFT
                else tab++;
                autocomplete(tab);    // Autocomplete mit tab (ohne markierung)
            }
        } else if (e.keyCode == 13){
            e.preventDefault();
            console.log("ENTER");
            readCmd();
        } else {
            if (input.length > 2) {
                autocomplete(0);    // Autocomplete bei Eingabe von mehr als 2 Buchstaben (mit Markierung)
            }
        }
    }

    // Automatische Befehlsvervollständigung
    function autocomplete(){
        //var cmdin = document.getElementById("cmdin");           // HTML-Object des Eingabefeldes
        //var cmdinval = input;//document.getElementById("cmdin").value;  // Eingabefeld-Inhalt
        var inputlow = input.toLowerCase();                        // Eingabefeld-Inhalt in Kleinbuchstaben
        var inputlen = input.length;                                  // Textlänge des Eingabefeld-Inhalts
        console.log("Autocomplete von " + inputlow);
        for(let i=0; i<commands.length; i++) {                           // prüfe ob Text in Eingabefeld mit Anfang eines Befehls übereinstimmt
            if (commands[i].startsWith(inputlow)) {
                console.log(commands[i] + "-Befehl gefunden");
                document.getElementById("cmdin").value = input + commands[i].slice(inputlen,commands[i].length); // ergänze den Befehl
                cmdin.setSelectionRange(inputlen, commands[i].length, "backward");      // markiere die Ergänzung
                autofill = commands[i].length - inputlen;
            }
        }
    }

    // Focus auf das Eingabefeld setzen
    function setFocus() {
        document.getElementById("cmdin").focus();
    }

    // Befehl auf der Konsole "ausführen"
    function append(ID) {
        let newOrder = document.getElementById(ID).cloneNode(true);
        newOrder.style.display="block";
        newOrder.className="prompted";
        let newElement = document.createElement("div");
        newElement.append(newOrder);
        document.getElementById("console").appendChild(newElement);
        cmd.scrollIntoView(false);
    }

    // Befehl nach Eingabe in die Konsole schreiben
    function appendCMD(cmd){
        let newOrder = document.getElementById("promptmessage").cloneNode(true);
        newOrder.style.display="block";
        newOrder.className="prompted";
        let newElement = document.createElement("div");
        newElement.append(newOrder);
        newElement.innerHTML += "$ ";
        newElement.innerHTML += cmd;
        document.getElementById("console").appendChild(newElement);
    }

    // die Konsole leeren
    function clear(){
        var con = document.getElementById("console");
        var toDelete = con.childNodes;
        for(var i=toDelete.length-1; i>=0; i--){
            toDelete[i].remove();
            console.log(toDelete[i]);
        }
        console.log("ausgabe gelöscht");
    }

    // Eingabebefehl auswerten
    function readCmd() {
        command = input.toLowerCase();
        console.log(command);
        appendCMD(command);
        if (linknamen.includes(command)) {
            console.log(command + "-Seite wird geöffnet");
            var linkindex = linknamen.indexOf(command);
            console.log(linkindex);
            window.open(linkelemente[linkindex].href);
        } else {
            if (commands.includes(command)) {
                console.log("befehl vorhanden");
                if (command == "clear" || command == "cls") {
                    clear();
                } else if (command == "exit" || command == "quit") {
                    clear();
                    appendCMD(command);
                    append(command);
                    cmd.remove();
                } else {
                    append(command);
                }

            } else {
                console.log("befehl nicht vorhanden");
                append("error");
            }
        }
        cmd.reset();
        tab = 0;
    }

    // Begrüßungsbotschaft beim laden in die Konsole schreiben:
    append("welcome");
    setFocus(); // funktioniert nicht... :-(
}