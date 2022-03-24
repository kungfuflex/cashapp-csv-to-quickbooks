#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const yargs = require('yargs');
const csv = fs.readFileSync(yargs.argv._[0], 'utf8');
const lodash = require('lodash');

const matrix = csv.split('\n').map((v) => v.split(',').map((v) => {
  try {
    return JSON.parse(v);
  } catch (e) {
    return '';
  }
}));

const [ labels ] = matrix.splice(0, 1);



const zipped = matrix.map((v) => lodash.zipObject(labels, v))
const data = zipped.filter((v) => !(v['Transaction Type'] || '').match('Bitcoin'));

const output = [['Date', 'Amount', 'Description']];

console.log(output.concat(data.map((v) => [ v.Date, (v['Net Amount'] || '').replace(/\$/g, ''), [ v.Status, v['Name of sender/receiver'], v.Notes ].filter(Boolean).join(' ') ])).map((v) => v.join(',')).join('\n'));
