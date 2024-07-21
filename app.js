
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getFirestore,collection, addDoc,doc, getDoc ,updateDoc ,deleteDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

  const firebaseConfig1 = {
    apiKey: "AIzaSyDdPmw7EHBU-AwoDQ1szeW7WtHANaF30Q0",
    authDomain: "xo-game-c2506.firebaseapp.com",
    projectId: "xo-game-c2506",
    storageBucket: "xo-game-c2506.appspot.com",
    messagingSenderId: "1003496744924",
    appId: "1:1003496744924:web:34f59f5e9df9d261831119",
    measurementId: "G-701HCZH6H9"
  };

  const app1 = initializeApp(firebaseConfig1,"app1");
  const db = getFirestore(app1);
document.getElementById('gameContainer').style.display='none'
document.getElementById('inputGameId').style.display='none'
document.getElementById('submitGameIdBtn').style.display='none'
document.getElementById('backBtn').style.display='none'
document.getElementById('replayBtn').style.display='none'
document.getElementById('homeBtn').style.display='none'
document.getElementById('ScoreBoard').style.display='none'
document.getElementById('gamePanel').classList.add('disabled')
localStorage.removeItem('gameID')
localStorage.removeItem('icon')
let Stop=false;
  async function createGame(){
    let turn;
    let tempValue=Math.random()*100;
    if(tempValue>50){
    turn="X"
    }else{
    turn="O"
    }
const docRef = await addDoc(collection(db, "currentGame"), {
    cell0:null,
    cell1:null,
    cell2:null,
    cell3:null,
    cell4:null,
    cell5:null,
    cell6:null,
    cell7:null,
    cell8:null,
    status:"Disconnected",
    turn:`${turn}`,
    winner:null,
    replay:false
  });
  navigator.clipboard.writeText(docRef.id);
  localStorage.setItem('gameID',docRef.id)
  localStorage.setItem('icon',"X")
  document.getElementById('gameContainer').style.display='flex'
  document.getElementById('btnContainer').style.display='none'
  await Swal.fire({
    title: "Game Created!",
    text: "Game code has been copied to your clipboard",
    icon: "success"
  });

  }

  async function loadData(){
    const docRef = doc(db, "currentGame", localStorage.getItem('gameID'));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data())
      if(isTableFull()){
        Stop=true;
        await Swal.fire({
          title: "Oops!",
          text: "Match Draw!",
          icon: "warning"
        });
        if(localStorage.getItem('icon')=='O'){
          document.getElementById('replayBtn').classList.add('disabled')
        }
          document.getElementById('replayBtn').style.display='inline'
          document.getElementById('homeBtn').style.display='inline'
      }else if(docSnap.data().winner==null){
        checkWin()
      }else{
        Stop=true;
        if(docSnap.data().winner==localStorage.getItem('icon')){
        await Swal.fire({
            title: "Congratulation!",
            text: "You Won!",
            icon: "success"
          });
        }else{
           await Swal.fire({
                title: "You Lost!",
                text: "Better Luck Next Time...",
                icon: "error"
              });
        }
        if(localStorage.getItem('icon')=='O'){
            document.getElementById('replayBtn').classList.add('disabled')
          }
          document.getElementById('replayBtn').style.display='inline'
          document.getElementById('homeBtn').style.display='inline'
      }

      if(docSnap.data().status=='connected'){
    document.getElementById('status').innerText="Connected"
    document.getElementById('status').style.color='green'
      }else if(docSnap.data().status=='Disconnected'){
        document.getElementById('status').innerText="Disconnected"
        document.getElementById('status').style.color='red'
      }
      if(docSnap.data().cell0!=null){
        document.getElementById('0').innerText=docSnap.data().cell0;
        document.getElementById('0').classList.add('disabled');

      }
      if(docSnap.data().cell1!=null){
        document.getElementById('1').innerText=docSnap.data().cell1;
        document.getElementById('1').classList.add('disabled');

      }
      if(docSnap.data().cell2!=null){
        document.getElementById('2').innerText=docSnap.data().cell2;
        document.getElementById('2').classList.add('disabled');

      }
      if(docSnap.data().cell3!=null){
        document.getElementById('3').innerText=docSnap.data().cell3;
        document.getElementById('3').classList.add('disabled');

      }
      if(docSnap.data().cell4!=null){
        document.getElementById('4').innerText=docSnap.data().cell4;
        document.getElementById('4').classList.add('disabled');

      }
      if(docSnap.data().cell5!=null){
        document.getElementById('5').innerText=docSnap.data().cell5;
        document.getElementById('5').classList.add('disabled');
      }
      if(docSnap.data().cell6!=null){
        document.getElementById('6').innerText=docSnap.data().cell6;
        document.getElementById('6').classList.add('disabled');

      }
      if(docSnap.data().cell7!=null){
        document.getElementById('7').innerText=docSnap.data().cell7;
        document.getElementById('7').classList.add('disabled');

      }
      if(docSnap.data().cell8!=null){
        document.getElementById('8').innerText=docSnap.data().cell8;
        document.getElementById('8').classList.add('disabled');
      }
      if(docSnap.data().status=="connected" && docSnap.data().turn==localStorage.getItem('icon') ){
        document.getElementById('turn').innerText="Your";
        document.getElementById('turn').style.color='green'
        document.getElementById('gamePanel').classList.remove('disabled')
      }else{
        document.getElementById('turn').innerText="Opponent";
        document.getElementById('turn').style.color='red'
        document.getElementById('gamePanel').classList.add('disabled')
      }
      
    } else {
        Swal.fire({
            title: "No Game Found!",
            text: "Recheck your game ID",
            icon: "error"
          });
    }
  }
 
    setInterval(function () {
        if(localStorage.getItem('gameID') && Stop==false){
        loadData()}
        checkReplay();
      }, 1000);
 
 async function choose(cellId){
    const temp = doc(db, "currentGame", localStorage.getItem('gameID'));
    let tempIcon;
if(localStorage.getItem('icon')=="X"){
    tempIcon="O";
}else if(localStorage.getItem('icon')=="O"){
    tempIcon="X"
}
   await updateDoc(temp, {
      [`cell${cellId}`]: localStorage.getItem('icon'),
      turn:tempIcon
    });
}


