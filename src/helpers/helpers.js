export default {
  '$': (selector, container) => {
    container = container || document
    return container.querySelector(selector)
  },

  '$$': (selector, container) => {
    container = container || document
    return container.querySelectorAll(selector)
  }
}