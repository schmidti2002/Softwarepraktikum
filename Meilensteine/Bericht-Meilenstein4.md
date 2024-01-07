# Bericht zum 4. Meilenstein (Test Driven Development und Start der Implementierung)
von der Gruppe 2 (mit ASL)

## Allgemeine Informationen zum Meilenstein 4
<p>Das Team hielt im Meilenstein 4 insgesamt 4 Online-Meetings über Discord ab. Deren besprochene Inhalte waren vorallem die Planphase, die Teamaufteilung, die Implementation der Webanwendung und die Implementierung der Tests. Zurückblickend arbeitete das Team jedoch eher in kleinen Guppen unter sich und rief nur Teammeetings aus, wenn es für das gesamte Team nötig war. Die meiste Zeit wurde jedoch zum alleinigen Arbeiten verwendet, was unsere Teamaufteilung ermöglichte. Die dabei durchschnittlich aufgewendete Zeit betrug bei den Teammitgliedern ca. 20 Stunden. In dem Zip-Ordner sind weitere Details zu dieser Thematik in der Datei "arbeitszeiterfassung.pdf" zu finden.</p>


## Wahl der Programmiersprache(n)
### Frontend
<p>Das Frontend-Team sprach sich bereits in dem ersten Meeting des 4. Meilensteins darüber ab, dass HTML für die Strukturierung der Inhalte unserer Webanwendung, TypeScript für die dazugehörige Logik und im späteren Verlauf CSS für die Gestaltung der Webanwendung verwendet werden sollen. Als die Programmierphase jedoch mit dem nächsten Meeting näher rückte, entschied man sich nur JavaScript anstelle von TypeScript zu verwenden. Diese Entscheidung ersparte uns letztendlich Arbeit, als das Frontend-Team an der Schnittstelle zur Kommunikation mit dem Backend arbeitete.</p>

### Kommunikation zwischen Front- und Backend
<p>Für die Kommunikation zwischen Front- und Backend haben wir JSON-Datein genutzt, da damit ein einfacher Austausch an Daten gewährleistet werden kann und die dafür verantwortlichen Teammitglieder darin die meiste Erfahrung und Vertrauen hatten. Außerdem ist JSON ja genau für JavaScript entwickelt worden und daher erste Wahl.

### Backend
<p>Im Backend wurde Python bereits in Meilenstein 1 als zu nutzende Programmiersprache ausgewählt, da darin die meiste Programmiererfahrung bestand und es bereits fertige APIs (z.B. flask) gibt. Das ersparte Programmierzeit, da wir nicht erst eine eigene API erstellen mussten.</p>


## Wahl der Frameworks
Bootstrap, Jest, ESLint, pytest, Flask
### Frontend
<p>Für das Frontend hat sich das Team auf Bootstrap geeinigt. Vorteile, die damit für das Team einhergehen, sind seine Leichtgewichtigkeit und die bereits vorhandene Erfahrung einiger Teammitglieder.</p>
<p>Außerdem ergab sich Jest als Test-Framework für unsere JavaScript-Files. Die leichte Einrichtung, aber vor allem das automatische Mocking zeigte sich als hilfreich. Auch dieses Framework war einem Mitglied des Teams bereits bekannt.</p>
<p>Zum Überprüfen des Codes und dessen Konsistenz sowie mögliche Fehler verwendete das Team ESLint. Dadurch werden nun auch die Clean-Code-Regeln für das Frontend angezeigt und hilft diese einzuhalten.</p>

### Backend
<p>Das Framework pytest soll für das Backend verwendet werden. Es eignet sich besonders, da das Backend bereits in Python geschrieben wurde. Außerderm erfordert der leichte Syntax nicht viel Zeit zum "Lernen", das Test-Framework funktioniert auch mit Flask-Funktionen und die Möglichkeit der Erweiterbarkeit durch Extensions erschien hilfreich für die Zukunft, auch wenn die Nutzung dieser Funktion bis jetzt noch nich nötig ist. Erwähnenswert ist weiterhin, dass Teammitglied bereits ein wenig Erfahrung mit pytest vorweisen kann.</p>
<p>Zuletzt ist da noch, wie bereits erwähnt, das Framework Flask. Vorteile dafür sind Folgende: Leichtgewichtigkeit des Frameworks, leichte Lernbarkeit, Erweiterbarkeit durch Extensions für die Zukunft.</p>
 

