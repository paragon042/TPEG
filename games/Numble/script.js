function addNumber(value){
  if(guess.length>=5 || gameover)return;
    guess += value;
  setRow();
}

function removeNumber(){
  if(guess.length<=0 || gameover)return;
  guess = guess.substring(0, guess.length - 1);
  setRow();
}

function submitNumber(){
  if(row>5 || gameover)return;
  if(guess.length<4)return;
  let correctCount = 0;
  const tableRow = document.getElementById(`row${row}`);
    for(let k=0; k<=4; k++){
      let minimapAdditon = "&#x2B1B;";//add blank;
      if(answer.indexOf(guess.charAt(k))!=-1){
        let before = "";
        if(k>0)before = answer.slice(0, k);
        let after = "";
        if(k<answer.length){
          after = answer.slice(k+1, answer.length);
        }
        
        minimapAdditon = "&#x1F7E8;";//add yellow
        switch(true){
          case (before.indexOf(guess.charAt(k))!=-1 && after.indexOf(guess.charAt(k))!=-1 && before.length>0 && after.length>0):
            tableRow.children[k].classList.add("both");
          break;
          case (before.indexOf(guess.charAt(k))!=-1 && before.length>0):
            tableRow.children[k].classList.add("left");
          break;
          case (after.indexOf(guess.charAt(k))!=-1 && after.length>0):
            tableRow.children[k].classList.add("right");
          break;
          default:
            minimapAdditon = "&#x2B1B;";//add blank;
        }
      }
      if(guess.charAt(k)==answer.charAt(k)){
        tableRow.children[k].classList.add("green");
        minimapAdditon = "&#x1F7E9;";//add green
        correctCount++;
      }
      minimap += minimapAdditon;
    }
  minimap += "<br>";
  row++;
  if(correctCount>=5)winner();//you win!
  guess="";
}

function setRow(){
  if(row>5)return;
  const tableRow = document.getElementById(`row${row}`);
    for(let k=0; k<=4; k++){
      tableRow.children[k].innerHTML = "<p></p>";
      if(k<guess.length)tableRow.children[k].innerHTML = `<p>${guess.charAt(k)}</p>`;
    }
}

function populateNumble(){
  gameover = false;
  let table = document.getElementById("numbers");
  let numpad = document.getElementById("numpad");
  table.innerHTML="";
  numpad.innerHTML="";
  minimap="";
  
  answer = Math.round(Math.random()*89999)+10000;
  answer = answer.toString();
  guess = "";
  row=0;
  for(let k=0; k<=5; k++){
    table.innerHTML += `<tr id="row${k}">
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        </tr>`;
 
  };


  for(let k=0; k<=9; k++){
    numpad.innerHTML += `<button onclick="addNumber(${k})"><p>${k}</p></button>`;
  }
  numpad.innerHTML += `<br/><button onclick="removeNumber()"><p class="material-icons">backspace</p></button>`;
  numpad.innerHTML += `<button onclick="submitNumber()"><p class="material-icons">keyboard_return</p></button>`;
  
}

function winner(){
  gameover = true;
  console.log(minimap);
  document.getElementById("sharedata").innerHTML = `Numble #${answer} ${row}/6<br><br>${minimap}`;
  togglePanel("winner", "block");
}


function togglePanel(element, display){
  document.getElementById(element).style.display = display;
  if(display=="block")display="flex";
  document.getElementById(element).parentElement.style.display = display;
}

function toggleHardmode(){
  hardmode=!hardmode;
  if(hardmode){
    buttonText = "warning";
    document.getElementById("wrapper").classList.add("hardmode");
    document.getElementById("hardmodebutton").setAttribute("alt", "Hard mode is on!");
    document.getElementById("hardmodebutton").setAttribute("title", "Hard mode is on!");
    gsap.to("#hardmodenotification", 0, {display:"block", scale:0.5, opacity:1});
    gsap.to("#messages", 0.5, {display:"flex"});
    gsap.to("#hardmodenotification", 0.5, {display:"none", scale:1.5, opacity:0});
    gsap.to("#messages", 0.5, {display:"none"});
    document.getElementById("hardmodenotification").innerHTML = "Hardmode ON!";
    
  // if(display=="block")display="flex";
  // document.getElementById(element).parentElement.style.display = display;
  }else{
    buttonText = "sentiment_satisfied_alt";
    document.getElementById("wrapper").classList.remove("hardmode");
    document.getElementById("hardmodebutton").setAttribute("alt", "Hard mode is off");
    document.getElementById("hardmodebutton").setAttribute("title", "Hard mode is off");
    document.getElementById("hardmodenotification").innerHTML = "Hardmode OFF!";
    gsap.to("#hardmodenotification", 0, {display:"block", scale:0.5, opacity:1});
    gsap.to("#messages", 0.5, {display:"flex"});
    gsap.to("#hardmodenotification", 0.5, {display:"none", scale:1.5, opacity:0});
    gsap.to("#messages", 0.5, {display:"none"});
  }

  document.getElementById("hardmodebutton").firstChild.innerHTML = buttonText;
}

let row = 0;
let answer;
let guess = "";
let minimap = "";
let gameover = false;
let hardmode = false;


document.getElementById("sharebutton").addEventListener("click", async () => {
  try {
    const regex = /(<br>)+/g;
    let shareText = document.getElementById("sharedata").innerHTML.replace(regex, "\n");
    // shareText = `Numble #${answer} ${row}/6\n\n${shareText}`
    navigator.clipboard.writeText(shareText).then(()=>{alert("Copied to clipboard!")});
    //await navigator.share({ title: "Numble", text: shareText });
    console.log("Data was shared successfully");
  } catch (err) {
    console.error("Share failed:", err.message);
  }
});

populateNumble();