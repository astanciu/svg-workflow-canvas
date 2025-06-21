import { Engine } from "./engine";
import * as fs from "fs";

const workflow = JSON.parse(fs.readFileSync("./src/workflow.json", "utf-8"));
Engine.run(workflow);
