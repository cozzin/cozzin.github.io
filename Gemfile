# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.4.1"
gem "jekyll-theme-chirpy", "~> 7.3", ">= 7.3.0"

group :test do
  gem "minitest", "~> 5.14"
  gem "html-proofer", "~> 5.0"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.2.0", :install_if => Gem.win_platform?

# Jekyll compatibility with Ruby 3.0
gem "webrick", "~> 1.9"
