import { test } from 'node:test'
import assert from 'node:assert'
import { reverse } from '../utils/for_testing.js'

test('reverse of a', () => {
  assert.strictEqual(reverse('a'), 'a')
})


//lisatty testi 
test('reverse of abc', () => {
  assert.strictEqual(reverse('abc'), 'cba')
})          