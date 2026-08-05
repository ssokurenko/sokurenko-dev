---
title: Claude Code Commands
description: A practical guide to commands in Claude Code for interacting with your terminal and codebase.
cheatsheet:
  slug: claude-code
  section: tooling
  summary: A practical guide to commands in Claude Code for interacting with your terminal and codebase.
  topicVersion: "N/A"
  verifiedAgainst:
    - label: Claude Code Commands Documentation
      url: https://code.claude.com/docs/en/commands
  lastVerified: 2026-08-05
  difficulty: intermediate
  tags: [cli, ai, llm, claude, anthropic, claude-code]
  pdf: true
---

## Mental model

Claude Code brings Claude directly into your terminal. Commands start with a `/` and provide ways to manage Claude's behavior, handle files, navigate your project, and trigger tools without leaving the chat interface. Think of `/` commands as controlling the shell that surrounds Claude's AI engine.

## Basic session control

| Task | Command |
|---|---|
| Start fresh | `/clear` |
| View shortcuts | `/help` |
| Exit CLI | `/exit` or `/quit` |

Commands to manage the lifetime of your Claude Code session. Running `/clear` provides an empty context window without losing project memory.

```bash
/clear my-previous-task
```

> **Tip:** You can resume a previous session with `/resume` and selecting it from the picker.

## Project and files

| Task | Command |
|---|---|
| Initialize | `/init` |
| Switch dir | `/cd <path>` |
| Add dir | `/add-dir <path>` |

Claude Code needs to know what files it can access. `/init` creates a `CLAUDE.md` to guide Claude in your repository. `/cd` safely changes directories while preserving context.

```bash
/cd src/components
```

> **Gotcha:** If you just want Claude to read files in another directory without moving the session, use `/add-dir` instead.

## Model and context

| Task | Command |
|---|---|
| Change model | `/model` |
| Adjust effort | `/effort [level]` |
| See context | `/context` |

Large codebases fill the context window fast. `/context` visualizes what is taking up space. `/model` and `/effort` control which model runs and how much reasoning it applies.

```bash
/effort high
/compact
```

> **Note:** Use `/compact` to summarize the current conversation to free up context space.

## Background tasks

| Task | Command |
|---|---|
| List tasks | `/tasks` |
| Detach session | `/background` |
| Copy to background | `/fork` |

Claude Code can run tasks in the background. `/tasks` lists background work and subagents. `/background` lets the whole session run detached so you can close your terminal.

```bash
/fork
```

> **Tip:** Use `/subtask <task>` to hand a side task to a background agent that will report back to your current conversation.

## Code review and changes

| Task | Command |
|---|---|
| View diff | `/diff` |
| Code review | `/code-review` |
| Batch changes | `/batch <inst>` |

These commands analyze or manipulate your code at scale. `/diff` opens an interactive viewer. `/code-review` checks for correctness and can apply findings with `--fix`.

```bash
/code-review medium --fix
```

> **Warning:** `/batch` will create isolated git worktrees and open PRs for each unit of work it identifies.

## Troubleshooting

| Task | Command |
|---|---|
| Run checkup | `/doctor` |
| Fix setup | `/doctor` |
| Rewind session | `/rewind` |

If something breaks, `/doctor` runs a setup checkup to diagnose installation, path, and configuration issues. `/rewind` rolls code and conversation back to a checkpoint.

```bash
/doctor
```

> **Gotcha:** `/debug` enables debug logging mid-session, which is useful if you didn't start Claude with `--debug`.

## Further reading

- [Claude Code Interactive Mode](https://code.claude.com/docs/en/interactive-mode) — Keyboard shortcuts, Vim mode, and command history.
- [Claude Code Skills](https://code.claude.com/docs/en/skills) — Learn how to create your own custom commands.
- [Claude Code Agent View](https://code.claude.com/docs/en/agent-view) - Learn about background tasks.
