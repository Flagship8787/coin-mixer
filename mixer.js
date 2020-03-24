
import utils from './utils'
import * as api from './apiClient'

import { isNil, isEmpty } from 'lodash'

import { Observable } from 'rxjs';

const MIXER_TIMEOUT = 10000;
const MIXER_INTERVAL = 1000;

const BANK_ACCOUNT = 'THE_BANK';

const mixCoins = async (depositAddress, outAddresses) => {
    if (isNil(depositAddress) || isEmpty(outAddresses)) {
      return;
    }

    const depAddrInfo = await api.infoForAddress(depositAddress) || []
    const depAddrTransactions = depAddrInfo.transactions || []
    const observable = new Observable(subscriber => {
      let elasped = 0;
      const interval = setInterval(async () => {

        subscriber.next('Checking deposit address');
        
        
        const depAddrCurrentInfo = await api.infoForAddress(depositAddress) || []
        const depAddrCurrentTransactions = depAddrCurrentInfo.transactions || []

        if(!isEmpty(depAddrCurrentTransactions) && depAddrCurrentTransactions.length > depAddrTransactions.length){
          subscriber.next('Deposit Address Received Coins!');
          
          await disburseCoins(depositAddress, outAddresses);
          clearInterval(interval);
          subscriber.complete();
        }

        elasped += MIXER_INTERVAL
        if (elasped >= MIXER_TIMEOUT) {
          clearInterval(interval);
        } else {
          subscriber.next(`${elasped} Elapsed!`);
        }
      }, MIXER_INTERVAL);

      subscriber.next('Mixing Complete!');
      subscriber.complete();
    })

    const subscription = observable.subscribe({
      next(x) { console.log('got value ' + x); },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() {
        console.log('done');
      }
    });

    setTimeout(() => {
      subscription.unsubscribe();
    }, MIXER_TIMEOUT);    
}

const disburseCoins = (depositAddress, outAddresses) => {

}

export default mixCoins;