## Codekonventionen
<p>Das Team einigte sich bereits zu Beginn des Praktikums mit den ersten Files, dass Dokumentnamen stets groß geschrieben werden. Dies wurde im Verlauf beibehalten.</p>
<p>Variablen- und Funktionsnamen sollen immer auf Englisch und in "camelCase" verfasst werden. Das Team hat sich außerdem vorgenommen, seinen Code verständlich auf Deutsch zu dokumentieren, um ein leichtes Codeverständnis zu ermöglichen. Diese Regeln wurden jedoch erst nahe des Ende des 4. Meilenstein festgehalten (siehe Misslungenes), obwohl man sich bereits zu Beginn des Meilensteins auf diese geeinigt hatte.</p>


## Teamaufteilung
<p>Die Teamaufteilung wurde zu Beginn des Meilenstein 4 ausgemacht. Diese war im Grund bereits implizit bestimmt, da die Aufteilung schon in den vorherigen Meilensteinen besprochen wurde, ohne diese festzulegen.</p>
<p>Die Aufteilung geschah erst einmal in Frontend- und Backend-Team. Die beiden Teams teilten sich dann jeweils untereinander nach ihren Interessen und Wissensständen auf, um ein effizientes, paralleles Arbeiten zu ermöglichen. Im Verlauf des Meilenstein 4 stellte sich heraus, dass sich ein Backend-Mitglied auch um die OpenAPI kümmerte, weshalb es zum Kommunikationsbeauftragten ernannt wurde.</p>


## Kritische Bilanz
### Gelungenes
<p>Das parallele Arbeiten lief im Backend mithilfe des Branching-Guides und der Bildung kleiner Gruppen relativ gut. Die Absprache vermied Probleme, weshalb der Fortschritt bei der Frontend-Programmierung relativ zügig voranschritt.</p>
<p>Während der Feiertage waren einige Teammitglieder noch aktiv, was dem Fortschritt im Projekt zugute kam.</p>

### Misslungenes
<p>Die Arbeitsaufteilung unter den Mitgliedern innerhalb der beiden Gruppen lief schlechter als in den letzten Meilensteinen. Es fehlte an vielen Stellen Hilfe von anderen Teammitgliedern, welche sich trotz der garantierten Erreichbarkeit nicht beteiligten. Weihnachten und Neujahr hatten natürlich größere Auswirkungen auf die Arbeitszeiten in diesen Zeiträumen, jedoch waren leider bei einigen Teammitgliedern auch abseits dieser nur wenig Beiträge zu vermerken.</p>
<p>Eine genaue Clean-Code-Regelung entstand erst nahe des Ende des Meilenstein 4 für das Frontend, was zu einigen Code- und Kommentarüberarbeitungen führte.</p>
<p>Die Kommunikation zwischen den Backend-Teammitgliedern misslung ein wenig, weshalb sich 2 Gruppen bildeten, welche an den selben Stellen arbeiteten. Dies kostete dem Backend-Fortschritt eine Menge Zeit.</p>
<p>Unter anderem sieht das Team die unterschiedlichen Feiertagspläne als ein Problemfaktor, welche zu unterschiedlichen Fortschrittsgeschwindigkeiten innerhalb der Gruppen führt. Dadurch kam die Arbeit in einem Teil des Teams zum Stop, während der ein anderer gerade begann.</p>
<p>Die ungleiche Wissensverteilung innerhalb unseres Entwicklerteams hat zu einigen Missverständnissen und einem verlangsamten Fortschritt geführt.<p>