function joinGame(){
    document.getElementById('joinGameBtn').style.display='none'
    document.getElementById('createGameBtn').style.display='none'
    document.getElementById('inputGameId').style.display='block'
    document.getElementById('submitGameIdBtn').style.display='block'
    document.getElementById('backBtn').style.display='block'



}


async function submitGameId(){
let gameId;
    gameId=document.getElementById('inputGameId').value
    const docRef = doc(db, "currentGame", gameId);
    const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  localStorage.setItem('gameID',gameId)
  localStorage.setItem('icon',"O")
  document.getElementById('gameContainer').style.display='flex'
  document.getElementById('btnContainer').style.display='none'
  await updateDoc(docRef, {
   status: "connected"
  });

} else {
    Swal.fire({
        title: "No Game Found!",
        text: "Recheck your game ID",
        icon: "error"
      });
      document.getElementById('inputGameId').value=''

}
}

function backBtn(){
    document.getElementById('joinGameBtn').style.display='block'
    document.getElementById('createGameBtn').style.display='block'
    document.getElementById('inputGameId').style.display='none'
    document.getElementById('submitGameIdBtn').style.display='none'
    document.getElementById('backBtn').style.display='none'
}


async function checkWin(){
    const docRef = doc(db, "currentGame", localStorage.getItem('gameID'));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if(docSnap.data().cell0!=null && docSnap.data().cell0==docSnap.data().cell1 && docSnap.data().cell1==docSnap.data().cell2){
        setWinner(docSnap.data().cell0)
      }else if(docSnap.data().cell3!=null && docSnap.data().cell3==docSnap.data().cell4 && docSnap.data().cell4==docSnap.data().cell5){
        setWinner(docSnap.data().cell3)
      }else if(docSnap.data().cell6!=null && docSnap.data().cell6==docSnap.data().cell7 && docSnap.data().cell7==docSnap.data().cell8){
        setWinner(docSnap.data().cell6)
      }else if(docSnap.data().cell0!=null && docSnap.data().cell0==docSnap.data().cell3 && docSnap.data().cell3==docSnap.data().cell6){
        setWinner(docSnap.data().cell0)
      }else if(docSnap.data().cell2!=null && docSnap.data().cell2==docSnap.data().cell5 && docSnap.data().cell5==docSnap.data().cell8){
        setWinner(docSnap.data().cell2)
      }else if(docSnap.data().cell0!=null && docSnap.data().cell0==docSnap.data().cell4 && docSnap.data().cell4==docSnap.data().cell8){
        setWinner(docSnap.data().cell0)
      }else if(docSnap.data().cell2!=null && docSnap.data().cell2==docSnap.data().cell4 && docSnap.data().cell4==docSnap.data().cell6){
        setWinner(docSnap.data().cell2)
      }else if(docSnap.data().cell1!=null && docSnap.data().cell1==docSnap.data().cell4 && docSnap.data().cell4==docSnap.data().cell7){
        setWinner(docSnap.data().cell1)
      }

    }
}

