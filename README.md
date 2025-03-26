# github-changelog-to-issues

## GitHub Changelog Action

This GitHub action uses Node.js to pull down the GitHub Changelog RSS feed and generate a report with new posts. The action can be used to keep track of new updates and changes in the GitHub Changelog.

### Usage

To use this action, create a workflow file (e.g., `.github/workflows/get-changelog.yml`) in your repository with the following content:

```yaml
name: Get Changelog

on:
  schedule: 
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Set up Node.js
        uses: actions/setup-node@v2

      - name: Run GitHub Changelog Action
        uses: ./action-directory
```

This workflow runs the GitHub Changelog Action daily at midnight (UTC) and generates a report with new posts from the GitHub Changelog RSS feed.
