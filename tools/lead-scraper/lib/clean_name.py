#!/usr/bin/env python3
"""
Turn a Google Maps business name into the name a person would actually say.

Google Maps names are SEO real estate, not names. Measured over 1,799 real
scraped leads: 22% end in a legal suffix, 110 carry a " - keyword, keyword"
tail, 17 are pipe-stuffed, 47 are shouted in capitals. Dropping one of those
into "I made something for X" is the fastest way to look automated.

    "Premier Concrete Ltd - Ready Mix Concrete in West Bromwich, Concrete
     Pump Hire Services, Concrete Services in West Bromwich"   ->  Premier Concrete
    "MANCHESTER ROOFS LTD"                                     ->  Manchester Roofs
    "Manchester & Ashton Roofing Co.Ltd"                       ->  Manchester & Ashton Roofing

The rule is conservative on purpose: when a name is already how a person would
say it, this must return it untouched.
"""
import re

# Longest first so "Co. Ltd" loses "Ltd" then "Co.".
SUFFIXES = [
    "incorporated", "corporation", "limited", "company", "gmbh", "corp", "pty",
    "plc", "llp", "llc", "inc", "ltd", "srl", "bv", "nv", "ag", "pc", "lp", "co",
]
SUFFIX_RE = re.compile(
    r"[\s,]*\b(" + "|".join(SUFFIXES) + r")\s*\.?\s*$", re.I)

# A separator only counts when it has space on at least one side, so hyphenated
# names (Wal-Mart, C.B Roofing) survive.
TAIL_RE = re.compile(r"(?:\s+[-|/]\s*|\s*[-|/]\s+|\s*[\u2013\u2014]\s*|\s+:\s+)")

BRACKETS_RE = re.compile(r"\s*[\(\[\{][^\)\]\}]*[\)\]\}]")
WS_RE = re.compile(r"\s+")
EDGE_RE = re.compile(r"^[\s,\-&|/.]+|[\s,\-&|/]+$")

# Words that stay capitalised when we have to re-case a shouted name.
KEEP_UPPER = {"uk", "usa", "us", "ac", "hvac", "tv", "it", "bmw", "vw", "bbq", "dj"}
# Never capitalise these mid-name: "HOPWOOD ROOFING AND SONS" must not become
# "Hopwood Roofing And Sons".
SMALL_WORDS = {"and", "or", "the", "of", "for", "in", "at", "on", "to", "a", "an",
               "by", "with"}


def _recase_word(word, first):
    core = word.strip(".,&'")
    low = core.lower()
    if low in KEEP_UPPER:
        return word.upper()
    # An initialism has no vowel to speak of: KLA, S&R, JJP, CB. Shouting it back
    # is right; "Kla Paving" is not a real company.
    if core and len(core) <= 4 and not (set(low) & set("aeiou")):
        return word.upper()
    if low in SMALL_WORDS and not first:
        return word.lower()
    if "-" in word:                      # FAST-TECH -> Fast-Tech
        return "-".join(p.capitalize() for p in word.split("-"))
    if "'" in word:                      # o'brien -> O'Brien, joe's -> Joe's
        head, _, tail = word.partition("'")
        return head.capitalize() + "'" + (tail.capitalize() if len(tail) > 1 else tail)
    return word.capitalize()


def _recase(name):
    """Only touch casing when the original is shouting or entirely lowercase."""
    letters = [c for c in name if c.isalpha()]
    if not letters:
        return name
    shouting = all(c.isupper() for c in letters) and len(letters) > 3
    whispering = all(c.islower() for c in letters)
    if not (shouting or whispering):
        return name                      # already mixed case, leave it alone
    return " ".join(_recase_word(w, i == 0) for i, w in enumerate(name.split(" ")))


def clean_business_name(raw, max_words=8):
    """The name a person would type. Returns "" only if the input was empty."""
    name = (raw or "").strip()
    if not name:
        return ""
    original = name

    name = BRACKETS_RE.sub(" ", name)
    name = TAIL_RE.split(name)[0]        # drop the SEO tail
    name = name.split(",")[0]            # "Joe's Roofing, Birmingham" -> "Joe's Roofing"

    for _ in range(3):                   # "Roofing Co. Ltd" needs two passes
        stripped = SUFFIX_RE.sub("", name)
        if stripped == name:
            break
        name = stripped
    # "Co.Ltd" with no space is one token, so handle it directly.
    name = re.sub(r"\s*\bco\s*\.\s*ltd\s*\.?\s*$", "", name, flags=re.I)

    name = EDGE_RE.sub("", name)
    name = WS_RE.sub(" ", name).strip()

    # A very long name is a description, not a name. Keep the front of it.
    words = name.split(" ")
    if len(words) > max_words:
        name = " ".join(words[:max_words])

    name = _recase(name)
    name = EDGE_RE.sub("", name).strip()

    # Never hand back something empty or uselessly short: fall back to the
    # original rather than write "Hi, I made something for ." into an email.
    if len(name) < 2:
        return WS_RE.sub(" ", original).strip()
    return name


if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        print(clean_business_name(line.rstrip("\n")))
