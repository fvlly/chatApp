const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

//Elements
const form = document.getElementById("form");   // use $ to indicate dom manipulation eg $form
const formInput = form.querySelector('.message')
const submitBtn = document.getElementById("submit-message");
const sendBtn = document.getElementById('send-location')

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //disable send btn
  submitBtn.setAttribute('disabled','disabled')

  const newMessage = e.target.elements.message.value //document.querySelector(".message").value
  console.log(`line 13 ${newMessage}`);
  socket.emit('chat', newMessage);
  //enable after message is sent
  submitBtn.removeAttribute('disabled')
  formInput.value = ''
  formInput.focus()
});



sendBtn.addEventListener('click',()=>{

  if (!navigator.geolocation) {
    return alert("Broswer doesn't aupport geoloaction")
  }

  sendBtn.setAttribute('disabled','disabled')

  navigator.geolocation.getCurrentPosition((position)=>{
    const {coords:{latitude:lat,longitude: long}} = position
    
    socket.emit('sendLocation',{lat,long},()=>{
      console.log('Location shared');
      sendBtn.removeAttribute('disabled')
    })
   
  })

})