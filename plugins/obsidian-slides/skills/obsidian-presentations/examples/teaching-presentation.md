---
categories:
  - "[[Presentation]]"
type: []
created: 2026-01-11
---

# Introduction to Git Version Control

**Workshop for Beginners**
**January 2026**

%%
TALKING POINTS:
Welcome to this hands-on Git workshop! By the end of this session, you'll understand what Git is, why it's useful, and how to use it for your projects. Don't worry if you've never used command-line tools before—we'll go step by step.

DELIVERY:
- Friendly, encouraging tone
- Check for understanding frequently
- Remind them: making mistakes is how we learn

SETUP:
- Ensure everyone has Git installed
- Check that everyone can open terminal
- Confirm access to practice repository

TIME: 1-2 minutes
%%

---

## What is Version Control?

Think of it like **"Track Changes" for code**

![Illustration showing document evolution with multiple versions and the ability to go back in time]

**Why use it?**
- Save snapshots of your work
- See what changed and when
- Undo mistakes easily
- Work with others without conflicts

%%
TALKING POINTS:
Has anyone used "Track Changes" in Microsoft Word or Google Docs? Git is similar, but much more powerful.

ANALOGY:
Imagine you're writing a novel. Every time you finish a chapter, you save a numbered copy: "novel_v1.docx", "novel_v2.docx", etc. Version control automates this and adds superpowers: you can see exactly what words changed, jump back to any version instantly, and multiple authors can work simultaneously.

EXAMPLES:
- Accidentally deleted an important function? Restore it from yesterday's version.
- Want to try a risky experiment? Create a branch, experiment safely.
- Need to know who wrote this code? Git tells you, with their explanation.

CHECK UNDERSTANDING:
"Make sense so far? Any questions before we dive into Git specifically?"

TIME: 3-4 minutes
%%

---

## How Git Works: Snapshots

![Diagram showing timeline of commits, each commit containing a snapshot of files]

**Three states of files:**
1. **Working directory** - Files you're editing
2. **Staging area** - Changes you're preparing to save
3. **Repository** - Saved snapshots (commits)

**Workflow:** Edit → Stage → Commit

%%
TALKING POINTS:
Git stores snapshots of your entire project at different points in time. Each snapshot is called a "commit."

THREE STATES:
Let me break this down:
1. Working Directory - Your actual files. You edit them normally.
2. Staging Area - A draft of your next snapshot. You choose which changes to include.
3. Repository - Permanent history of snapshots.

WORKFLOW EXPLANATION:
- Edit your files (change code, add features)
- Stage your changes (say "I want to save these specific changes")
- Commit (create snapshot with a message explaining what changed)

ANALOGY:
Think of staging like packing a box. You decide what goes in (staging). Then you seal and label the box (commit). You can pack multiple items at once, or pack items from different places.

REASSURE:
This might sound complicated, but you'll get the hang of it quickly with practice.

TIME: 4-5 minutes
%%

---

## Your First Git Commands

```bash
# Create a new repository
git init

# Check status
git status

# Stage a file
git add filename.txt

# Commit changes
git commit -m "Add new feature"
```

**Practice time!** Follow along on your computer.

%%
TALKING POINTS:
Let's try these commands together. Don't just watch—type them yourself!

WALKTHROUGH:
1. Open your terminal
2. Create a practice folder: `mkdir git-practice && cd git-practice`
3. Initialize Git: `git init`
4. Create a file: `echo "Hello Git" > hello.txt`
5. Check status: `git status` (file is untracked)
6. Stage the file: `git add hello.txt`
7. Check status again: `git status` (file is staged)
8. Commit: `git commit -m "Add hello file"`

EXPLAIN EACH COMMAND:
- `init` - Tells Git "start tracking this folder"
- `status` - Shows what's changed
- `add` - Moves changes to staging area
- `commit -m` - Saves snapshot with a message

ENCOURAGE:
Walk around, help anyone stuck. Common issues: wrong directory, typos in commands.

