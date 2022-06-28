const socket = io();

//Elements
const form = document.getElementById("form");   // use $ to indicate dom manipulation eg $form
const formInput = form.querySelector('.composer')
const submitBtn = document.getElementById("submit-message");
const sendBtn = document.getElementById('send-location')
const messages = document.querySelector('.chat__messages')

// Template
const templateMessage = document.querySelector("#message-template").innerHTML
const locationTemplateMessage = document.querySelector("#location-message-template").innerHTML

//Options

const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on("message", ({username,text,createdAt}) => {
  console.log(text);
  const html = Mustache.render(templateMessage,{
    username,
    text,
    createdAt:moment(createdAt).format('h:mm a'),

  }) //getting message from mustache

  messages.insertAdjacentHTML('beforeend',html)
});

socket.on('locationMessage',({username,url,createdAt})=>{
  console.log(url);
  const html = Mustache.render(locationTemplateMessage,{username,url,
  createdAt:moment(createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend',html)
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target);
  console.log(e.target.elements);
  //disable send btn
  submitBtn.setAttribute('disabled','disabled')

  const newMessage = e.target.elements.composer.value //document.querySelector(".message").value
  console.log(`line 13 ${newMessage}`);
  socket.emit('sendMessage', newMessage);
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

socket.emit('join',{username,room},(error) => {
  if (error) {
      alert(error)
      location.href = '/'
  }
})