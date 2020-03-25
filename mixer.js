
import * as utils from './utils'
import * as api from './apiClient'

import { isNil, isEmpty } from 'lodash'

import { Observable } from 'rxjs';

const MIXER_TIMEOUT = 30000;
const MIXER_INTERVAL = 1000;

const HOUSE_ADDRESS = 'THE_HOUSE';

const mixCoins = async (depositAddress, outAddresses) => {
    if (isNil(depositAddress) || isEmpty(outAddresses)) {
      return;
    }
    
    const depAddrTransactions = await api.transactionsForAddress(depositAddress) || []
    const observable = new Observable(subscriber => {
      let elapsed = 0;
      const interval = setInterval(async () => {
        
        const depAddrCurrentInfo = await api.infoForAddress(depositAddress) || {}
        const depAddrCurrentTransactions = depAddrCurrentInfo.transactions || []

        if(!isEmpty(depAddrCurrentTransactions) && depAddrCurrentTransactions.length > depAddrTransactions.length){
          subscriber.next('Deposit Address Received Coins!');
          await api.transfer(depositAddress, HOUSE_ADDRESS, depAddrCurrentInfo.balance)
          await disburseCoins(outAddresses, depAddrCurrentInfo.balance);

          clearInterval(interval);
          subscriber.complete();
        }

        if(elapsed > MIXER_TIMEOUT){
          subscriber.next('Timeout occurred');

          clearInterval(interval)
          subscriber.complete()
        }

        elapsed += MIXER_INTERVAL
        subscriber.next(`${elapsed} elapsed`);
      }, MIXER_INTERVAL);
    })

    const subscription = observable.subscribe({
      next(x) { 
        // console.log('got value ' + x); 
      },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() {
        console.log('done');
        subscription.unsubscribe();
      }
    });
}

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
    const idx = utils.randomInteger(0, disbursements.length - 1);
    disbursements[idx].amount += 1
    remainingToDisburse -= 1
  }

  console.log('Prepared the following: ')
  console.log(disbursements)

  const houseAddrInfo = await api.infoForAddress(HOUSE_ADDRESS) || {}
  const houseAddrBalance = houseAddrInfo.balance || 0
  if(houseAddrBalance < amount){
    return;
  }

  for (const disbursement of disbursements) {
    if (disbursement.amount > 0) {
      await api.transfer(HOUSE_ADDRESS, disbursement.address, disbursement.amount)
    }
  }
}

export default mixCoins;


