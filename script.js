function TicTacToeGame(){
    this.gameContainer = document.querySelector('#game-container')    //cel: dodać właściwość. szukamy w całym dokumencie tego id
    this.xUser = 'x';
    this.oUser = 'o';
    this.currentUser = this.xUser;
    this.win = false;   //na początek deklaracja zeby gra się toczyła
}

TicTacToeGame.prototype.results = [ //deklaracja tablicy składającej się z 8 3-elementowych tablic
    ['a1', 'b1','c1'],
    ['a2', 'b2','c2'],
    ['a3', 'b3','c3'],
    ['a1','a2','a3'],
    ['b1','b2','b3'],
    ['c1','c2','c3'],
    ['a1','b2','c3'],
    ['c1','b2','a3'],
];


TicTacToeGame.prototype.init = function(){ // inicjalizacja gry
    
    const xUser = document.querySelector("#x-user").value; //w dokumencie znajdujemy id x-user i wybieramy jego wartość
    const oUser = document.querySelector("#o-user").value;
    if(xUser != oUser && !this.win){ //warunek logiczny i (oba muszą być spełnione)
    this.xUser = xUser;
    this.oUser = oUser;
    const table = this.createTable();
    this.gameContainer.innerHTML = ''; // czyści zanim nową tabelkę załaduje, żeby nie dodawał wielu tabelek. przycisk jest poza divem więc nie czyści go
    this.gameContainer.appendChild(table); //za każdym razem kiedy dodamy init, stworzona zostanie nowa tabelka i dodana do dokumentu. w tym calu stwórzmy przycisk
    this.currentUser = this.xUser;
    }else if(this.win){
        
        this.win = false;
        this.init();
    }else{
        this.modal = new Modal ("Names should be different!");
    }
}; 



TicTacToeGame.prototype.createTable = function(){  // dla prototypu tworzymy funckję createTable
    const table = document.createElement('table');
    ['1','2','3'].forEach(function(rowId){
        const row = this.createRow(rowId);
        table.appendChild(row);
    }.bind(this));
    return table;
}; 




TicTacToeGame.prototype.createRow = function(rowId){
    const row = document.createElement('tr');
    ['a', 'b','c'].forEach(function(col){
        const cell = this.createCell(col + rowId);
        row.appendChild(cell);
    }.bind(this));
    return row;
};

TicTacToeGame.prototype.createCell = function(id){
    const cell = document.createElement('td');
    cell.className = 'cell';
    cell.id = id;
    cell.dataset.value = ''; // przypisujemy wartość (tu pustą) do komórki
    cell.addEventListener('click', this.cellClickHandler.bind(this));
    return cell;
};

TicTacToeGame.prototype.cellClickHandler = function(event){
    const cell = event.target;
    if(cell.innerHTML !==''|| this.win){return; }
    if(this.currentUser===this.xUser){
        cell.innerHTML = '&times;'; //encja wskazująca na #, specjalny symbol
        cell.dataset.value='x';
        
    }else {
        cell.innerHTML = '&cir;';
        cell.dataset.value='o';
        
    }
    this.win = this.checkResults();
    if(this.win){
        this.modal = new Modal("User "+this.currentUser+' won!', this.init.bind(this));
    }else{
        this.currentUser = this.currentUser===this.xUser ? this.oUser: this.xUser; //przypisanie warunkowe, jeśli bieżacym użytkownikiem jest xUser to zmien na oUser, jak nie to na xUser
    }
};

TicTacToeGame.prototype.checkResults = function(){
    let win = false;
    for(let idx = 0; idx<this.results.length;idx++){
        const resRow = this.results[idx];
        const result = resRow.map(function(id){      //sprytny zabieg mapowania
            const cell = document.querySelector('#'+id);
            return cell.dataset.value;
        }).join(''); //daje połączenie rozdzielone tym co w psich uszach czyli niczym
        if(result === 'xxx' || result === 'ooo'){
            win = true;
            break;
            console.log('We already have a Winner!');
        }
    }
    return win;
};


function Modal(message, closeCallback){
    this.closeCallback = closeCallback;  //przekazujemy argument closecallback i dajemy go dalej;jak nie podamy to nic się nie stanie (dlatego że jest na końcu)
    this.modalEl = document.createElement('div'); //nowy element div ale jest goły i bezużyteczny. z poziomu js dodamy klasę
    this.modalEl.className = 'modal'; //dodajemy do elementu nazwę klasy modal ; mamy nowy element z podpięta klasą. teraz dodajmy mu zawartość
    this.modalEl.innerHTML = '<p>' + message + '</p>'; //do środka divu ma być wrzucona message. dzięki temu że to jest innerhtml a nie innertext, potraktowane będzie to jako kod (string a nie tekst)
    const closeButton = document.createElement('button'); //tworzenie przycisku
    closeButton.innerText = "Close"; //wrzucamy do przycisku etykietę Zamknij
    closeButton.addEventListener('click',   this.close.bind(this)    ); //niech nasłuchuje na (kliknięcie), jak to się stanie to ma wywołać funkcję zamykającą. przekazujemy zakres obiektu(this). This jest do wywołania funkcji w funckji
    this.modalEl.appendChild(closeButton); //dorzuca przycisk (ale jeszcze nie działa)
    document.documentElement.appendChild(this.modalEl); // documentElement odzwierciedla body; do elementu body dodajemy element potomny czyli dziecko
}

//Teraz dodajmy metodę pozwalającą na zamykanie danego okienka. Stosujemy prototypowanie.
Modal.prototype.close = function(){
    this.modalEl.remove(); //usuwa element html z dokumentu. 
    if(this.closeCallback != undefined){ // spr czy zmienna istnieje a jak nie to nic, jak tak to wywołujemy ją
    this.closeCallback();
    }
};

const game = new TicTacToeGame(); //inicjalizacja tylko na chwilę, do wizualizacji

const button = document.querySelector("#start-game");
const xUser = document.querySelector("#x-user");
const oUser = document.querySelector("#o-user");

function checkNames(){
    button.disabled = !(xUser.value !=''&& oUser.value !='');

}




xUser.addEventListener('input', checkNames); //obsługa zdarzenia input czyli zdarzenia kiedy na kontrolce inputu coś zostanie wprowadzone, klawisz zostanie naciśnięty
oUser.addEventListener('input', checkNames);

button.addEventListener("click", function(){ game.init();     //wyszukujemy przycisk, dodajemy mu listenera i akcję
});
// const modal = new Modal(" Let's Play!");


/*
document jest szeroko stosowany do modyfikacji DOM.


Tabelkę robimy za pomocą nowej funkcji TicTacToeGame.
pierwsza funkcja utworzy tabelę
Druga tworzy wiersz
Trzecia tworzy komórkę
potem rekurencyjnie wiele razy f1, f2, f3

Funkcja detekcji wyniku gry
deklaracja tablicy wygranych
sprawdzamy 8 mozliwości bo to mało, tylko 1 pętla szybciutka
*/