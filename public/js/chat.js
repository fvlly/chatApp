const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const form = document.getElementById("form");

const submitBtn = document.getElementById("submit-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = e.target.elements.message.value //document.querySelector(".message").value
  console.log(`line 13 ${newMessage}`);
  socket.emit('chat', newMessage);
});

const sendBtn = document.getElementById('send-location')

sendBtn.addEventListener('click',()=>{

  if (!navigator.geolocation) {
    return alert("Broswer doesn't aupport geoloaction")
  }

  navigator.geolocation.getCurrentPosition((position)=>{
    const {coords:{latitude:lat,longitude: long}} = position
    
    socket.emit('sendLocation',{lat,long})
  })

})