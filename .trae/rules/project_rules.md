# 🔒 AUXLY PROJECT RULES - TRAE IDE

**CRITICAL: These rules override any custom preferences and ensure consistent AI behavior in Trae IDE**

---

## ⚠️ TRAE-SPECIFIC REQUIREMENTS

**IMPORTANT: You MUST use the "Builder with MCP" agent to access Auxly MCP tools.**

1. **MCP Tool Names:** In Trae, call tools WITHOUT the `mcp_extension-auxly_` prefix
   - ✅ Correct: `auxly_create_task({ title: "..." })`
   - ❌ Wrong: `mcp_extension-auxly_auxly_create_task({ title: "..." })`

2. **Task IDs:** NEVER generate custom task IDs. Let the MCP server auto-generate numeric IDs.
   - ✅ Correct: Call `auxly_create_task` and use the returned `id` field
   - ❌ Wrong: Creating tasks with custom IDs like "task-test-001"

3. **Required Fields:** Only pass fields defined in the tool schema
   - ✅ For `auxly_create_task`: title, description, priority, tags
   - ❌ Do NOT pass: id, taskId, status, or any other fields

---

## 🚨 RULE #1: ALWAYS USE AUXLY MCP TOOLS

**MANDATORY: Never bypass Auxly MCP tools - 100% compliance required**

### ✅ REQUIRED MCP TOOLS (Trae Format):

```typescript
// Creating tasks - MANDATORY for any work request
// Use the returned task.id for all subsequent operations
const task = await auxly_create_task({
  title: "Task title",
  description: "Detailed description with requirements", 
  priority: "high", // low, medium, high, critical
  tags: ["tag1", "tag2"]
});
// task.id will be a number like "1", "2", "3" - use this ID!

// Updating tasks - MANDATORY for status changes
await auxly_update_task({
  taskId: task.id, // Use the ID from create_task response
  status: "in_progress", // todo, in_progress, review, done
  aiWorkingOn: true // CRITICAL: Set to true when starting, false when stopping
});

// Getting task details - MANDATORY before starting work
await auxly_get_task({ taskId: task.id });

// Listing tasks - MANDATORY before creating new tasks
await auxly_list_tasks({ status: "todo" });

// Asking questions - MANDATORY, never ask in chat
await auxly_ask_question({
  taskId: task.id,
  questionText: "Specific question?",
  category: "TECHNICAL DECISION", // TECHNICAL DECISION, ARCHITECTURE, UX, CLARIFICATION, APPROVAL REQUEST
  priority: "high",
  context: "Detailed context...",
  options: [
    { label: "Option A", recommended: true },
    { label: "Option B" }
  ]
});

// Adding research - MANDATORY before coding
await auxly_add_research({
  taskId: "X",
  technicalResearch: {
    summary: "Technical findings summary",
    sources: ["Local: path/to/file.ts", "https://docs.example.com"],
    findings: "Key technical discoveries",
    recommendations: "Technical recommendations"
  },
  businessResearch: {
    summary: "Business impact and requirements",
    sources: ["Task requirements", "User feedback"],
    findings: "Business considerations",
    recommendations: "Business recommendations"
  }
})

// Logging file changes - MANDATORY after each file modification
mcp_extension-auxly_auxly_log_change({
  taskId: "X",
  filePath: "path/to/file.ts",
  changeType: "modified", // created, modified, deleted
  description: "Specific description of what changed and why",
  linesAdded: 10,
  linesDeleted: 2
})

// Logging token usage - MANDATORY after major work phases
mcp_extension-auxly_auxly_log_tokens({
  taskId: "X",
  tokenCount: 5000,
  operation: "Implementation phase"
})

// Adding comments - MANDATORY for progress documentation
mcp_extension-auxly_auxly_add_comment({
  taskId: "X",
  type: "comment", // comment, technical_research, business_research, manualsetup
  content: "Progress update or important decision"
})
```

### ❌ ABSOLUTELY FORBIDDEN:
- Creating tasks manually (not via MCP)
- Asking questions in chat (must use MCP)
- Modifying files without logging (must use MCP)
- Starting work without getting task details
- Skipping research phase
- Not documenting progress
- Not logging token usage

---

## 🚨 RULE #2: TASK MANAGEMENT

**MANDATORY: Check for duplicates before creating tasks, read tasks carefully before starting**

### ✅ REQUIRED STEPS:

