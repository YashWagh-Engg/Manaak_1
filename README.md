# Maanak (मानक) — Legal Metrology Compliance Portal

An official-grade statutory compliance inspection and audit platform built for the **Department of Consumer Affairs**, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.

Maanak automates statutory compliance audits for pre-packaged commodities under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)**.

---

## 🏛️ Statutory Framework & Features

### 1. Gemini Multimodal Vision Extraction
- Ingests photographs of packaging labels via camera capture or file upload.
- Uses **Gemini Multimodal Vision** (`gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-flash-latest`) to extract:
  - **Rule 6(1)(e):** Maximum Retail Price (MRP) & "inclusive of all taxes" statement
  - **Rule 6(1)(c):** Net quantity with standard metric units (g, kg, ml, l)
  - **Rule 6(1)(a):** Name, complete address, and contact details of the manufacturer, packer, or importer
  - **Rule 6(1)(d):** Month and year of manufacture/pre-packing
  - **Rule 6(1)(h):** Consumer care phone number and email address
  - **Rule 6(1)(g):** Country of origin declaration
- **Fallback Transparency:** When `GEMINI_API_KEY` is not present or an API call fails, the portal displays a visible **Fallback Benchmark Banner** indicating that standard synthetic test benchmark declarations are being used for rule engine evaluation.

### 2. Rule 6 Mandatory Declarations Checklist
- Evaluates 7 statutory declarations required on every pre-packaged commodity.
- Flags omissions, partial declarations, non-standard abbreviations, or missing tax qualifiers.

### 3. Rule 7 & 8 Font Height Millimeter Calibration
- Calibrates physical pixel bounding boxes into millimeters using package dimensions.
- Compares measured numeral heights against statutory **Table 1** minimum millimeter thresholds based on net quantity brackets:
  - $\le 50\text{g/ml}$: Minimum $1.0\text{ mm}$
  - $50\text{g} - 200\text{g/ml}$: Minimum $2.0\text{ mm}$
  - $200\text{g} - 1\text{kg/l}$: Minimum $4.0\text{ mm}$
  - $> 1\text{kg/l}$: Minimum $6.0\text{ mm}$

### 4. Rule 26 Statutory Exemption Gate
- Automatically routes and documents exemptions from Chapter II:
  - **Rule 26(a):** Net quantity $\le 10\text{g}$ or $\le 10\text{ml}$
  - **Rule 26(b):** Agricultural produce packages exceeding $50\text{ kg}$
  - **Rule 26(c):** Fast food items packed across the counter in hotels and restaurants
  - **Rule 26(d):** Formulations scheduled under the Drug Price Control Order (DPCO)
  - **Rule 26(e):** Packages meant exclusively for industrial or institutional consumers

### 5. E-Commerce Dual-Pricing Cross-Check (Rule 18(2))
- Cross-checks packaging OCR MRP against online marketplace listing prices.
- Flags unfair trade practice and overcharging infractions where online price exceeds printed MRP.

### 6. Notice Grading & Compounding Calculation (Section 36(1))
- Grades violations into `MINOR`, `MODERATE`, and `SEVERE` categories.
- Calculates compounding fines under Section 36(1) of the Legal Metrology Act, 2009 (up to ₹25,000 for first offence, ₹50,000 for repeat offences).

### 7. Digital Show-Cause Notice & PDF Export
- Generates official Form 1 Inspection & Compounding Notices formatted to Government of India standards.

### 8. End-to-End Pipeline Blueprint Simulation
- Interactive diagnostic walkthrough demonstrating the complete 8-stage verification pipeline and statutory decision tree.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas API
- **Backend:** Express.js running on Node.js (Port 3000)
- **AI & Vision:** Google GenAI TypeScript SDK (`@google/genai`) with model cascade (`gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-flash-latest`)
- **PDF Generation:** Client-side HTML Canvas / jsPDF integration

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API key for multimodal vision extraction
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** If `GEMINI_API_KEY` is not provided, the application will automatically run in benchmark fallback mode with an amber notice banner in the UI.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 🇮🇳 Portal Aesthetics & Compliance
Built adhering to the **Guidelines for Indian Government Websites (GIGW)**:
- Primary Navy Blue (`#003366`) and Indian Saffron (`#FF9933`) color scheme
- High-contrast, WCAG AA accessible text and interactive states
- Standard Government of India masthead and institutional hierarchy stack
