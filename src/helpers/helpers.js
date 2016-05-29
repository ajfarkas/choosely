function $(selector, container) {
  container = container || document
  return container.querySelector(selector)
}

function $$(selector, container) {
  container = container || document
  return container.querySelectorAll(selector)
}

export default {
  $, $$
}