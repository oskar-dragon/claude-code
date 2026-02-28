# Chezmoi Template System Reference

Files with the `.tmpl` suffix are processed as Go templates during `chezmoi apply`.

## Template Syntax

Chezmoi uses Go's `text/template` syntax:

- `{{ ... }}` — template action
- `{{- ... -}}` — trim whitespace around action
- `{{ /* comment */ }}` — comment

## Built-in Template Variables

### `.chezmoi.*` — System Variables

| Variable | Type | Description |
|----------|------|-------------|
| `.chezmoi.os` | string | OS: `darwin`, `linux`, `windows` |
| `.chezmoi.arch` | string | CPU arch: `amd64`, `arm64`, `arm` |
| `.chezmoi.hostname` | string | Machine name (up to first dot) |
| `.chezmoi.fqdnHostname` | string | Fully-qualified domain name |
| `.chezmoi.username` | string | Current user running chezmoi |
| `.chezmoi.uid` | string | User ID |
| `.chezmoi.group` | string | Primary group name |
| `.chezmoi.gid` | string | Primary group ID |
| `.chezmoi.homeDir` | string | Home directory path |
| `.chezmoi.sourceDir` | string | Source directory path |
| `.chezmoi.destDir` | string | Target directory path |
| `.chezmoi.sourceFile` | string | Current template path (relative to source) |
| `.chezmoi.targetFile` | string | Absolute path of target file |
| `.chezmoi.cacheDir` | string | Cache directory path |
| `.chezmoi.configFile` | string | Config file path |
| `.chezmoi.config` | object | Full config read from chezmoi.toml |
| `.chezmoi.version.version` | string | Chezmoi version number |
| `.chezmoi.osRelease` | object | `/etc/os-release` data (Linux only) |
| `.chezmoi.kernel` | object | `/proc/sys/kernel` data (Linux/WSL only) |

### Custom Data Variables (from `chezmoi.toml` `[data]` section)

| Variable | Type | Description |
|----------|------|-------------|
| `.git_email` | string | Git commit email |
| `.git_user` | string | Git username |
| `.work_computer` | bool | True on work machines |
| `.personal_computer` | bool | True on personal machines |
| `.use_secrets` | bool | True when 1Password integration enabled |
| `.is_ci_workflow` | bool | True in CI environments |

## Control Flow

### Conditionals

```go
{{ if .work_computer }}
[work-only configuration]
{{ end }}

{{ if eq .chezmoi.os "darwin" }}
[macOS configuration]
{{ else if eq .chezmoi.os "linux" }}
[Linux configuration]
{{ else }}
[other OS configuration]
{{ end }}

{{ if and .work_computer (eq .chezmoi.os "darwin") }}
[work macOS only]
{{ end }}

{{ if or .work_computer .personal_computer }}
[any machine type]
{{ end }}

{{ if not .work_computer }}
[non-work machines]
{{ end }}
```

### Loops

```go
{{ range $pkg := .packages.homebrew.common.formulae }}
"{{ $pkg }}"
{{ end }}

{{ range $key, $value := .packages }}
{{ $key }}: {{ $value }}
{{ end }}
```

### Whitespace Control

```go
{{- if .work_computer -}}
no extra whitespace around this block
{{- end -}}
```

## Template Functions

Chezmoi provides all standard Go template functions plus Sprig functions:

### String Functions

```go
{{ "hello" | upper }}              # "HELLO"
{{ "HELLO" | lower }}              # "hello"
{{ "  hello  " | trim }}           # "hello"
{{ "hello world" | replace " " "_" }}  # "hello_world"
{{ printf "%s@%s.com" .git_user "example" }}  # string formatting
{{ "hello" | contains "ell" }}     # true
{{ .git_email | splitList "@" | first }}  # get local part of email
```

### Conditionals & Logic

```go
{{ if eq .chezmoi.os "darwin" }}...{{ end }}    # equality
{{ if ne .chezmoi.os "windows" }}...{{ end }}   # not equal
{{ if gt 5 3 }}...{{ end }}                     # greater than
{{ if and .work_computer .use_secrets }}...{{ end }}  # AND
{{ if or .work_computer .personal_computer }}...{{ end }}  # OR
```

### Environment Variables

```go
{{ env "HOME" }}                   # Read environment variable
{{ env "PATH" | splitList ":" }}   # Split PATH into list
```

### 1Password Integration

When `.use_secrets = true`:

```go
{{ onepasswordRead "op://vault/item/field" }}
{{ (onepassword "item-id").password }}
{{ onepasswordDocument "document-id" }}
```

### File Functions

```go
{{ include "path/to/file" }}       # Include file contents
{{ glob "*.txt" }}                 # Glob file paths
```

## Reusable Templates

Templates in `.chezmoitemplates/` can be included in other templates:

```go
{{ template "shared_script_utils.bash" . }}
```

The `.` passes current data context to the template.

### Available Templates

- **`shared_script_utils.bash`** — Logging functions for scripts:
  - `header "message"` — Section headers
  - `notice "message"` — Info messages
  - `success "message"` — Success messages
  - `warning "message"` — Warnings
  - `error "message"` — Errors
  - `fatal "message"` — Error + exit
  - `_safeExit_` — Clean exit

## Template Debugging

### Testing expressions

```bash
# Test a simple expression
chezmoi execute-template '{{ .chezmoi.os }}'

# Test a conditional
chezmoi execute-template '{{ if .work_computer }}work{{ else }}personal{{ end }}'

# Test with data access
chezmoi execute-template '{{ .git_user }}'

# Show all available data
chezmoi data | jq .

# Preview processed template file
chezmoi cat ~/.gitconfig
```

## Common Patterns

### Machine-specific git config

```ini
[user]
    email = {{ .git_email }}
    name = {{ .git_user }}
{{ if .work_computer }}
    signingkey = WORK_GPG_KEY
{{ end }}
```

### OS-specific path

```bash
{{ if eq .chezmoi.os "darwin" }}
export HOMEBREW_PREFIX="/opt/homebrew"
{{ else }}
export HOMEBREW_PREFIX="/home/linuxbrew/.linuxbrew"
{{ end }}
```

### Iterating packages in a script

```bash
FORMULAE=(
{{ range $formula := .packages.homebrew.common.formulae }}
    "{{ $formula }}"
{{ end }}
)
```

### Secret injection (1Password)

```bash
export API_KEY="{{ onepasswordRead "op://Personal/MyApp/api-key" }}"
```

## Data Access

Custom data is defined in `.chezmoidata/*.toml` files and `.chezmoi.toml.tmpl`'s `[data]` section. All values merge into the template context.

To inspect all available data:

```bash
chezmoi data
chezmoi data | jq '.packages.homebrew.common'
```

## File Naming with Templates

A file can have multiple chezmoi prefixes combined with `.tmpl`:

```
private_dot_gitconfig.tmpl              → ~/.gitconfig (mode 0600, templated)
executable_dot_profile.tmpl             → ~/.profile (mode 0755, templated)
dot_config/git/config.tmpl              → ~/.config/git/config (templated)
```
