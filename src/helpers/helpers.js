function $(selector, container) {
  container = container || document
  return container.querySelector(selector)
}

export default {
  $
}