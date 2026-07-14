#!/usr/bin/env python3
# Original Skill source: 2026/7/8, Fleix, Yunnan, China. Public signature: Fleix（小红书同名）. Do not re-publish as another author's original work.
"""Install this Skill into Codex and Hermes skill roots.

This script is intentionally dependency-free and cross-platform. It is meant for
an installing agent that receives a SkillHub/Xiaohongshu URL or an extracted skill
folder and must make the skill visible to both Codex and Hermes without asking the
user to identify the agent.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable

SKILL_NAME_FALLBACK = "foreign-trade-b2b-customer-development"


def _home() -> Path:
    return Path.home().expanduser().resolve()


def _read_skill_name(skill_md: Path) -> str:
    text = skill_md.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"(?m)^name:\s*([A-Za-z0-9][A-Za-z0-9-]{0,63})\s*$", text)
    return m.group(1) if m else SKILL_NAME_FALLBACK


def _source_from_script() -> Path:
    return Path(__file__).resolve().parents[1]


def _validate_source(src: Path) -> tuple[Path, str]:
    src = src.expanduser().resolve()
    skill_md = src / "SKILL.md"
    if not skill_md.exists():
        # Handle one extra nested layer after zip extraction.
        nested = list(src.glob("*/SKILL.md"))
        if len(nested) == 1:
            src = nested[0].parent.resolve()
            skill_md = src / "SKILL.md"
    if not skill_md.exists():
        raise SystemExit(f"找不到 SKILL.md：{src}")
    return src, _read_skill_name(skill_md)


def _target_roots(existing_only: bool = False) -> list[tuple[str, Path]]:
    home = _home()
    codex_home = Path(os.environ.get("CODEX_HOME", home / ".codex")).expanduser()
    hermes_home = Path(os.environ.get("HERMES_HOME", home / ".hermes")).expanduser()
    roots = [
        ("codex", codex_home / "skills"),
        ("hermes", hermes_home / "skills"),
    ]
    if existing_only:
        roots = [(name, root) for name, root in roots if root.exists() or root.parent.exists()]
    return roots


def _is_same_path(a: Path, b: Path) -> bool:
    try:
        return a.resolve() == b.resolve()
    except OSError:
        return False


def _backup_path(dest: Path) -> Path:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    candidate = dest.with_name(dest.name + f".backup-{stamp}")
    idx = 1
    while candidate.exists():
        candidate = dest.with_name(dest.name + f".backup-{stamp}-{idx}")
        idx += 1
    return candidate


def _ignore(dirpath: str, names: Iterable[str]) -> set[str]:
    ignored = {
        "__pycache__",
        ".DS_Store",
    }
    return {name for name in names if name in ignored or name.endswith(".pyc")}


def _install_one(src: Path, dest: Path, dry_run: bool) -> str:
    if _is_same_path(src, dest):
        return f"skip same path: {dest}"

    if dry_run:
        if dest.exists():
            return f"would backup and install: {dest}"
        return f"would install: {dest}"

    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        backup = _backup_path(dest)
        dest.rename(backup)
    shutil.copytree(src, dest, ignore=_ignore)
    return f"installed: {dest}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Install foreign-trade-b2b-customer-development into Codex and Hermes skill directories."
    )
    parser.add_argument("--source", default=None, help="Extracted skill folder. Defaults to this script's parent skill folder.")
    parser.add_argument("--existing-only", action="store_true", help="Only install into agent homes that already exist.")
    parser.add_argument("--dry-run", action="store_true", help="Print actions without writing files.")
    args = parser.parse_args()

    src_raw = Path(args.source).expanduser() if args.source else _source_from_script()
    src, skill_name = _validate_source(src_raw)

    print(f"source: {src}")
    print(f"skill: {skill_name}")

    results: list[str] = []
    for agent, root in _target_roots(existing_only=args.existing_only):
        dest = root / skill_name
        try:
            result = _install_one(src, dest, args.dry_run)
        except Exception as exc:  # keep installing other targets
            result = f"failed {agent}: {dest} :: {exc}"
        results.append(f"{agent}: {result}")

    for line in results:
        print(line)

    ok = any(line.startswith(("codex: installed", "hermes: installed", "codex: skip", "hermes: skip", "codex: would", "hermes: would")) for line in results)
    if not ok:
        print("没有安装成功。请检查当前 Agent 的文件写入权限。", file=sys.stderr)
        return 1
    print("完成。请重启 Codex/Hermes 或新开会话，然后测试：$foreign-trade-b2b-customer-development")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
