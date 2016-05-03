QUnit.module('Initializations')
QUnit.test('QUnit init', assert => {
  assert.ok(true, 'QUnit is working.')
})
QUnit.test('socket init', assert => {
  assert.ok(io(), 'socket.io is installed.')
})