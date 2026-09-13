---
name: links-monthly-chart
description: Generate a bar chart PNG showing the number of links created per month over the past 12 months, by querying the project's Postgres database directly. Use this whenever the user asks for a chart, graph, or visualization of link creation activity, monthly link counts, link growth/trends, or wants to "see how many links were created" over recent months. Also use it if the user asks to plot, export, or visualize data from the `links` table.
---

# Links Monthly Chart

Produces a bar chart (PNG) of how many rows in the `links` table were created in each of the past 12 months, reading the database connection string from the project's environment file.

## When to use this

Trigger this skill for requests like "show me a chart of links created per month", "how many links were made each month this year", "plot link creation over the last year", or any request to visualize/export link-creation trends as an image.

## How it works

Use the bundled script `scripts/plot_monthly_links.py`. It:

1. Loads `DATABASE_URL` from `.env.local` (falls back to `.env`) in the project root.
2. Connects to Postgres and counts rows in `links` grouped by month, for the past 12 full months (including the current month), using `created_at`.
3. Fills in any months with zero links so the chart always has 12 bars, in chronological order.
4. Plots a bar chart with months on the x-axis (e.g. "Jan 2025") and link counts on the y-axis, and saves it as a PNG.

## Running it

```bash
python .agents/skills/links-monthly-chart/scripts/plot_monthly_links.py [--output OUTPUT_PATH] [--env-file PATH]
```

- `--output` (optional): where to save the PNG. Defaults to `links_per_month.png` in the current working directory.
- `--env-file` (optional): explicit path to the env file containing `DATABASE_URL`. Defaults to searching for `.env.local` then `.env` in the project root.

The script requires `psycopg2-binary`, `matplotlib`, and `python-dotenv`. If they aren't installed, install them first:

```bash
pip install psycopg2-binary matplotlib python-dotenv
```

After running, tell the user the output PNG path and confirm the date range covered.