PAUSE:
Give them 5 minutes to try this. "Shout if you need help!"

TIME: 8-10 minutes (including practice)
%%

---

## Understanding Commits

![Visual showing commit history as a graph with commit IDs, messages, and author info]

Each commit records:
- **What changed** (files added, modified, deleted)
- **Who made the change** (author name and email)
- **When** (timestamp)
- **Why** (commit message)

**Best practice:** Write clear commit messages
- ✅ "Fix login bug where password reset failed"
- ❌ "Fixed stuff"

%%
TALKING POINTS:
Commits are the building blocks of your project history. Each commit is like a bookmark with context.

COMMIT DETAILS:
Every commit gets a unique ID (hash). You can reference any commit to see what the project looked like then, or what changed.

COMMIT MESSAGES:
Good messages are crucial! In 6 months, you'll forget what "fixed stuff" means. But "Fix login bug where password reset failed" tells future you exactly what this commit did.

TIPS FOR GOOD MESSAGES:
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Be specific
- Explain WHY if it's not obvious

EXAMPLE:
Instead of "Changed database," write "Switch from SQLite to PostgreSQL for better concurrency."

SHOW EXAMPLE:
`git log` to show commit history. Point out the information in each commit.

TIME: 4 minutes
%%

---

## Branching: Parallel Universes

![Diagram showing main branch with two feature branches diverging and merging back]

**Branches let you:**
- Experiment without breaking main code
- Work on multiple features simultaneously
- Collaborate without conflicts

```bash
# Create and switch to new branch
git checkout -b new-feature

# List branches
git branch

# Switch branches
git checkout main
```

%%
TALKING POINTS:
This is where Git gets really powerful. Branches let you create parallel versions of your project.

ANALOGY:
Imagine you're writing a book. The main branch is your published chapters. You want to experiment with a plot twist, but you're not sure if it'll work. Create a branch! Write the twist, see if you like it. If yes, merge it into main. If no, delete the branch. Your main branch is safe either way.

USE CASES:
- Bug fix branch: Fix urgent bug without touching feature work
- Feature branch: Develop new feature isolated from stable code
- Experiment branch: Try risky changes safely

BEST PRACTICE:
Main branch should always be stable, working code. Do all development in branches.

DEMONSTRATION:
Create a branch, make changes, show how switching branches changes your files.

PRACTICE:
"Everyone create a branch called 'experiment'. Make some changes. Commit them. Switch back to main. Notice your changes disappeared (they're safe in the branch)."

TIME: 5-6 minutes
%%

---

## Working with GitHub

![Diagram showing local repository pushing to and pulling from remote GitHub repository]

**GitHub adds:**
- Cloud backup of your repository
- Collaboration with other developers
- Code review and project management

```bash
# Connect to GitHub
git remote add origin https://github.com/user/repo.git

# Upload your commits
git push origin main

# Download latest changes
git pull origin main
```

%%
TALKING POINTS:
Git works locally on your computer. GitHub is a cloud service that hosts Git repositories. Think of GitHub like Dropbox for Git repositories.

WHY GITHUB:
- Backup: Your code is safe even if your laptop dies
- Sharing: Others can access your code
- Collaboration: Multiple people can work on the same project
- Portfolio: Showcase your work to employers

COMMANDS EXPLAINED:
- `remote add` - Tells Git where your GitHub repository is
- `push` - Uploads your commits to GitHub
- `pull` - Downloads commits from GitHub

COLLABORATION WORKFLOW:
1. Pull latest changes from GitHub
2. Create a branch for your work
3. Make commits
4. Push your branch to GitHub
5. Create a Pull Request (code review)
6. Merge into main

SHOW:
Demonstrate pushing a repository to GitHub. Show the GitHub interface with commits, branches, and files.

TIME: 5 minutes
%%

---

## Common Scenarios & Solutions

**Problem:** "I made a mistake in my last commit"
```bash
git commit --amend
```

