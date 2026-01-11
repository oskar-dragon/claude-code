# ty-lsp

Python type checker (ty) from Astral for Claude Code - An extremely fast LSP alternative to Pyright.

## Overview

This plugin integrates [ty](https://github.com/astral-sh/ty), Astral's next-generation Python type checker, with Claude Code through Language Server Protocol (LSP). Built by the creators of Ruff and uv, ty provides lightning-fast type checking for Python codebases.

**Key features:**

- Extremely fast type checking (significantly faster than Pyright)
- Automatic connection when working with Python files
- Zero-configuration setup using uvx
- Supports both `.py` and `.pyi` files
- Real-time feedback integrated into Claude Code workflow

## Prerequisites

**Required:**

- **uv** - Python package installer and manager

**Installation:**

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Alternative: Using pip
pip install uv

# Alternative: Using Homebrew (macOS)
brew install uv
```

Verify installation:

```bash
uv --version
```

## Installation

### From Marketplace

```bash
# Add this marketplace (if not already added)
/plugin marketplace add oskar-dragon/claude-code

# Install ty-lsp plugin
/plugin install ty-lsp@claude-code
```

### Local Installation

```bash
# Clone or download this plugin
git clone https://github.com/oskar-dragon/claude-code.git
cd claude-code/plugins/ty-lsp

# Use with --plugin-dir flag
cc --plugin-dir /path/to/ty-lsp

# Or copy to project .claude-plugin directory
cp -r ty-lsp /path/to/your-project/.claude-plugin/
```

## Usage

Once installed, the ty LSP server automatically activates when you work with Python files in Claude Code. No manual configuration required.

**Automatic features:**

- Type checking runs in real-time as you edit Python code
- Type errors and warnings appear in Claude's context
- Works seamlessly with Claude's Python development capabilities

**Supported file types:**

- `.py` - Python source files
- `.pyi` - Python stub files

## How It Works

The plugin uses `uvx` to run ty without requiring manual installation:

```bash
uvx ty@latest server
```

**Benefits of uvx:**

- Always uses the latest version of ty
- No global installation required
- Isolated execution environment
- Works across different Python projects

## Comparison with Pyright

| Feature      | ty                    | Pyright           |
| ------------ | --------------------- | ----------------- |
| Speed        | Extremely fast        | Fast              |
| Installation | Via uvx (zero-config) | Requires npm/pip  |
| Maintenance  | Astral (active)       | Microsoft         |
| Ecosystem    | Ruff, uv family       | VS Code ecosystem |

## Troubleshooting

**LSP server not starting:**

1. Verify uv is installed:

   ```bash
   uv --version
   ```

2. Test ty manually:

   ```bash
   uvx ty@latest --version
   ```

3. Check Claude Code logs:
   ```bash
   claude --debug
   ```

**Type checking not working:**

1. Ensure you're working with `.py` or `.pyi` files
2. Restart Claude Code session
3. Verify ty can analyze your code:
   ```bash
   uvx ty@latest check your_file.py
   ```

**Performance issues:**

- ty is designed for speed, but very large codebases may still take time
- Consider using `.tyignore` file to exclude unnecessary directories
- Check if other LSP servers are running simultaneously

## Configuration

The plugin uses default ty configuration. For advanced ty configuration, create a `pyproject.toml` in your project root:

```toml
[tool.ty]
# Add ty-specific configuration here
# See: https://github.com/astral-sh/ty for options
```

## About ty

ty is developed by [Astral](https://astral.sh), the team behind:

- **Ruff** - Extremely fast Python linter
- **uv** - Ultra-fast Python package installer
- **Rye** - Python project management

Learn more:

- Homepage: https://github.com/astral-sh/ty
- Documentation: https://github.com/astral-sh/ty/issues/2230
- Astral: https://astral.sh

## License

This plugin is a community reference implementation for integrating ty with Claude Code. See the ty repository for ty's license.

## Contributing

This plugin is part of the [oskar-dragon/claude-code](https://github.com/oskar-dragon/claude-code) plugin marketplace. Contributions welcome!
