#!/usr/bin/env python3
# Original Skill source: 2026/7/8, Fleix, Yunnan, China. Public signature: Fleix（小红书同名）. Do not re-publish as another author's original work.
"""Check whether a customer development CSV has basic source/basis fields filled."""
from __future__ import annotations

import argparse
import csv
from pathlib import Path

REQUIRED_COLUMNS = ["公司名称", "官网", "主客户类型", "匹配产品/品类", "品类确认状态", "社媒公开页查询情况", "Google Maps查询情况", "查询完整度", "未确认项", "未查询原因", "下一步补齐", "开发建议", "判断依据链接"]
EMPTY_VALUES = {"", "未找到", "未查询", "打不开", "需要人工确认", "信息不足"}


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate basic basis coverage in 客户开发总表 CSV.")
    parser.add_argument("input_csv")
    args = parser.parse_args()

    path = Path(args.input_csv).expanduser().resolve()
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        missing_cols = [col for col in REQUIRED_COLUMNS if col not in (reader.fieldnames or [])]
        if missing_cols:
            print("缺少字段：" + ", ".join(missing_cols))
            return
        rows = list(reader)

    issues = []
    for idx, row in enumerate(rows, start=2):
        for col in REQUIRED_COLUMNS:
            if (row.get(col) or "").strip() in EMPTY_VALUES:
                issues.append((idx, row.get("公司名称", ""), col))

    if not issues:
        print(f"检查通过：{len(rows)} 行都有基础判断字段。")
        return

    print(f"发现 {len(issues)} 个需要补充的位置：")
    for line, company, col in issues[:100]:
        print(f"第 {line} 行｜{company or '未填公司名'}｜{col}")
    if len(issues) > 100:
        print(f"还有 {len(issues) - 100} 个未显示。")


if __name__ == "__main__":
    main()
