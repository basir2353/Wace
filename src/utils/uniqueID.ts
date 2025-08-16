function generateID(value = 11) {
  return new Date().getTime().toString(value);
}

export default function generateuniqueID() {
  let getID = generateID(11) + generateID(36) + generateID(11);
  return getID.slice(10, 20);
}
