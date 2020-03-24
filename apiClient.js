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
    console.log('API_BASE_URL: ', API_BASE_URL)
    console.log('path: ', path)

    const response = await apiConn.get(path)
    console.log(response.data)
    return 
}

export const transactionsForAddress = async (address) => {
    const path = `/deuce-jovial/api/transactions/${address}`
    console.log('API_BASE_URL: ', API_BASE_URL)
    console.log('path: ', path)

    const response = await apiConn.get(path)
    console.log(response.data)
    return 
}