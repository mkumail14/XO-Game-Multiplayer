
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getFirestore,collection, addDoc,doc, getDoc ,updateDoc} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDdPmw7EHBU-AwoDQ1szeW7WtHANaF30Q0",
    authDomain: "xo-game-c2506.firebaseapp.com",
    projectId: "xo-game-c2506",
    storageBucket: "xo-game-c2506.appspot.com",
    messagingSenderId: "1003496744924",
    appId: "1:1003496744924:web:34f59f5e9df9d261831119",
    measurementId: "G-701HCZH6H9"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

document.getElementById('gameContainer').style.display='none'
document.getElementById('inputGameId').style.display='none'
document.getElementById('submitGameIdBtn').style.display='none'
document.getElementById('backBtn').style.display='none'
document.getElementById('gamePanel').classList.add('disabled')

localStorage.removeItem('gameID')
localStorage.removeItem('icon')


  async function createGame(){
    let turn;
    let tempValue=Math.random()*100;
    if(tempValue%2==0){
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
    winner:null
  });
  console.log("Document written with ID: ", docRef.id);
  localStorage.setItem('gameID',docRef.id)
  localStorage.setItem('icon',"X")
  document.getElementById('gameContainer').style.display='flex'
  document.getElementById('btnContainer').style.display='none'
  }

  async function loadData(){
    const docRef = doc(db, "currentGame", localStorage.getItem('gameID'));
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

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
        document.getElementById('gamePanel').classList.remove('disabled')
      }else{
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
        if(localStorage.getItem('gameID')){
        loadData()}
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
  window.createGame=createGame;
  window.choose=choose;
  window.joinGame=joinGame;
  window.submitGameId=submitGameId;
  window.backBtn=backBtn