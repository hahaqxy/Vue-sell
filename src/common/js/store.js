function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}

  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

function loadFromLocal(id, key, defalut) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return defalut
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return defalut
  }
  let res = seller[key]
  return res || defalut
}

export {
  saveToLocal,
  loadFromLocal
}
