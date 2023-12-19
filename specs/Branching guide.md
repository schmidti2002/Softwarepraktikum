# Branching guide

## Must

- each task gets a task branch that is branched of from the main branch

- each subtask gets it's own branch that is branched of from the task branch

- no changes directly on the task branch as long as there are still subtask branches open

- one person per branch at a time

- No changes from other branches => wait for them to be merged & rebase

- PR into task branches should be reviewed by at least one team member

- PR into the main branch should be reviewed and tested by at least two people

## Maybe

- try to keep the branch your working on rebased on it's parent

- create a draft PR as soon as you create a branch

- try to push changes as often as possible (if it makes sense ofc)

- if you want to reformat files do so in a own PR to make it easier to see "real" changes in the code
