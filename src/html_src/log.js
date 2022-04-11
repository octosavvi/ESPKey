(function(){
var debug;
var xmlhttp = new XMLHttpRequest();
var myTable = document.getElementById("myTable").tBodies[0];
var get_division_position_for_bit_length = {26:9, 33:8, 34:17, 35:14, 37:16};

// Get the modal
var modal = document.getElementById('myModal');
modal.header = document.getElementsByClassName("modal-header")[0].childNodes[3];
modal.body = document.getElementsByClassName("modal-body")[0];
modal.button = document.getElementsByClassName("modal-footer")[0].childNodes[1];
modal.span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
modal.span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    if (xmlhttp.responseURL.endsWith('log.txt')) {
      var myArr = xmlhttp.responseText;
      displayLog(xmlhttp.getResponseHeader("Now"), myArr);
      //setTimeout(function(){ sendCommand("/log.txt"); }, 5000);

    } else {
      //sendCommand("/log.txt");
      modal.button.textContent = "Send again";
      modal.button.disabled = false;
      var temp_alert = document.createElement("span");
      temp_alert.innerHTML = "Sent!";
      setTimeout(function(){
	temp_alert.parentNode.removeChild(temp_alert);
      }, 2000);
      modal.button.parentNode.appendChild(temp_alert);
    }
  }
};

