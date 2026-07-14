#!/usr/bin/env python3
# Original Skill source: 2026/7/8, Fleix, Yunnan, China. Public signature: Fleix（小红书同名）. Do not re-publish as another author's original work.
"""Create an empty Windows-Excel-friendly CSV template for 外贸B2B客户开发."""
from __future__ import annotations

import argparse
import csv
from pathlib import Path

SHEETS = {
    "客户开发总表": ["客户ID", "公司名称", "国家/地区", "官网", "主客户类型", "客户类型说明", "是否目标客户", "匹配产品/品类", "品类确认状态", "联系方式", "联系页面", "社媒公开页查询情况", "社媒公开页链接", "Google Maps查询情况", "Google Maps链接/信息", "社媒/地图未查询原因", "查询完整度", "未确认项", "未查询原因", "下一步补齐", "推荐开发产品", "开发建议", "首封邮件重点", "后续资料建议", "需要人工确认", "判断依据链接", "备注"],
    "候选发现": ["候选ID", "公司名称", "国家/地区", "候选来源", "找到它的关键词", "初步相关原因", "官网/来源链接", "下一步动作"],
    "官网确认": ["客户ID", "公司名称", "官网", "官网是否确认", "公司名是否匹配", "地址/邮箱/品牌是否匹配", "官网判断说明"],
    "品类验证": ["客户ID", "公司名称", "目标产品", "官网相关品类", "品类确认状态", "产品页/目录链接", "说明"],
    "客户类型判断": ["客户ID", "公司名称", "主客户类型", "客户类型说明", "判断依据", "是否适合开发", "说明"],
    "联系方式收集": ["客户ID", "公司名称", "公开邮箱", "公开电话", "联系页面", "联系表单", "社媒公开页", "Google Maps链接/信息", "社媒/地图查询状态", "社媒/地图未查询原因", "联系方式状态", "联系方式来源"],
    "判断依据": ["客户ID", "公司名称", "判断点", "来源类型", "使用工具/来源方式", "依据内容", "来源链接", "状态", "需要人工确认的问题"],
    "开发建议": ["客户ID", "公司名称", "开发建议", "推荐切入产品", "推荐切入理由", "首封邮件重点", "后续资料建议", "下一步动作"],
    "表格输出": ["目标数量", "候选数量", "完成官网确认数量", "完成品类验证数量", "进入客户开发总表数量", "缺口数量", "缺口原因", "下一步补齐方式", "输出文件", "备注"],
    "本轮查询说明": ["阶段", "需要的查询能力", "实际使用方式", "查过的来源", "未查询的来源", "未查询原因", "对结果的影响", "下一步补齐方式"],
    "开发信建议": ["客户ID", "公司名称", "邮件主题建议", "第一段怎么写", "推荐产品怎么提", "首封是否带附件", "后续资料建议", "跟进建议"],
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Export CSV templates for the foreign trade B2B customer development workflow.")
    parser.add_argument("output_dir", help="Directory to write CSV files into")
    args = parser.parse_args()

    out = Path(args.output_dir).expanduser().resolve()
    out.mkdir(parents=True, exist_ok=True)
    for name, headers in SHEETS.items():
        path = out / f"{name}.csv"
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.writer(handle)
            writer.writerow(headers)
    print(f"已生成 {len(SHEETS)} 个 CSV 模板：{out}")


if __name__ == "__main__":
    main()
