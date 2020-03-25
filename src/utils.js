import crypto from 'crypto'

export const generateDepositAddress = () => {
  const hash = crypto.createHash("sha256");
  return hash
    .update(`${Date.now()}`)
    .digest("hex")
    .substring(0, 8);
}

export const randomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min
}