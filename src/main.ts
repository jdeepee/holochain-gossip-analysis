const conductor = require("@holochain/conductor-api");
const fs = require("fs");

const targetDNA = "842d242e512f664b8dc4c939f965ba7d91c2b209699496e7c6cdaabda188f70055d4e018027086";
const agentDNA = "842d24fbd991bc77a99d770cde64b673d343a8aef79468682bd3c7cb599913ca9ddd499a4eb4d0";
const shortFormDNA = "842d24544f2cd5c8ef123a7348e44f243bdcc0a5729a2a61f9c3f6a467d03cf5cc714e6164fdd0";
const whitelistedDNAS = [targetDNA, agentDNA, shortFormDNA];
const waitTime = 10000;

const iterations = 250;
let counter = 0;

interface Result {
    validation_limbo_series: number[]
    integration_limbo_series: number[]
    integrated_limbo_series: number[]
    timestamp_series: Date[]
    dna: string
}

const results : { [key:string] : Result; } = {};

async function main() {
    try {
        const admin = await conductor.AdminWebsocket.connect(`http://localhost:2000`, 60000)
        for (const dna of whitelistedDNAS) {
            results[dna] = {
                validation_limbo_series: [],
                integration_limbo_series: [],
                integrated_limbo_series: [],
                timestamp_series: [],
                dna: dna,
            } as Result
        }
        while (counter < iterations) {
            console.log("Running iteration", counter,"/",iterations);
            const gossip_status = await getValidationStatus(admin, whitelistedDNAS)
            console.log("Current gossip status: \n", gossip_status, "\n");
            for (const result of gossip_status) {
                results[result.dna] = {
                    validation_limbo_series: results[result.dna].validation_limbo_series.concat([result.validation_limbo]),
                    integration_limbo_series: results[result.dna].integration_limbo_series.concat([result.integration_limbo]),
                    integrated_limbo_series: results[result.dna].integrated_limbo_series.concat([result.integrated]),
                    timestamp_series: results[result.dna].timestamp_series.concat([result.now]),
                    dna: result.dna
                } as Result
            }
            const waitMs = waitTime - gossip_status[0].elapsed;
            if (waitMs > 0) {
                console.log("Sleeping", waitMs);
                await sleep(waitMs)
            }
            counter += 1;
        }

        writeData(JSON.stringify(results), "results.json");
        sleep(5000);
        process.exit(1);
    } catch (e) {
        console.error(e);
        //@ts-ignore
        throw new Error(e)
    }
}

//@ts-ignore
function writeData(data, fileName) {
    //@ts-ignore
    fs.writeFileSync(fileName, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });    
}

//@ts-ignore
async function getValidationStatus(adminConductor, dnas) {
    const start = new Date();
    const cells = await adminConductor.listCellIds();
    const results = [];
    for (const cell of cells) {
        if (dnas != undefined && dnas.includes(cell[0].toString("hex"))) {
            const dna = dnas.find((dna: string) => dna == cell[0].toString("hex"))
            const now = new Date();
            const state = await adminConductor.dumpState({cell_id: cell});
            //delete state[0]["peer_dump"]["this_dna"]
            const integration_dump = state[0]["integration_dump"];
            const done = new Date();
            //@ts-ignore
            const elapsed = done - start;
            results.push({
                validation_limbo: integration_dump["validation_limbo"],
                integration_limbo: integration_dump["integration_limbo"],
                integrated: integration_dump["integrated"],
                elapsed: elapsed,
                now: now,
                dna: dna
            })
        }
    }
    return results
}

//@ts-ignore
async function printPeers(adminConductor, dna) {
    const cells = await adminConductor.listCellIds();
    for (const cell of cells) {
        if (dna != undefined && cell[0].toString("hex") == dna) {
            const state = await adminConductor.dumpState({cell_id: cell});
            //delete state[0]["peer_dump"]["this_dna"]
            console.dir(state[0]["peer_dump"], { depth: null });
            console.log("\n\n---------\n\n")
        }
    }
}

//@ts-ignore
async function printPeersFull(adminConductor, dna) {
    const cells = await adminConductor.listCellIds();
    for (const cell of cells) {
        if (dna != undefined && cell[0].toString("hex") == dna) {
            const state = await adminConductor.dumpState({cell_id: cell});
            for (const state_cell of state) {
                //const sourceChain = state_cell["source_chain_dump"];
                //console.dir(sourceChain, {depth: null});
                console.dir(state_cell, {depth: null})
                console.log("\n\n---------\n\n")
            }
            console.log("\n\nNEXT CELL\n\n")
        }
    }
}

//@ts-ignore
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()