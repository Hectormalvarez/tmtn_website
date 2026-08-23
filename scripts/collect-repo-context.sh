#!/usr/bin/env bash
set -euo pipefail

# Output file
OUTPUT_FILE="repos_context.md"
TARGET_USER="${GITHUB_USER:-Hectormalvarez}"

# Target repos needing context (customize or pass as arguments)
REPOS=(
  "humblelibrarysync"
  "laphost"
  "hadev-station"
  "basic-ad"
  "genwords"
  "palspantry"
  "python-static-site-generator"
  "readit-api"
  "text2"
)

# If repos passed as CLI args, use those instead
if [[ $# -gt 0 ]]; then
  REPOS=("$@")
fi

echo "# Repository Context Dump ($(date '+\%Y-\%m-\%d \%H:\%M:\%S'))" > "$OUTPUT_FILE"
echo "Target: $TARGET_USER" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"

for repo in "${REPOS[@]}"; do
  echo "[INFO] Fetching context for $repo..."
  
  {
    echo "## Repository: $repo"
    echo ""
    echo "### GitHub Metadata"
    gh repo view "$TARGET_USER/$repo" --json name,description,languages,repositoryTopics,homepageUrl --template '
- **Name:** {{.name}}
- **Current Description:** {{if .description}}{{.description}}{{else}}*(none)*{{end}}
- **Languages:** {{range .languages}}{{.node.name}} ({{.size}} bytes) {{end}}
- **Current Topics:** {{range .repositoryTopics}}{{.name}} {{else}}*(none)*{{end}}
- **Homepage:** {{if .homepageUrl}}{{.homepageUrl}}{{else}}*(none)*{{end}}
' || true

    echo ""
    echo "### Root Files & Structure"
    echo '```text'
    gh api "repos/$TARGET_USER/$repo/contents" --jq '.[].name' 2>/dev/null || echo "Unable to list contents"
    echo '```'

    echo ""
    echo "### Manifest / Config Snippets"
    # Check for package.json
    if gh api "repos/$TARGET_USER/$repo/contents/package.json" >/dev/null 2>&1; then
      echo "**package.json:**"
      echo '```json'
      gh api "repos/$TARGET_USER/$repo/contents/package.json" --jq '.content | @base64d' | jq '{name, description, scripts, dependencies, devDependencies}' 2>/dev/null || true
      echo '```'
    fi

    # Check for pyproject.toml / requirements.txt
    if gh api "repos/$TARGET_USER/$repo/contents/pyproject.toml" >/dev/null 2>&1; then
      echo "**pyproject.toml:**"
      echo '```toml'
      gh api "repos/$TARGET_USER/$repo/contents/pyproject.toml" --jq '.content | @base64d' 2>/dev/null || true
      echo '```'
    elif gh api "repos/$TARGET_USER/$repo/contents/requirements.txt" >/dev/null 2>&1; then
      echo "**requirements.txt:**"
      echo '```text'
      gh api "repos/$TARGET_USER/$repo/contents/requirements.txt" --jq '.content | @base64d' 2>/dev/null || true
      echo '```'
    fi

    echo ""
    echo "### README Preview (First 40 lines)"
    echo '```markdown'
    gh repo view "$TARGET_USER/$repo" --readme 2>/dev/null | head -n 40 || echo "*(No README found)*"
    echo '```'

    echo ""
    echo "---"
    echo ""
  } >> "$OUTPUT_FILE"

done

echo "[SUCCESS] Context collected in $OUTPUT_FILE"