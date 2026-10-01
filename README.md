# Insulin Supply Calculator

A simple one-page web app that estimates how many insulin vials or pens a patient needs for a given supply period (30 days by default).

## How it works

- Enter either the **total daily units**, or a **dose × frequency** (e.g. 10 units, 3 times per day or per week).
- Set the **days supply** and choose **vial** or **pen**.
- The app shows units per day, total units, and the number of containers needed (rounded up), plus units left over.

Assumes U-100 insulin (100 units/mL): a vial is 10 mL (1,000 units) and a pen is 3 mL (300 units).

> Estimates only, not medical advice. Opened vials and pens are generally discarded after about 28 days, so follow your prescriber's and pharmacist's instructions.

## Development

Built with [Next.js](https://nextjs.org), React, and Tailwind CSS.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
