#!/usr/bin/env python3
"""Query the `links` table and plot links created per month over the past 12 months."""

import argparse
import os
import sys
from datetime import date

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import psycopg2
from dotenv import load_dotenv


def find_env_file(explicit_path: str | None) -> str | None:
    if explicit_path:
        return explicit_path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, "..", "..", "..", ".."))
    for name in (".env.local", ".env"):
        candidate = os.path.join(project_root, name)
        if os.path.isfile(candidate):
            return candidate
    return None


def last_12_months(today: date) -> list[tuple[int, int]]:
    """Return [(year, month), ...] for the past 12 months, oldest first, including current month."""
    months = []
    year, month = today.year, today.month
    for _ in range(12):
        months.append((year, month))
        month -= 1
        if month == 0:
            month = 12
            year -= 1
    months.reverse()
    return months


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="links_per_month.png", help="Path to save the PNG chart")
    parser.add_argument("--env-file", default=None, help="Path to .env file containing DATABASE_URL")
    args = parser.parse_args()

    env_path = find_env_file(args.env_file)
    if env_path:
        load_dotenv(env_path)
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in environment or env file.", file=sys.stderr)
        sys.exit(1)

    months = last_12_months(date.today())
    start_year, start_month = months[0]
    range_start = date(start_year, start_month, 1)

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT date_trunc('month', created_at)::date AS month, COUNT(*) AS count
                FROM links
                WHERE created_at >= %s
                GROUP BY month
                ORDER BY month
                """,
                (range_start,),
            )
            rows = cur.fetchall()
    finally:
        conn.close()

    counts_by_month = {(m.year, m.month): count for m, count in rows}
    counts = [counts_by_month.get((y, m), 0) for y, m in months]
    labels = [date(y, m, 1).strftime("%b %Y") for y, m in months]

    fig, ax = plt.subplots(figsize=(12, 6))
    ax.bar(labels, counts, color="#4f46e5")
    ax.set_xlabel("Month")
    ax.set_ylabel("Links Created")
    ax.set_title("Links Created Per Month (Past 12 Months)")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    fig.savefig(args.output, dpi=150)

    print(f"Saved chart to {os.path.abspath(args.output)}")
    print(f"Date range: {labels[0]} - {labels[-1]}")
    for label, count in zip(labels, counts):
        print(f"  {label}: {count}")


if __name__ == "__main__":
    main()