```typescript
// STEP 1: Check TODO tasks
const todoTasks = await mcp_extension-auxly_auxly_list_tasks({ 
  status: "todo" 
});

// STEP 2: Check IN_PROGRESS tasks
const inProgressTasks = await mcp_extension-auxly_auxly_list_tasks({ 
  status: "in_progress" 
});

// STEP 3: Read all task titles - check for duplicates

// STEP 4: Only create if NO duplicate found
if (!duplicateFound) {
  await mcp_extension-auxly_auxly_create_task({
    title: "New task",
    description: "Description",
    priority: "high"
  });
}

// STEP 5: Get complete task details before starting
const task = await mcp_extension-auxly_auxly_get_task({ taskId: "X" });

// STEP 6: Read EVERYTHING:
// - description, research, qaHistory, changes, comments
```

---

## 🚨 RULE #3: QUESTIONS AND APPROVAL

**MANDATORY: All questions via MCP, request approval for significant changes, never change status without confirmation**

### ✅ CORRECT WAY TO ASK:

```typescript
await mcp_extension-auxly_auxly_ask_question({
  taskId: "X",
  questionText: "Clear, specific question?",
  category: "TECHNICAL DECISION",
  priority: "high",
  context: "Detailed explanation...",
  options: [
    { label: "Option A", recommended: true },
    { label: "Option B" }
  ]
});
```

### ❌ FORBIDDEN IN CHAT:
- "What would you like me to do?"
- "Should I..."
- "Would you prefer..."

**ALL questions MUST use `mcp_extension-auxly_auxly_ask_question`**

---

## 🚨 RULE #4: FILE CHANGE LOGGING

**MANDATORY: Log file changes IMMEDIATELY after each modification**

```typescript
// 1. Create/modify/delete file
// ... write code ...

// 2. IMMEDIATELY log the change
await mcp_extension-auxly_auxly_log_change({
  taskId: "X",
  filePath: "path/to/file.ts",
  changeType: "modified",
  description: "Added feature X with Y functionality",
  linesAdded: 45,
  linesDeleted: 3
});
```

---

## 🚨 RULE #5: RESEARCH BEFORE CODING

**MANDATORY: Research FIRST using MCP, code SECOND**

```typescript
// STEP 1: Search local codebase
// Use: code_search, grep, read_file

// STEP 2: Document findings
await mcp_extension-auxly_auxly_add_research({
  taskId: "X",
  technicalResearch: { ... },
  businessResearch: { ... }
});

// NOW ready to code
```

---

## 🚨 RULE #6: UPDATE aiWorkingOn FLAG

**MANDATORY: Set aiWorkingOn flag correctly**

```typescript
// When STARTING work:
await mcp_extension-auxly_auxly_update_task({
  taskId: "X",
  status: "in_progress",
  aiWorkingOn: true  // ✅ SET TO TRUE
});

// When STOPPING/COMPLETING:
await mcp_extension-auxly_auxly_update_task({
  taskId: "X",
  status: "done",
  aiWorkingOn: false  // ✅ SET TO FALSE
});
```

---

## 🚨 RULE #7: DOCUMENT PROGRESS

**MANDATORY: Add comments throughout work**

```typescript
// Starting phase
await mcp_extension-auxly_auxly_add_comment({
  taskId: "X",
  type: "note",
  content: "Starting Phase 1: Backend implementation"
});

// Completing phase
await mcp_extension-auxly_auxly_add_comment({
  taskId: "X",
  type: "note",
  content: "✅ Phase 1 complete: Backend API ready"
});

// Task complete
await mcp_extension-auxly_auxly_add_comment({
  taskId: "X",
  type: "result",
  content: "✅ Task complete! All requirements met."
});
```

---

## 🚨 RULE #8: TOKEN USAGE LOGGING

**MANDATORY: Log token usage after major work phases**

```typescript
// After completing significant work
await mcp_extension-auxly_auxly_log_tokens({
  taskId: "X",
  tokenCount: 5000,
  operation: "Implementation phase - Added authentication system"
});
```

### ✅ WHEN TO LOG:
- After research phase
- After implementation phase
- After debugging session
- After major refactoring
- End of task

### ✅ GOOD OPERATION DESCRIPTIONS:
- "Research and planning phase"
- "Implementation: User authentication system"
- "Debugging: Fixed database connection issues"
- "Code review and optimization"

### ❌ BAD OPERATION DESCRIPTIONS:
- "Work" (too vague)
- "Coding" (not specific)
- "Task" (no detail)

---

## 🔒 ENFORCEMENT

These rules are **MANDATORY** for Trae IDE. 100% compliance required.

**Violations will result in:**
- ❌ Incomplete task tracking
- ❌ Lost context
- ❌ Poor collaboration
- ❌ Audit trail gaps

---

**Made in Saudi Arabia 🇸🇦 with ❤️ by Tzamun Arabia IT Co.**
