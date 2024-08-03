import test from 'node:test'
import assert from 'node:assert/strict'
import { signal, effect, computed, batch, untracked } from './preact-signal.js'

test('Preact Signals', async (t) => {
  await t.test('creates a signal with an initial value', async (t) => {
    const count = signal(0)

    assert.equal(count.value, 0)
  })

  await t.test('updates the signal value', async (t) => {
    const count = signal(0)

    count.value = 1

    assert.equal(count.value, 1)
  })

  await t.test('observes signal changes', async (t) => {
    const count = signal(0)
    let observed = 0

    effect(() => {
      observed = count.value
    })

    count.value = 1

    assert.equal(observed, 1)
  })

  await t.test('peek at the signal value without observing', async (t) => {
    const count = signal(0)
    const effectCount = signal(0)

    effect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const noop = count.value
      // update the effectCount signal on initialization of effect to be 1
      effectCount.value = effectCount.peek() + 1
    })

    // update the count signal to be 1 which triggers the effect
    // updating the effectCount signal to be 2
    count.value = 1

    assert.equal(effectCount.value, 2)
  })

  await t.test('computed signals', async (t) => {
    await t.test('creates a simple computed signal', async (t) => {
      const count = signal(0)
      const doubled = computed(() => count.value * 2)

      assert.equal(doubled.value, 0)

      count.value = 1

      assert.equal(doubled.value, 2)
    })

    await t.test('creates a complex computed signal', async (t) => {
      const name = signal('Jane')
      const surname = signal('Doe')
      const fullName = computed(() => name.value + ' ' + surname.value)

      assert.equal(fullName.value, 'Jane Doe')

      name.value = 'John'

      assert.equal(fullName.value, 'John Doe')
    })
  })

  await t.test('batch signals', async (t) => {
    await t.test('single batch update', async (t) => {
      const name = signal('Jane')
      const surname = signal('Doe')

      const fullName = computed(() => name.value + ' ' + surname.value)

      assert.equal(fullName.value, 'Jane Doe')

      batch(() => {
        name.value = 'John'
        surname.value = 'Smith'
      })

      assert.equal(fullName.value, 'John Smith')
    })

    await t.test('nested batch update', async (t) => {
      const name = signal('Jane')
      const surname = signal('Doe')

      const fullName = computed(() => {
        return name.value + ' ' + surname.value
      })

      assert.equal(fullName.value, 'Jane Doe')

      batch(function outerBatch () {
        name.value = 'John'

        batch(function nestedBatch () {
          name.value = 'Joey'
          surname.value = 'Test'
        }, 'nested batch')

        surname.value = 'Smith'
      }, 'outer batch')

      assert.equal(fullName.value, 'Joey Smith')
    })
  })

  await t.test('untracked signal', async (t) => {
    const counter = signal(0)
    const effectCount = signal(5)

    function effectFn () {
      /* eslint-disable-next-line no-unused-expressions */
      counter.value

      // Whenever this effect is triggered, we can get a new perform a function
      // that uses a signal value without this effect being observed
      // without untracked, this would cause an infinite loop
      effectCount.value = untracked(() => effectCount.value + 1)
      // This will cause an infinite loop without untracked
      // effectCount.value = effectCount.value + 1
    }

    effect(effectFn)

    assert.equal(effectCount.value, 6)
    counter.value = 1

    assert.equal(effectCount.value, 7)
  })
})
