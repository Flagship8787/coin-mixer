
import * as utils from './utils'
import * as api from './apiClient'

import { isNil, isEmpty } from 'lodash'

const MIXER_TIMEOUT = 30000
const MIXER_INTERVAL = 1000

const HOUSE_ADDRESS = 'THE_HOUSE'

export default (depositAddress, outAddresses) => new Promise(async (resolve, reject) => {
  if (isNil(depositAddress) || isEmpty(outAddresses)) {
    reject()
  }
  
  const depAddrTransactions = await api.transactionsForAddress(depositAddress) || []
  let elapsed = 0
  const interval = setInterval(async () => {
    
    const depAddrCurrentInfo = await api.infoForAddress(depositAddress) || {}
    const depAddrCurrentTransactions = depAddrCurrentInfo.transactions || []

    if(!isEmpty(depAddrCurrentTransactions) && depAddrCurrentTransactions.length > depAddrTransactions.length){
      console.log('Deposit Address Received Coins!')

      await api.transfer(depositAddress, HOUSE_ADDRESS, depAddrCurrentInfo.balance)
      await disburseCoins(outAddresses, depAddrCurrentInfo.balance)

      clearInterval(interval)
      resolve()
    }

    if(elapsed > MIXER_TIMEOUT){
      console.log('Timeout occurred')
      clearInterval(interval)
      reject()
    }

    elapsed += MIXER_INTERVAL
  }, MIXER_INTERVAL)
})

const disburseCoins = async (outAddresses, amount) => {
  if(amount <= 0){
    return
  }

  const disbursements = outAddresses.map(address => {
    return {
      address,
      amount: 0,
    }
  })

  console.log('preparing disbursement amounts')

  let remainingToDisburse = amount
  while(remainingToDisburse > 0) {
    const idx = utils.randomInteger(0, disbursements.length - 1)
    disbursements[idx].amount += 1
    remainingToDisburse -= 1
  }

  console.log('Prepared the following: ')
  console.log(disbursements)

  const houseAddrInfo = await api.infoForAddress(HOUSE_ADDRESS) || {}
  const houseAddrBalance = houseAddrInfo.balance ? parseInt(houseAddrInfo.balance) : 0
  if(houseAddrBalance < amount){
    console.log('House is BROKE!  Cannot make disbursements')
    return
  }

  for (const disbursement of disbursements) {
    if (disbursement.amount > 0) {
      await api.transfer(HOUSE_ADDRESS, disbursement.address, disbursement.amount)
    }
  }
}


