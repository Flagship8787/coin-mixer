import axios from 'axios';

/* Urls */
export const API_BASE_URL = 'http://jobcoin.gemini.com';
export const API_ADDRESS_URL = `${API_BASE_URL}/addresses/`;
export const API_TRANSACTIONS_URL = `${API_BASE_URL}/transactions/`;

const apiConn = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000
});
  

export const infoForAddress = async (address) => {
    const path = `/deuce-jovial/api/addresses/${address}`
    try {
        const response = await apiConn.get(path)
        return response.data || {}
    } catch (error) {
        console.log('Axios Error! ')
        console.log(error)
    }

    return {}
}

export const transactionsForAddress = async (address) => {
    const response = await infoForAddress(address)
    return response.transactions || []
}

export const allTransactions = async (address) => {
    const path = '/deuce-jovial/api/transactions'
    const response = await apiConn.get(path)
    return response.data
}

export const transfer = async (fromAddr, toAddr, amount) => {
    const path = '/deuce-jovial/api/transactions'
    const params = {
        fromAddress: fromAddr,
        toAddress: toAddr,
        amount
    }

    const response = await apiConn.post(path, params)
    console.log(response.data)
}