export default {
  '$': (selector, container) => {
    container = container || document
    return container.querySelector(selector)
  },

  '$$': (selector, container) => {
    container = container || document
    return container.querySelectorAll(selector)
  },
  /* 
   * Get names that have not been eliminated in matched.
   * args:
   *  who {Enum}: 'user' | 'partner'
   * returns:
   *  ID of remaining names for given user or undefined
  */
  getRemaining: (who) => Object.keys(Data.firstnames).filter(name =>
    !Data.firstnames[name][Data.user[who]].eliminated
  )
}