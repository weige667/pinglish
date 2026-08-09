import Dexie from 'dexie'

const db = new Dexie('pinglish')

db.version(1).stores({
  words: '++id, word, level, category',
  grammar: '++id, topic, level',
  listening: '++id, title, level',
  reading: '++id, title, level',
  exams: '++id, title, type',
  progress: '++id, type, date',
  settings: 'key'
})

export default db
