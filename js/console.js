window.onload = function(){

    // EVENTHANDLER:
    document.getElementById('consoleframe').addEventListener('click', setFocus);	// Focus bei Klick auf Fenster immer auf Befehlseingabefeld
    var cmdin = document.getElementById("cmdin");                // Eingabefeld-Objekt
    var cmd = document.getElementById('cmd');                    // Eingabeformular-Objekt
    cmd.addEventListener('keydown', keyhandler);                     // Eventhandler für Tastendruck
    cmd.addEventListener('keyup', shifthandler);                     // Eventhandler für das loslassen einer Taste (für den Fall dass SHIFT involviert ist)
    cmd.addEventListener('input', setinput);                         // Eventhandler für Änderung im Eingabefeld (vollständig, da auswertung nach Keyup)


    // GLOBALE VARIABLEN:
    var commands = ["help", "about", "profile", "projects", "websites", "exit", "quit", "clear", "cls"];   // Liste möglicher Kommandos (muss mit entsprechenden node-IDs korrespondieren)
    commands.sort();
    var prompts = ["$ ", "> ", "% ", ": ", "- ", "# "];                        // $: standard, #: root
    var linkelemente = document.getElementsByClassName("links");    // Array aller Links auf der Seite
    var linknamen = [];                                                        // Array der Link-Texte
    for (let i=0; i<linkelemente.length; i++) linknamen[i] = linkelemente[i].text.slice(1, linkelemente[i].text.length-1);
    var allcommands = commands.concat(linknamen);                              // Liste aller möglichen Eingabebefehle
    var lastcommands = [];  // Liste zuletzt eingegebener Kommandos
    var commandhistorypos = 0; // Stelle in der Befehlseingabenhistorie (mit Pfeil-rauf/-runter)
    var shift = false;      // SHIFT gedrückt?
    var autofillen = 0;     // Anzahl der Zeichen die ergänzt wurden
    var tab = 0;            // Anzahl der Tabulator-drücke
    var input = "";         // vollständige aktuelle Eingabe
    //var command = "";       // vollständiges Kommando

    // FUNKTIONEN:

    // komplette Eingabe verfügbar machen
    function setinput(e){
        input = e.target.value;
    }

    // Tastatureingabe auswerten
    function keyhandler(key) {
        //console.log(key.keyCode);
        switch (key.keyCode) {

            case 16:
                console.log("SHIFT...");
                shift = true;
                break;

            case 27:
                console.log("ESC");
                cmd.reset();
                break;

            case 8:
                //e.preventDefault();
                console.log("BACKDEL");
                if (autofillen > 0) {
                    document.getElementById("cmdin").value = input.slice(autofillen-1, input.length);
                    autofillen = 0;
                }
                break;

            case 9:
                key.preventDefault();
                console.log("TAB");
                if (input.length > 0) {
                    if (shift) tab--;
                    else tab++;
                    autocomplete(false);    // Autocomplete mit tab (ohne markierung)
                }
                break;

            case 38:
                key.preventDefault();
                console.log("ARROW UP");
                if (lastcommands.length > 0){
                    console.log(lastcommands.toString());
                    document.getElementById("cmdin").value = lastcommands[commandhistorypos];
                }
                commandhistorypos++;
                break;

            case 40:
                key.preventDefault();
                console.log("ARROW DOWN");
                if (commandhistorypos > 0){
                    document.getElementById("cmdin").value = lastcommands[commandhistorypos];
                    commandhistorypos--;
                }
                break;

            case 13:
                key.preventDefault();
                console.log("ENTER");
                readCmd();
                break;

            default:
                if (input.length > 2) {
                    autocomplete(true);    // Autocomplete bei Eingabe von mehr als 2 Buchstaben (mit Markierung)
                }
        }
    }

    function shifthandler(key){
        if(key.keyCode == 16){
            shift = false;
            console.log("SHIFT losgelassen");
        }
    }

    // Automatische Befehlsvervollständigung
    function autocomplete(markierung){
        //var cmdin = document.getElementById("cmdin");           // HTML-Object des Eingabefeldes
        //var cmdinval = input;//document.getElementById("cmdin").value;  // Eingabefeld-Inhalt
        var inputlow = input.toLowerCase();                        // Eingabefeld-Inhalt in Kleinbuchstaben
        var inputlen = input.length;                                  // Textlänge des Eingabefeld-Inhalts
        console.log("Autocomplete von " + inputlow);
        for(let i=0; i<allcommands.length; i++) {                           // prüfe ob Text in Eingabefeld mit Anfang eines Befehls übereinstimmt
            if (allcommands[i].startsWith(inputlow)) {
                console.log(allcommands[i] + "-Befehl gefunden");
                document.getElementById("cmdin").value = input + allcommands[i].slice(inputlen,allcommands[i].length); // ergänze den Befehl
                if (markierung) cmdin.setSelectionRange(inputlen, allcommands[i].length, "backward");                                            // markiere die Ergänzung
                autofillen = allcommands[i].length - inputlen;
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
        input = "";
        console.log(command);
        appendCMD(command);
        commandhistorypos = 0;
        if (linknamen.includes(command)) {                  // Links auswerten
            console.log(command + "-Seite wird geöffnet");
            lastcommands.push(command);
            var linkindex = linknamen.indexOf(command);
            console.log(linkindex);
            window.open(linkelemente[linkindex].href);
        } else {
            if (commands.includes(command)) {               // Befehle auswerten
                console.log("befehl vorhanden");
                lastcommands.push(command);
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