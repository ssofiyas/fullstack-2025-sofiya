// ...existing code...
import { test } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'

const api = supertest(app)

test('notes are returned as json', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.status, 200)
  assert.strictEqual(response.type, 'application/json')
})
// ...existing code...