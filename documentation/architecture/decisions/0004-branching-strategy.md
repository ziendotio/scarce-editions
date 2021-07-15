# 4. Branching strategy

Date: 2021-06-16

## Status

Accepted

## Context

We build software that is continuously delivered. We typically don't have to support multiple versions of the software running in the wild.

## Decision

[Git flow][gitflow] is a popular branching strategy but is more suited to discreet releases. Since we only support a single version, some variation of a [thunk based development][thunkbased] is a better solution.

## Consequences

Supporting multiple versions of a project will be more complex. We can branch off a tag to produce a new version of a release simple enough. Merging those changes back into `main` will be a manual process and likely to lead to merge problems. 


[thunkbased]: https://trunkbaseddevelopment.com/
[gitflow]: https://nvie.com/posts/a-successful-git-branching-model/