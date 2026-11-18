#!/usr/bin/env bash
#
# Prints the readme.txt changelog entry for one plugin version, without its
# "= x.y.z =" heading. Used as the GitHub release notes for that version.
#
# Exits non-zero when the Changelog section has no entry for the version, or
# the entry is empty.
#
# Usage: changelog-for-version.sh <version> [readme-path]

set -euo pipefail

version="${1:?usage: changelog-for-version.sh <version> [readme-path]}"
readme="${2:-readme.txt}"

# Only lines inside "== Changelog ==" are considered. The entry runs from its
# "= <version> =" heading to the next version heading or the next "== ... =="
# section, with leading blank lines dropped. Command substitution drops the
# trailing ones.
notes="$(awk -v heading="= ${version} =" '
	{ sub(/\r$/, "") }
	/^== .* ==$/ {
		if (found) exit
		in_changelog = ($0 == "== Changelog ==")
		next
	}
	!in_changelog { next }
	$0 == heading { found = 1; next }
	found && /^= .* =$/ { exit }
	found && !started && /^[ \t]*$/ { next }
	found { started = 1; print }
' "$readme")"

if [ -z "$notes" ]; then
	echo "No changelog entry for ${version} in ${readme}" >&2
	exit 1
fi

printf '%s\n' "$notes"
