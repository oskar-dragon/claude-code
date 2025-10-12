class Occ < Formula
  desc "CLI tool for Claude Code Project Management"
  homepage "https://github.com/oskar-dragon/claude-code"
  version "0.1.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/oskar-dragon/claude-code/releases/download/v0.1.0/occ-macos-arm64"
      sha256 "REPLACE_WITH_ARM64_SHA256"
    end

    on_intel do
      url "https://github.com/oskar-dragon/claude-code/releases/download/v0.1.0/occ-macos-x64"
      sha256 "REPLACE_WITH_X64_SHA256"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/oskar-dragon/claude-code/releases/download/v0.1.0/occ-linux-x64"
      sha256 "REPLACE_WITH_LINUX_SHA256"
    end
  end

  def install
    bin.install Dir["occ-*"].first => "occ"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/occ --version")
  end
end
