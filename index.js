#!/usr/bin/env node
"use strict";
const green = require("chalk").green
const inquirer = require("inquirer")

import mixCoins from './mixer'
import * as utils from './utils'

import { isNil } from 'lodash'
const prompt = async () => {
  const depositAddress = utils.generateDepositAddress()
  let answers = await inquirer.prompt([
    {
      name: "addresses",
      message: "Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent:",
    }
  ])
  
  console.log(`You may now send Jobcoins to address ${green(depositAddress)}. They will be mixed and sent to your destination addresses.  This operation will timeout in 30 seconds.`)

  let addresses = answers.addresses
  if(!isNil(addresses) && addresses !== ''){
    console.log('Mixing coins')
    addresses = addresses.replace(', ', ',').split(',')
    await mixCoins(depositAddress, addresses)
    console.log('finished mixing coings!')
  } else {
    console.log('NOT Mixing coins')
  }

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

console.log("Welcome to the Jobcoin mixer!");
prompt()




