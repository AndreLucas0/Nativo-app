import { execSync } from "child_process";
import fs from "fs";

// 🔧 CONFIG
const REPO = "AndreLucas0/Nativo-app";
const ADD_TO_PROJECT = false;

// 📥 LOAD JSON
const data = JSON.parse(fs.readFileSync("./docs/backlog/backlog.json", "utf-8"));

// 🧠 HELPERS
function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch (e) {
    console.log("⚠️ Erro:", cmd);
    return null;
  }
}

function issueExists(title) {
  const res = run(`gh issue list --repo ${REPO} --search "${title}" --json number,title`);
  if (!res) return null;

  const issues = JSON.parse(res);
  return issues.find(i => i.title === title);
}

function createOrUpdateIssue(title, body, labels) {
  const existing = issueExists(title);

  // 📄 cria arquivo temporário
  const tempFile = `temp-${Date.now()}.md`;
  fs.writeFileSync(tempFile, body);

  if (existing) {
    console.log(`🔄 Atualizando: ${title}`);

    run(`gh issue edit ${existing.number} --repo ${REPO} --body-file "${tempFile}"`);

    fs.unlinkSync(tempFile);
    return existing.number;
  }

  console.log(`🆕 Criando: ${title}`);

  const labelArgs = labels.map(l => `--label "${l}"`).join(" ");

  const url = run(
    `gh issue create --repo ${REPO} --title "${title}" --body-file "${tempFile}" ${labelArgs}`
  );

  fs.unlinkSync(tempFile);

  if (!url) {
    console.log("❌ Falha ao criar issue:", title);
    return null;
  }

  return url.split("/").pop();
}

function linkTaskToStory(taskNumber, storyNumber) {
  run(`gh issue comment ${taskNumber} --body "🔗 Relacionada a #${storyNumber}"`);
}

function addToProject(issueNumber) {
  if (!ADD_TO_PROJECT) return;
  run(`gh project item-add ${PROJECT_ID} --url https://github.com/${REPO}/issues/${issueNumber}`);
}

// 🚀 MAIN
for (const story of data.stories) {

  const storyBody = `
${story.description || ""}

## 🎯 Critérios de Aceite
${(story.acceptance || []).map(a => `- ${a}`).join("\n")}
`;

  const storyNumber = createOrUpdateIssue(
    `[${story.id}] ${story.title}`,
    storyBody,
    ["type:story"]
  );

  addToProject(storyNumber);

  for (const task of story.tasks) {

    const taskBody = `
📌 **Parentesco:** #${storyNumber}

## 🧩 Objetivo
${task.objective}

## ✅ Critérios de Aceite
${task.acceptance.map(a => `- ${a}`).join("\n")}
`;

    const taskNumber = createOrUpdateIssue(
      `[${task.id}] ${task.title}`,
      taskBody,
      ["type:task"]
    );

    addToProject(taskNumber);

    linkTaskToStory(taskNumber, storyNumber);
  }
}

console.log("\n✅ Backlog importado com sucesso!");