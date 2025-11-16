// socket helpers for frontend
const socketClient = (function(){
  const socket = io('/', {transports:['websocket']})
  socket.on('connect', ()=>console.log('socket connected'))
  socket.on('joined', d=>console.log('joined room', d))
  socket.on('alert', d=>{
    alert(`Alert: ${d.type} - ${d.message}`)
  })
  return socket
})()