function sendCommand(url) {
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

sendCommand("/log.txt");

function appendRow() {
  return myTable.insertRow(myTable.rows.length);
}

function appendCell(row, value) {
  cell = row.insertCell(row.cells.length);
  cell.innerHTML = value;
  return cell;
}

function hex2bin(hex) {
  var bin = "";
  for(var i=0; i< hex.length; i+=1){
    var h = parseInt(hex.substr(i, 1), 16).toString(2);
    bin += "0".repeat(4 - h.length) + h;
  }
  return bin;
}

function bin2hex(bin) {
  var hex = "";
  bin = "0".repeat((4 - (bin.length % 4)) & 3) + bin;
  var a = bin.match(/.{1,4}/g);
  for (var i=0; i<a.length; i++) {
    hex += parseInt(a[i], 2).toString(16);
  }
  return hex;
}

function Card(ts, text) {
  this.ts = ts;
  this.text = text;
  this.parseClass = "good";
  var s = text.split(":");
  this.length = parseInt(s[1]);
  this.hex = s[0];
  this.bin = hex2bin(this.hex);
  if(this.bin.length>this.length) this.bin = this.bin.substr(this.bin.length - this.length);
  this.bin = "0".repeat(this.length - this.bin.length) + this.bin;
  this.bits = this.bin.split('').map(function(x){return parseInt(x)});
  if(this.length != this.bits.length) this.parseClass = "bad";
  var paritySize = Math.round(this.length / 2);
  var sum = 0;
  this.bits.slice(0, paritySize).map(function(x){sum+=x});
  this.evenParity = (sum % 2) == 0;
  if(!this.evenParity) this.parseClass = "bad";
  sum = 0;
  this.bits.slice(this.length - paritySize).map(function(x){sum+=x});
  this.oddParity = (sum % 2) == 1;
  if(!this.oddParity) this.parseClass = "bad";
  var known = get_division_position_for_bit_length[this.length];
  if(known) {
    this.division_position = known;
    // The following parseInt calls could overflow
    this.facility = parseInt(this.bits.slice(1, known).join(''), 2);
    this.user = parseInt(this.bits.slice(known, -1).join(''), 2);
  }
}

function fix_parity(bin) {
  var bits = bin.split('').map(function(x){return parseInt(x)});
  var paritySize = Math.round(bin.length / 2);
  var sum = 0;
  bits.slice(0, paritySize).map(function(x){sum+=x});
  var evenParity = (sum % 2) == 0;
  if(!evenParity) bits[0] ^= 1;
  sum = 0;
  bits.slice(bin.length - paritySize).map(function(x){sum+=x});
  var oddParity = (sum % 2) == 1;
  if(!oddParity) bits[bits.length-1] ^= 1;
  return bits.join('');
}

function bin_to_text(bin) {
  return bin2hex(bin)+":"+bin.length;
}

function fix_bin_to_text(bin) {
  return bin_to_text(fix_parity(bin));
}

function ful_to_text(facility, user, length) {
  var dp = get_division_position_for_bit_length[length];
  var bin = user.toString(2) + "0";
  bin = facility.toString(2) + "0".repeat(length - dp - bin.length) + bin;
  bin = "0".repeat(length - bin.length) + bin;
  return fix_bin_to_text(bin);
}

function update_card(o) {
  debug = o;
  var nv;
  if(o.title == "raw") nv = o.value;
  else if(o.title == "facility")
    nv = ful_to_text(parseInt(o.value), modal.card.user, modal.card.length);
  else if(o.title == "user")
    nv = ful_to_text(modal.card.facility, parseInt(o.value), modal.card.length);
  else if(o.title == "length")
    nv = modal.card.hex + ":" + o.value.trim();
  else if(o.title == "bits") {
    if (o.nextSibling)
      nv = fix_bin_to_text("0" + o.value.replace(/ /g, "") + "0");
    else
      nv = bin_to_text(o.value.replace(/ /g, ""));
  }
  else if(o.title == "evenParity")
    nv = bin_to_text(o.value.trim() + modal.card.bits.slice(1).join(""));
  else if(o.title == "oddParity")
    nv = bin_to_text(modal.card.bits.slice(0, -1).join("") + o.value.trim());
  else return alert("Unable to parse input");
  fill_modal(new Card(0, nv), "Editor");
  modal.button.textContent = "Send";
}

function change_card(o) {
  var n = document.createElement("INPUT");
  n.title = o.title;
  o.parentNode.replaceChild(n, o);
  n.value = o.innerText;
  n.onchange = function(){update_card(n)};
  n.select();
}

function append_text(content) {
  modal.body.appendChild(document.createTextNode(content));
}

function append_editable(type, title, content) {
  var o = document.createElement(type);
  //o.contentEditable = "true";
  o.title = title;
  var c = o.appendChild(document.createTextNode(content));
  o.onclick = function(){change_card(o)};
  modal.body.appendChild(o);
  return o;
}

function append_br() {
  modal.body.appendChild(document.createElement("BR"));
}

function info(o) {
  //debug = o;
  modal.button.textContent = "Replay";
  var title = "Info";
  if(o.childNodes[0].innerHTML != "?") title = o.childNodes[0].innerHTML;
  fill_modal(o.card, title);
}

function fill_modal(c, title) {
  modal.header.innerHTML = title;
  modal.card = c;
  modal.body.innerHTML = "";
  append_text("Raw: ");
  var s = append_editable("SPAN", "raw", c.text);
  if(c.parseClass=="good") append_text(" (DecNP: "+parseInt(c.bits.slice(1,-1).join(''),2)+")")
  append_br();
  if(c.facility) {
    append_text("Facility: ");
    s = append_editable("B", "facility", c.facility);
    append_br();
  }
  if(c.user) {
    append_text("UserID: ");
    s = append_editable("B", "user", c.user);
    append_br();
  }
  append_text("Length: ");
  s = append_editable("B", "length", c.length);
  append_br();
  if(c.division_position) {
    append_text("Binary: ");
    s = append_editable("SPAN", "evenParity", c.bits[0]);
    if(c.evenParity) s.style.color="green";
    else s.style.color="red";
    s = append_editable("SPAN", "bits", " ");
    s.innerHTML += c.bits.slice(1, c.division_position).join('')+" ";
    s.innerHTML += c.bits.slice(c.division_position, -1).join('')+" ";
    s = append_editable("SPAN", "oddParity", c.bits[c.length-1]);
    if(c.oddParity) s.style.color="green";
    else s.style.color="red";
  } else {
    append_text("Binary: ");
    s = append_editable("SPAN", "bits", c.bin);
  }
  modal.button.onclick = function(){send()};
  modal.style.display = "block";
}

function send() {
  var c = modal.card;
  sendCommand('/txid?v=' + c.hex + ':' + c.length.toString());
  modal.button.textContent = "Sending...";
  modal.button.disabled = true;
}

function displayLog(ESPnow, log) {
  var i;
  var o = "";
  var time = new Date().getTime();
  var ESPboot = time - ESPnow;
  var lines = log.trim().split("\r\n");
  if (myTable.rows.length) {
    newTable = document.createElement('tbody');
    myTable.parentNode.replaceChild(newTable, myTable);
    myTable = newTable;
  }
  for(i = 0; i < lines.length; i++) {
    l = lines[i];
    var index = l.indexOf(' ');
    var ts = parseInt(l.substr(0, index));
    var text = l.substr(index + 1);
    var row = appendRow();
    var dateString = new Date(ESPboot + ts).toLocaleString();
    with(appendCell(row, dateString)) {
      title = ts;
    }
    if(text.indexOf(':') >= 0) {
      var card = new Card(ts, text);
      with (appendCell(row, card.hex)) {
	title = text;
	className = card.parseClass;
      }
      appendCell(row, card.facility);
      appendCell(row, card.user);
      row.onclick = function(){info(this)};
      row.card = card;
    } else {
      appendCell(row, text).colSpan = 4;
      if(text=='Starting up!') {
	for(i = 0; i < myTable.rows.length - 1; i++) {
	  myTable.rows[i].cells[0].innerHTML = "?";
	}
      }
    }
  }
  var x = window.scrollX;
  var y = window.scrollMaxY || document.body.scrollHeight;
  scroll(x, y);
}
})();
