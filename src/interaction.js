const socket = io()

function $(selector, container) {
  container = container || document
  return container.querySelector(selector)
}

function addName(e) {
  e.preventDefault()

  const li = document.createElement('li')
  const input = $('[name=\"name\"]')
  // add to client
  li.className = 'name'
  li.innerText = input.value
  $('.names').appendChild(li)
  // send to server
  socket.emit('addName', {
    name: input.value
  })
  // clear form
  input.value = ''
}

if (window.location.pathname.match('create.html')) {
  $('#names .input-btn').addEventListener('click', addName)
  $('[name=\"name\"]').addEventListener('keypress', e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      addName(e)
    } else {
      return true
    }
  })
}