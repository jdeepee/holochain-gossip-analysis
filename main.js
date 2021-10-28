const conductor = require("@holochain/conductor-api");
const fs = require("fs");

const targetDNA = "842d242e512f664b8dc4c939f965ba7d91c2b209699496e7c6cdaabda188f70055d4e018027086";
const waitTime = 10000;

const iterations = 180;
let counter = 0;

const validation_limbo_series = [];
const integration_limbo_series = [];
const integrated_limbo_series = [];
const timestamp_series = [];

async function main() {
    try {
        const admin = await conductor.AdminWebsocket.connect(`http://localhost:2000`, 60000)
        while (counter < iterations) {
            console.log("Running iteration", counter,"/",iterations);
            const status = await getValidationStatus(admin, targetDNA)
            console.log("Current status", status, "\n");
            validation_limbo_series.push(status.validation_limbo);
            integration_limbo_series.push(status.integration_limbo);
            integrated_limbo_series.push(status.integrated);
            timestamp_series.push(status.now)
            const waitMs = waitTime - status.elapsed;
            if (waitMs > 0) {
                console.log("Sleeping", waitMs);
                await sleep(waitMs)
            }
            counter += 1;
        }

        writeData(JSON.stringify(validation_limbo_series), "validation_limbo_series.json");
        writeData(JSON.stringify(integration_limbo_series), "integration_limbo_series.json");
        writeData(JSON.stringify(integrated_limbo_series), "integrated_limbo_series.json");
        writeData(JSON.stringify(timestamp_series), "timestamp_series.json");
        sleep(5000);
        process.exit(1);
    } catch (e) {
        console.error(e);
        throw new Error(e)
    }
}

function writeData(data, fileName) {
    fs.writeFileSync(fileName, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });    
}

async function getValidationStatus(adminConductor, dna) {
    const start = new Date();
    const cells = await adminConductor.listCellIds();
    for (const cell of cells) {
        if (dna != undefined && cell[0].toString("hex") == dna) {
            const now = new Date();
            const state = await adminConductor.dumpState({cell_id: cell});
            //delete state[0]["peer_dump"]["this_dna"]
            const integration_dump = state[0]["integration_dump"];
            const done = new Date();
            const elapsed = done - start;
            return {
                validation_limbo: integration_dump["validation_limbo"],
                integration_limbo: integration_dump["integration_limbo"],
                integrated: integration_dump["integrated"],
                elapsed: elapsed,
                now: now
            }
        }
    }
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()