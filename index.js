#!/usr/bin/env node
"use strict";
const green = require("chalk").green
const inquirer = require("inquirer")

import mixCoins from './mixer'
import * as utils from './utils'

import { isNil } from 'lodash'

const prompt = async () => {
  const depositAddress = utils.generateDepositAddress()
  const answers = await inquirer.prompt([
    {
      name: "addresses",
      message: "Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent:",
    },
    {
      name: "deposit",
      message: `You may now send Jobcoins to address ${green(depositAddress)}. They will be mixed and sent to your destination addresses. \n Enter ${green('"y"')} to run again.`,
      when: (answers) => { 
        let addresses = answers.addresses
        if(!isNil(addresses) && addresses !== ''){
          addresses = addresses.replace(', ', ',').split(',')
          mixCoins(depositAddress, addresses)
        }
        return answers.addresses
      }
    },
  ])
  
  if (answers.deposit && answers.deposit.toLowerCase() === "y") {
    await prompt();
  }
}

console.log("Welcome to the Jobcoin mixer!");
prompt();




