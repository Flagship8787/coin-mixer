const green = require("chalk").green
const inquirer = require("inquirer")

import { isNil, isEmpty } from 'lodash'

import mixCoins from './mixer'
import * as utils from './utils'

const startApplication = async () => {
  const depositAddress = utils.generateDepositAddress()
  let answers = await inquirer.prompt([
    {
      name: "addresses",
      message: "Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent:",
    }
  ])
  
  let addresses = []
  const addressesString = answers.addresses
  if(!isNil(addressesString) && !isEmpty(addressesString)){
    addresses = addressesString.replace(', ', ',').split(',')
  }

  console.log(`You may now send Jobcoins to address ${green(depositAddress)}. They will be mixed and sent to your destination addresses.  This operation will timeout in 30 seconds.`)
  console.log('Mixing coins')

  await mixCoins(depositAddress, addresses)
  
  console.log('Finished mixing coins!')

  answers = await inquirer.prompt([
    {
      name: "continue",
      message: `Enter ${green('"y"')} to run again`
    },
  ])

  if (answers.continue && answers.continue.toLowerCase() === "y") {
    await prompt();
  }
}

export default startApplication




