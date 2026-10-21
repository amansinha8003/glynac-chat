import { Attachment } from '@/types/chat';

export interface StreamOptions {
  prompt: string;
  attachments?: Attachment[];
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

const GUARANTEED_RESPONSE = `Under **FINRA Rule 2210(d)(1)**, member communications must never predict or guarantee future performance, nor make exaggerated or unwarranted claims [[cite:finra-2210-s4]].

### Prohibited & Permitted Phrasing Standards

| Phrasing Category | Regulatory Classification | Supervisory Action |
| :--- | :--- | :--- |
| **"Guaranteed Returns"** | **Strictly Prohibited** | Immediate supervisory redaction [[cite:finra-2210-s4]] |
| **"Downside Protection"** | Conditional with Disclosures | Permitted only with full option and derivative risks |
| **"Risk-Free Yield"** | **Misleading & Deceptive** | Statutory violation under SEC Reg BI |

### Mandatory Compliance Directives
* **Balanced Presentation**: Equal prominence must be given to potential risks as to rewards.
* **Principal Pre-Approval**: Series 24 review is compulsory prior to retail distribution.
* **Substantiation**: Maintain empirical basis for all projections and claims [[cite:finra-3110]].

\`\`\`json
{
  "ruleViolation": "FINRA_2210_PROMISSORY",
  "trigger": "guaranteed",
  "status": "REJECTED",
  "requiresPrincipalReview": true
}
\`\`\`

All promotional content must be archived under [[cite:sec-17a-4]].`;

const ADVERTISING_RESPONSE = `Under the **SEC Marketing Rule 206(4)-1** and **FINRA Rule 2210**, all public advertisements, social media posts, and client testimonials are strictly regulated [[cite:sec-206-4-1]].

### Key Compliance Standards

| Element | Mandated Requirement | Regulatory Reference |
| :--- | :--- | :--- |
| **Prominent Disclosures** | Clear and conspicuous statements at point of display | SEC Rule 206(4)-1 [[cite:sec-206-4-1]] |
| **Compensated Testimonials** | Explicit disclosure of cash or non-cash perks | SEC Marketing Rule [[cite:sec-206-4-1]] |
| **Fair & Balanced** | Equal emphasis on investment risk and market downside | FINRA Rule 2210 [[cite:finra-2210-s4]] |
| **Pre-Use Review** | Registered Principal (Series 24) pre-approval | FINRA Rule 3110 [[cite:finra-3110]] |

### Social Media Guardrails
* **Entanglement & Adoption**: Do not edit, like, or selectively feature third-party testimonials without full compliance disclosures.
* **Record Retention**: Archive all posts, edits, and direct messages across corporate channels [[cite:sec-17a-4]].
* **Bad Actor Check**: Confirm promoters are not subject to statutory disqualification.

\`\`\`json
{
  "channel": "social_media",
  "policy": "SEC_206_4_1_MARKETING",
  "containsTestimonial": true,
  "disclosureValidated": true,
  "approvedBySeries24": true
}
\`\`\`

Always verify state blue sky filing rules before national rollout.`;

const RETENTION_RESPONSE = `Under **SEC Rule 17a-4(f)** and **FINRA Rule 3110**, broker-dealers and advisers are required to archive all business-related electronic communications, including off-channel messaging platforms like WhatsApp [[cite:sec-17a-4]].

### Archiving & Retention Schedule

| Channel Type | Archival Mandate | Retention Standard |
| :--- | :--- | :--- |
| **Corporate Email & Messaging** | Continuous automatic ingestion | 3 years (2 years readily accessible) [[cite:sec-17a-4]] |
| **WhatsApp / SMS Off-Channel** | Prohibited unless captured | Immediate disciplinary and remediation audit [[cite:finra-3110]] |
| **Supervisory Logs** | Immutable principal reviews | 3 years in WORM-compliant storage [[cite:sec-17a-4]] |

### Immediate Remediation Workflow
* **Ingest Transcripts**: Extract off-channel message export, contact metadata, and attachments into the compliance archive.
* **Supervisory Audit**: Have the Series 24 principal review conversations for unapproved recommendations or material non-public information.
* **Written Supervisory Procedures (WSPs)**: Update attestations to reiterate prohibitions against unauthorized devices.

\`\`\`python
# Compliance ingest pipeline for unapproved off-channel records
def ingest_off_channel_record(custodian_id: str, chat_export: bytes):
    return worm_vault.archive(
        data=chat_export,
        custodian=custodian_id,
        rule_tag="SEC_17A_4",
        retention_years=3
    )
\`\`\`

Ensure complete audit trails are preserved for regulatory examination under [[cite:sec-17a-4]].`;

const DISCLOSURE_RESPONSE = `Under **FINRA Rule 2210** and **SEC Rule 206(4)-1**, disclosures must be clear, prominent, and placed in close proximity to relevant performance or testimonial claims [[cite:finra-2210-s4]].

### Disclosure Prominence Hierarchy

| Disclosure Type | Placement Standard | Regulatory Risk |
| :--- | :--- | :--- |
| **Performance Assumptions** | Immediately adjacent to figures | High [[cite:finra-2210-s4]] |
| **Material Conflicts of Interest** | Prominently displayed in relationship summary | High [[cite:sec-reg-bi]] |
| **Promoter Compensation** | Directly beneath testimonial text | High [[cite:sec-206-4-1]] |

### Disclosure Best Practices
* **No Buried Disclosures**: Disclaimers placed exclusively in footnotes or behind vague hyperlinks fail SEC prominence tests.
* **Equal Readability**: Use comparable font size, contrast, and visual emphasis.
* **Plain English Requirement**: Avoid ambiguous legalistic jargon that obscures customer risks.

\`\`\`json
{
  "disclosureStatus": "VERIFIED",
  "prominenceCheck": "PASSED",
  "proportionalSizing": true,
  "guideline": "FINRA-2210-STANDARDS"
}
\`\`\`

Retain proof of disclosure delivery in accordance with [[cite:sec-17a-4]].`;

const AML_RESPONSE = `Under **FINRA Rule 3310** and the **Bank Secrecy Act (BSA)**, financial firms must establish risk-based Anti-Money Laundering (AML) and Know Your Customer (KYC) programs [[cite:finra-3110]].

### Customer Identification & Monitoring Matrix

| Compliance Pillar | Regulatory Expectation | Verification Interval |
| :--- | :--- | :--- |
| **Customer Identification Program (CIP)** | Verify legal identity, DOB, tax ID | Account opening prior to trading |
| **Customer Due Diligence (CDD)** | Identify beneficial owners (25%+ equity) | Ongoing risk profiling |
| **Suspicious Activity Reports (SAR)** | Report transactions exceeding $5,000 threshold | File within 30 calendar days |

### Risk Mitigation Requirements
* **Independent AML Testing**: Conduct annual independent testing of AML procedures under FINRA Rule 3310.
* **Designated AML Officer**: Appoint a designated compliance officer reported to FINRA.
* **Enhanced Due Diligence (EDD)**: Screen politically exposed persons (PEPs) and high-risk foreign jurisdictions.

\`\`\`sql
-- Flag transactions requiring Enhanced Due Diligence (EDD) review
SELECT account_id, transaction_amount, risk_score, jurisdiction
FROM aml_monitoring_queue
WHERE transaction_amount >= 10000.00
  AND verification_status = 'PENDING';
\`\`\`

Document all investigations and retain supervisory logs under [[cite:finra-3110]].`;

const REGBI_RESPONSE = `Under **SEC Regulation Best Interest (Rule 15l-1)**, broker-dealers must act in the retail customer's best interest at the time of a recommendation, without placing their financial interest first [[cite:sec-reg-bi]].

### Four Core Reg BI Obligations

| Obligation Component | Requirement Detail | Compliance Standard |
| :--- | :--- | :--- |
| **Disclosure Obligation** | Deliver Form CRS and detail fees, conflicts | Prior to or at earliest recommendation [[cite:sec-reg-bi]] |
| **Care Obligation** | Evaluate costs, risks, and reasonable alternatives | Customer-specific profile analysis |
| **Conflict Obligation** | Eliminate or mitigate material incentives | Written supervisory policies |
| **Compliance Obligation** | Maintain Written Supervisory Procedures (WSPs) | Regular supervisory audits [[cite:finra-3110]] |

### Operational Implementation
* **Cost Comparison**: Document why the selected product was favored over reasonably available lower-cost alternatives.
* **Mitigate Quota Pressures**: Eliminate sales contests and volume-based bonuses that create conflicts of interest.
* **Record Delivery**: Maintain electronic records confirming receipt of Form CRS [[cite:sec-17a-4]].

\`\`\`sql
SELECT client_id, representative_id, form_crs_delivered, cost_justification_logged
FROM recommendations_audit
WHERE customer_type = 'RETAIL'
  AND compliance_verified = TRUE;
\`\`\`

Verify policies match supervisory review requirements under [[cite:sec-reg-bi]].`;

const PERFORMANCE_RESPONSE = `Under the **SEC Marketing Rule 206(4)-1** and **FINRA Rule 2210**, presentations of investment performance are subject to strict calculation and presentation standards [[cite:sec-206-4-1]].

### Performance Presentation Rules

| Metric Type | Mandatory Standard | Regulatory Citation |
| :--- | :--- | :--- |
| **Gross vs. Net Performance** | Net performance must be presented with equal prominence | SEC Rule 206(4)-1 [[cite:sec-206-4-1]] |
| **Prescribed Time Periods** | 1-, 5-, and 10-year annualized returns required | FINRA Rule 2210 [[cite:finra-2210-s4]] |
| **Hypothetical / Backtested** | Prohibited for general retail unless policies restrict audience | SEC Marketing Rule [[cite:sec-206-4-1]] |

### Performance Checklist
* **Fee Deduction**: Ensure management fees, advisory charges, and transaction costs are subtracted in net return charts.
* **Benchmark Alignment**: Benchmark indices must be representative and objectively chosen.
* **Prohibited Guarantees**: Never imply future results based on historical performance [[cite:finra-2210-s4]].

\`\`\`json
{
  "performanceAudit": "MKT-PERF-CHECK",
  "grossPresented": true,
  "netPresentedWithEqualProminence": true,
  "timeframes": ["1Y", "5Y", "10Y"],
  "complianceApproved": true
}
\`\`\`

All performance calculations must be substantiable from books and records under [[cite:sec-17a-4]].`;

const SUITABILITY_RESPONSE = `Under **FINRA Rule 2111**, broker-dealers must establish reasonable basis and customer-specific suitability before recommending any securities transaction or investment strategy [[cite:finra-2111]].

### Three Suitability Tiers

| Suitability Tier | Scope of Requirement | Primary Authority |
| :--- | :--- | :--- |
| **Reasonable-Basis** | Diligence into product structure and inherent risks | FINRA Rule 2111 [[cite:finra-2111]] |
| **Customer-Specific** | Match strategy to individual customer profile and goals | FINRA Rule 2111 [[cite:finra-2111]] |
| **Quantitative** | Prevent churning or excessive trading frequency | FINRA Rule 2111 & Reg BI [[cite:sec-reg-bi]] |

### Suitability Review Checklist
* **Profile Attributes**: Document age, investment horizon, liquidity needs, net worth, and risk tolerance.
* **Complex Products**: Apply heightened supervisory review for structured notes, leveraged ETFs, and alternative investments.
* **Institutional Exemption**: Verify explicit waiver of customer-specific suitability for qualifying institutional accounts.

\`\`\`sql
-- Verify suitability profile freshness before executing advisory recommendations
SELECT account_id, last_suitability_update, risk_profile, suitability_approved
FROM client_accounts
WHERE account_status = 'ACTIVE'
  AND DATEDIFF(day, last_suitability_update, CURRENT_DATE) <= 365;
\`\`\`

Retain signed suitability attestations according to [[cite:finra-3110]].`;

const GREETING_RESPONSE = `Hello! I am your regulatory compliance assistant, specialised in **SEC** and **FINRA** rules, supervisory procedures, and communications review.

Here are three compliance questions you can ask me:
* **Marketing & Testimonials**: "Can our advisors post client testimonials on LinkedIn?"
* **Off-Channel Communications**: "What are our SEC record retention rules for WhatsApp messaging?"
* **Suitability & Reg BI**: "How do Reg BI conflicts of interest differ from FINRA Rule 2111?"`;

function getFallbackResponse(prompt: string): string {
  const shortQuestion = prompt.trim().replace(/\s+/g, ' ').slice(0, 70);
  return `You asked about: **"${shortQuestion}"**

I am specialised in **SEC** and **FINRA** regulatory compliance for wealth managers, broker-dealers, and registered investment advisers. I cannot answer general topics outside compliance and supervisory scope.

Here are three compliance questions you can ask me:
* **Marketing & Testimonials**: "Can our advisors post client testimonials on LinkedIn?"
* **Off-Channel Communications**: "What are our SEC record retention rules for WhatsApp messaging?"
* **Suitability & Reg BI**: "How do Reg BI conflicts of interest differ from FINRA Rule 2111?"`;
}

function getResponseForPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  const lower = trimmed.toLowerCase();

