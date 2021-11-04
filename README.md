# Gossip Plotting Tool

Small npm tool to plot gossip as reported by holochain state dumps. 

## Prerequisites

Please ensure that node.js is installed. (Tested against version 14.16.0)

## Installation 

`git clone https://github.com/jdeepee/holochain-gossip-analysis && npm i`

## Specifying DNA's to analyse 

This tool is still WIP and does not support command line arguments. To change the DNA's that are used for analysis as well as number of state dumps made please edit `src/main.ts`. To include the names of DHT's in the output graphs please edit the `names` dict found in `src/plot_multiple.py`

(Currently loaded DNA's are Flux production test DNA's)

Note: DNA's should be in hex format (if you get a DNA buffer from the holochain conductor you can get as a hex string with `.toString("hex")`)

## Running

`npm run start`

## Output 

This tool will output four graphs per DNA analysed: `full_limbo_state`, `integrated_limbo_series`, `integration_limbo_series` & `validation_limbo_series`. 

Explanation for each are as follows: <br>

**full_limbo_state**: integrated_limbo_series, integration_limbo_series & validation_limbo_series plotted together<br>
**integrated_limbo_series**: Ops that are integrated. This includes rejected.<br>
**integration_limbo_series**: Ops waiting to be integrated.<br>
**validation_limbo_series**: Ops in validation limbo awaiting sys or app validation.<br>