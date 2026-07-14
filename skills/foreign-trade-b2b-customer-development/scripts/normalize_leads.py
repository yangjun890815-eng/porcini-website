#!/usr/bin/env python3
# Original Skill source: 2026/7/8, Fleix, Yunnan, China. Public signature: Fleix（小红书同名）. Do not re-publish as another author's original work.
"""Normalize and deduplicate a simple customer CSV by company name + website."""
from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from urllib.parse import urlparse


def norm_text(value: str) -> str:
    value = (value or "").strip().lower()
    value = re.sub(r"\s+", " ", value)
    return value


def norm_domain(url: str) -> str:
    raw = (url or "").strip()
    if not raw:
        return ""
    if "://" not in raw:
        raw = "https://" + raw
    host = urlparse(raw).netloc.lower().split("@")[-1].split(":")[0]
    return host.removeprefix("www.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Deduplicate leads by 公司名称 + 官网/domain.")
    parser.add_argument("input_csv")
    parser.add_argument("output_csv")
    args = parser.parse_args()

    in_path = Path(args.input_csv).expanduser().resolve()
    out_path = Path(args.output_csv).expanduser().resolve()

    with in_path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
        fieldnames = rows[0].keys() if rows else []

    seen = set()
    kept = []
    for row in rows:
        company = norm_text(row.get("公司名称", ""))
        domain = norm_domain(row.get("官网", ""))
        key = (company, domain)
        if key in seen:
            continue
        seen.add(key)
        kept.append(row)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(kept)
    print(f"输入 {len(rows)} 行，保留 {len(kept)} 行：{out_path}")


if __name__ == "__main__":
    main()