async function gotoHome(){
  if(localStorage.getItem('icon')=="X"){
    await deleteDoc(doc(db, "currentGame", localStorage.getItem('gameID')));
  }
    localStorage.clear;
    window.location.href="index.html"
}

async function replay(){
    Stop=false;
    for(let i=0;i<9;i++){
      document.getElementById(`${i}`).innerText=''
      document.getElementById(`${i}`).classList.remove('disabled')
    }
    if(localStorage.getItem('icon')=="X"){
        const temp = doc(db, "currentGame", localStorage.getItem('gameID'));
        let turn;
        let tempValue=Math.random()*100;
        if(tempValue>50){
        turn="X"
        }else{
        turn="O"
        }
        await updateDoc(temp, {
            cell0:null,
            cell1:null,
            cell2:null,
            cell3:null,
            cell4:null,
            cell5:null,
            cell6:null,
            cell7:null,
            cell8:null,
            status:"Disconnected",
            turn:`${turn}`,
            winner:null,
            replay:true
          });
          document.getElementById('homeBtn').style.display='none'
        document.getElementById('replayBtn').style.display='none'
     
    }else if(localStorage.getItem('icon')=="O"){
            const temp = doc(db, "currentGame", localStorage.getItem('gameID'));
        await updateDoc(temp, {
            status:"connected",
            replay:false
          });
        document.getElementById('homeBtn').style.display='none'
        document.getElementById('replayBtn').style.display='none'
    }
 
}

async function setWinner(winner){
    const temp = doc(db, "currentGame", localStorage.getItem('gameID'));
    await updateDoc(temp, {
        winner:winner
      });
      let score=0;
      let email=localStorage.getItem("email").split('')
      let username=[];
      console.log(email)
      for(let i=0;i<100;i++){
        if(email[i]=='@'){
          i=101;
        }else{
      username.push(email[i])
        }
      }
      username=username.join('')
      const docRef = doc(db, "scoreboard","scoreboard" );
      const docSnap = await getDoc(docRef);
      score=docSnap.data()[username]
      console.log(username)
      console.log(score)
      score+=5
      
      const temp1 = doc(db, "scoreboard","scoreboard");
      await updateDoc(temp1, {
        abc:score
      });
}


async function checkReplay(){
    if(localStorage.getItem('gameID')){
    const docRef = doc(db, "currentGame", localStorage.getItem('gameID'));
    const docSnap = await getDoc(docRef);
    if(localStorage.getItem('icon')=="O" && docSnap.data().replay==true){
        document.getElementById('replayBtn').classList.remove('disabled')
    }
}
    
}

function isTableFull(){
  for(let i=0;i<9;i++){
    if(document.getElementById(`${i}`).innerText==''){
      return false;
      break
    }
  }
  return true;
}


function openScoreBoard(){
document.getElementById('main').style.display='none'
document.getElementById('ScoreBoard').style.display='flex'
loadStockBoard()
}

async function loadStockBoard() {
  const docRef = doc(db, "scoreboard", "scoreboard");
  const docSnap = await getDoc(docRef);
  document.getElementById('scoreboard-table').innerHTML = '';

  if (docSnap.exists()) {
    const data = docSnap.data();
    const entries = Object.entries(data); // Convert to array of [name, score] pairs

    // Sort the array based on the scores in descending order
    entries.sort((a, b) => b[1] - a[1]);

    // Create the header
    let header = `
      <tr>
        <td>Position</td>
        <td>Name</td>
        <td>Score</td>
      </tr>`;
    document.getElementById('scoreboard-table').innerHTML += header;

    // Create rows from the sorted array
    for (let i = 0; i < entries.length; i++) {
      const [name, score] = entries[i];
      document.getElementById('scoreboard-table').innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${name}</td>
          <td>${score}</td>
        </tr>`;
    }
  } else {
    console.log("No such document!");
  }
}

  window.createGame=createGame;
  window.choose=choose;
  window.joinGame=joinGame;
  window.submitGameId=submitGameId;
  window.backBtn=backBtn;
  window.gotoHome=gotoHome;
  window.replay=replay;
  window.openScoreBoard=openScoreBoard;