**Problem:** "I want to undo my last commit"
```bash
git reset HEAD~1
```

**Problem:** "I need to see what changed"
```bash
git diff
```

**Problem:** "I'm lost, what state am I in?"
```bash
git status
```

%%
TALKING POINTS:
Don't panic when things go wrong! Git has solutions for almost everything. These are the most common situations you'll face.

AMEND:
Forgot to include a file in your commit? Or typo in the message? Amend lets you modify the last commit.

RESET:
Made a commit too early? Reset undoes it, keeping your changes in the working directory. You can re-stage and re-commit.

DIFF:
Shows exactly what lines changed. Helpful before committing to review your work.

STATUS:
Your best friend! When confused, run `git status`. It tells you what state you're in and suggests next steps.

REASSURE:
Git seems scary at first, but it's hard to permanently lose work. There's almost always a way to recover.

ENCOURAGE QUESTIONS:
"What scenarios are you worried about? Let's talk through them."

TIME: 4 minutes
%%

---

## Practice Project

**Your challenge:**
1. Create a new repository
2. Make 3 commits with meaningful messages
3. Create a branch and make changes
4. Push to GitHub

![Checklist showing the steps to complete]

**Need help?** Raise your hand!

%%
DELIVERY:
Give them 15-20 minutes of hands-on practice. Circulate to help.

PROVIDE GUIDANCE:
Suggest a simple project: Create a personal website with index.html, style.css, and about.html.

SUCCESS CRITERIA:
By the end, they should have:
- A GitHub repository with their project
- At least 3 commits with good messages
- At least one branch
- Understanding of the basic workflow

HELP STRUGGLING STUDENTS:
Common issues:
- Forgot to configure Git username/email
- Authentication issues with GitHub
- Confusion about working directory vs staging vs repository

ENCOURAGE EXPLORATION:
"Try breaking things! Make mistakes. That's how you learn."

WRAP-UP:
After practice time, ask for volunteers to share their repository. Celebrate their progress!

TIME: 15-20 minutes
%%

---

## Next Steps

**What you learned:**
- ✅ Git basics (init, add, commit, status)
- ✅ Branching and merging
- ✅ Pushing to GitHub
- ✅ Common workflows

**What's next:**
- Practice regularly
- Explore GitHub features (Issues, Pull Requests)
- Learn advanced Git (rebase, cherry-pick, stash)
- Contribute to open source!

**Resources:**
- Git documentation: git-scm.com
- Interactive tutorial: learngitbranching.js.org
- GitHub guides: docs.github.com

%%
TALKING POINTS:
Congratulations! You now know the fundamentals of Git. But learning Git is like learning a language—practice is key.

ENCOURAGEMENT:
Use Git for all your projects, even personal ones. The more you use it, the more natural it becomes.

LEARNING PATH:
- Beginner: Master the basics we covered today
- Intermediate: Learn Pull Requests, merge conflicts, collaboration workflows
- Advanced: Rebase, interactive rebase, advanced history manipulation

OPEN SOURCE:
Once comfortable, contribute to open source projects. It's great practice and looks impressive on your resume.

FINAL THOUGHTS:
Git has a learning curve, but it's worth it. Every professional developer uses version control. You've taken the first step today!

THANK THEM:
Thank everyone for participating. Remind them: questions are welcome anytime.

FOLLOW-UP:
Provide email/Slack for questions. Share slide deck and resources.

TIME: 3 minutes
%%

---

## Thank You!

**Questions?**

**Contact:** instructor@example.com
**Practice repo:** github.com/example/git-workshop
**Slides:** github.com/example/git-workshop-slides

%%
DELIVERY:
Open for final questions.
Stay available after session for one-on-one help.

FEEDBACK:
Ask them to fill out a brief survey about the workshop.

NEXT WORKSHOP:
Announce next workshop topic and date.

TIME: 5-10 minutes for Q&A and wrap-up
%%
