import { execSync } from "child_process";
import fs from "fs";

const REPO = "AndreLucas0/Nativo-app";
const PROJECT_ID = "PVT_xxx"; // opcional

const backlog = JSON.parse(fs.readFileSync("./backlog.json", "utf-8"));

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function createIssue(title, body, labels = []) {
  const labelArgs = labels.map(l => `--label "${l}"`).join(" ");

  const output = run(
    `gh issue create --repo ${REPO} --title "${title}" --body "${body}" ${labelArgs}`
  );

  return output; // URL da issue
}

function addToProject(issueUrl) {
  if (!PROJECT_ID) return;
  run(`gh project item-add ${PROJECT_ID} --url ${issueUrl}`);
}

function extractIssueNumber(url) {
  return url.split("/").pop();
}

for (const us of backlog) {
  const usBody = `
${us.description}

## Critérios de Aceite
${us.acceptance.map(a => `- ${a}`).join("\n")}
  `;

  const usUrl = createIssue(
    `[${us.id}] ${us.title}`,
    usBody,
    ["type:story"]
  );

  addToProject(usUrl);

  const usNumber = extractIssueNumber(usUrl);

  for (const task of us.tasks) {
    const taskBody = `
Parentesco: #${usNumber}

## Objetivo
${task.objective}

## Critérios de Aceite
${task.acceptance.map(a => `- ${a}`).join("\n")}
    `;

    const taskUrl = createIssue(
      `[${task.id}] ${task.title}`,
      taskBody,
      ["type:task"]
    );

    addToProject(taskUrl);

    const taskNumber = extractIssueNumber(taskUrl);

    // Link bidirecional
    run(`gh issue comment ${taskNumber} --body "Relacionado a #${usNumber}"`);
  }
}