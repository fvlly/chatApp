const socket = io();

//Elements
const form = document.getElementById("form");   // use $ to indicate dom manipulation eg $form
const formInput = form.querySelector('.message')
const submitBtn = document.getElementById("submit-message");
const sendBtn = document.getElementById('send-location')
const messages = document.querySelector('.messages')

// Template
const templateMessage = document.querySelector("#message-template").innerHTML
const locationTemplateMessage = document.querySelector("#location-message-template").innerHTML

socket.on("message", ({text,createdAt}) => {
  console.log(text);
  const html = Mustache.render(templateMessage,{
    text,
    createdAt:moment(createdAt).format('h:mm a'),

  }) //getting message from mustache

  messages.insertAdjacentHTML('beforeend',html)
});

socket.on('locationMessage',(url)=>{
  console.log(url);
  const html = Mustache.render(locationTemplateMessage,{url})
  messages.insertAdjacentHTML('beforeend',html)
})

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