  // 1. Generic greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy)([\s!.,?]|$)/i.test(trimmed)) {
    return GREETING_RESPONSE;
  }

  // 2. Guaranteed
  if (lower.includes('guaranteed')) {
    return GUARANTEED_RESPONSE;
  }

  // 3. Advertising, Social Media, Testimonials
  if (lower.includes('advertis') || lower.includes('social media') || lower.includes('testimonial')) {
    return ADVERTISING_RESPONSE;
  }

  // 4. Retention, WhatsApp, Off-channel
  if (lower.includes('retention') || lower.includes('whatsapp') || lower.includes('off-channel')) {
    return RETENTION_RESPONSE;
  }

  // 5. Disclosure
  if (lower.includes('disclosure')) {
    return DISCLOSURE_RESPONSE;
  }

  // 6. KYC, AML
  if (/\bkyc\b/i.test(trimmed) || /\baml\b/i.test(trimmed) || lower.includes('anti-money laundering')) {
    return AML_RESPONSE;
  }

  // 7. Reg BI
  if (lower.includes('reg bi') || lower.includes('regulation best interest')) {
    return REGBI_RESPONSE;
  }

  // 8. Performance
  if (lower.includes('performance')) {
    return PERFORMANCE_RESPONSE;
  }

  // 9. Suitability
  if (lower.includes('suitability')) {
    return SUITABILITY_RESPONSE;
  }

  // 10. General FINRA / SEC mentions
  if (lower.includes('finra')) {
    return GUARANTEED_RESPONSE;
  }
  if (lower.includes('sec')) {
    return ADVERTISING_RESPONSE;
  }

  // 11. Polite fallback with restated question and no citation
  return getFallbackResponse(prompt);
}

export async function streamMockResponse({
  prompt,
  attachments,
  onChunk,
  signal,
}: StreamOptions): Promise<void> {
  let fullText = getResponseForPrompt(prompt);

  if (attachments && attachments.length > 0) {
    const fileList = attachments.map((a) => `**"${a.name}"**`).join(', ');
    const prefix = `I reviewed the attached document(s): ${fileList}.\n\n`;
    fullText = prefix + fullText;
  }

  let i = 0;

  while (i < fullText.length) {
    if (signal?.aborted) {
      break;
    }

    // 2-6 characters chunk
    const chunkSize = Math.floor(Math.random() * 5) + 2;
    const chunk = fullText.slice(i, i + chunkSize);
    i += chunkSize;

    onChunk(chunk);

    // 15-30ms delay
    const delay = Math.floor(Math.random() * 16) + 15;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
