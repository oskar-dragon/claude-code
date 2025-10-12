class Ccf < Formula
  desc "CLI tool for Claude Code Flow"
  homepage "https://github.com/oskar-dragon/claude-code-flow"
  version "0.1.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/oskar-dragon/claude-code-flow/releases/download/v0.1.0/ccf-macos-arm64"
      sha256 "REPLACE_WITH_ARM64_SHA256"
    end

    on_intel do
      url "https://github.com/oskar-dragon/claude-code-flow/releases/download/v0.1.0/ccf-macos-x64"
      sha256 "REPLACE_WITH_X64_SHA256"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/oskar-dragon/claude-code-flow/releases/download/v0.1.0/ccf-linux-x64"
      sha256 "REPLACE_WITH_LINUX_SHA256"
    end
  end

  def install
    bin.install Dir["ccf-*"].first => "ccf"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/ccf --version")
  end
end
