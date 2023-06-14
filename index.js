const fs = require('fs')
const FILE_PATH = 'notes.json'

const command = process.argv[2]

switch (command) {
  case 'list':
    list();
    break;
  case 'view':
    view();
    break;
  case 'create':
    create();
    break;
  case 'remove':
    remove();
    break;
  default:
    console.log('Неизвестная команда.')
}

function list() {
  read(notes => {
    if (notes.length) {
      notes.forEach(note => console.log(`# ${note.id}. ${note.title}`))
    } else {
      console.log('Заметок пока нет.')
    }
  })
}

function view() {
  read(notes => {
    const id = +process.argv[3]
    const note = notes.find(note => note.id === id)

    if (note) {
      console.log(`# ${note.id}\n${note.createdAt}\n${note.title}\n${note.content}`)
    } else {
      console.error('Заметка не найдена.')
    }
  })
}

function create() {
  read(notes => {
    const title = process.argv[3]
    const content = process.argv[4]
    const id = notes.length ? notes.sort((a, b) => {
      if (a > b) return 1
      if (a === b) return 0
      if (a < b) return - 1
    })[notes.length - 1].id + 1 : 0

    notes.push({
      id,
      createdAt: new Date(),
      title,
      content
    })

    write(notes, 'Заметка добавлена!')
  })
}

function remove() {
  read(notes => {
    const id = +process.argv[3]
    const noteIndex = notes.findIndex(note => note.id === id)

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1)
      write(notes, 'Заметка удалена!')
    } else {
      console.log('Заметка не найдена.')
    }
  })
}

function read(done) {
  fs.readFile(FILE_PATH, (error, data) => {
    if (error) {
      console.error(error.message)
      return
    }

    try {
      const notes = JSON.parse(data)
      done(notes)
    } catch (error) {
      console.log(error)
    }
  })
}

function write(notes, message) {
  try {
    const json = JSON.stringify(notes)

    fs.writeFile(FILE_PATH, json, error => {
      if (error) {
        console.error(error.message)
        return
      }
  
      console.log(message)
    })
  } catch (error) {
    console.log(error)
  }
}
