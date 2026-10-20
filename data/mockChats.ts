import { Thread } from '@/types/chat';
import { MOCK_CITATIONS, CITATIONS_BY_ID } from './mockCitations';
import { subDays, subHours } from 'date-fns';

const now = new Date();

export const MOCK_CHATS: Thread[] = [
  {
    id: 'thread-today-1',
    title: 'Social Media & Marketing Content Compliance',
    pinned: true,
    createdAt: subHours(now, 4).toISOString(),
    updatedAt: subHours(now, 2).toISOString(),
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content:
          'Can our wealth management team post testimonials from clients on LinkedIn if we include a standard disclaimer at the bottom?',
        createdAt: subHours(now, 4).toISOString(),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content:
          'Under the **SEC Marketing Rule 206(4)-1** and **FINRA Rule 2210**, testimonials are permitted only when specific mandatory disclosure conditions are satisfied. A generic disclaimer is **not** compliant.\n\n### Key Requirements Breakdown\n\n| Requirement | Standard | Enforcement Risk |\n| :--- | :--- | :--- |\n| **Clear & Prominent** | Disclosed at point of mention, not buried in footer | High [[cite:sec-206-4-1]] |\n| **Client Status** | State explicitly if individual is current client | Medium |\n| **Compensation** | Disclose cash or non-cash compensation provided | High [[cite:sec-206-4-1]] |\n| **Fair & Balanced** | Must balance risks against performance claims | High [[cite:finra-2210-s4]] |\n\n### Pre-Publication Checklist\n* **Substantiation**: Maintain contemporaneous records verifying all factual claims made in the testimonial.\n* **Disqualification**: Verify that the promoter is not subject to statutory disqualification under SEC bad actor provisions.\n* **Supervisor Sign-Off**: Principal pre-use approval is mandatory before any retail distribution.\n\nHere is an automated rule for your content filtering pipeline:\n\n```json\n{\n  "ruleId": "MKT-206-4-TESTIMONIAL",\n  "channels": ["linkedin", "twitter", "website"],\n  "requiredDisclosures": [\n    "client_status_declared",\n    "compensation_arrangement_detailed",\n    "material_conflicts_noted"\n  ],\n  "autoRejectOnMissing": true\n}\n```\n\nEnsure compliance teams log approval prior to public release under [[cite:finra-2210-s4]].',
        createdAt: subHours(now, 3).toISOString(),
        citations: [CITATIONS_BY_ID['sec-206-4-1'], CITATIONS_BY_ID['finra-2210-s4']],
        feedback: 'up',
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'Does this rule apply if the client posts unsolicited praise on our corporate page?',
        createdAt: subHours(now, 2).toISOString(),
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content:
          'Unsolicited third-party comments on an independent platform generally do not constitute an advertisement unless the firm **entangles** itself or **adopts** the content.\n\n* **Entanglement**: Involving firm personnel in preparing or directing the review.\n* **Adoption**: Liking, pinning, retweeting, or featuring the review on promotional materials.\n\nOnce adopted, all requirements of [[cite:sec-206-4-1]] and [[cite:finra-2210-s4]] immediately apply.',
        createdAt: subHours(now, 2).toISOString(),
        citations: [CITATIONS_BY_ID['sec-206-4-1'], CITATIONS_BY_ID['finra-2210-s4']],
      },
    ],
  },
  {
    id: 'thread-today-2',
    title: 'Off-Channel WhatsApp Retention Audit',
    pinned: false,
    createdAt: subHours(now, 6).toISOString(),
    updatedAt: subHours(now, 5).toISOString(),
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content:
          'We detected an advisor negotiating deal terms with an institutional client over WhatsApp. What are our immediate reporting and recordkeeping obligations?',
        createdAt: subHours(now, 6).toISOString(),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content:
          'Unarchived electronic communications relating to securities business violate **SEC Rule 17a-4(f)** and **FINRA Rule 3110**.\n\n### Mandatory Immediate Actions\n\n1. **Capture & Ingestion**: Export complete chat transcripts, media attachments, and metadata into a write-once-read-many (WORM) compliant archive [[cite:sec-17a-4]].\n2. **Supervisory Remediation**: Initiate internal review under Written Supervisory Procedures (WSPs) to assess whether trade recommendations occurred [[cite:finra-3110]].\n3. **Sanctions Check**: Determine disciplinary action according to your firm policy on unapproved messaging channels.\n\n| Dimension | Obligation | Retention Mandate |\n| :--- | :--- | :--- |\n| **WORM Compliance** | Audit-trail format verified | 3 years total (2 years readily accessible) [[cite:sec-17a-4]] |\n| **Supervisory Review** | Documented principal review | Ongoing compliance log [[cite:finra-3110]] |\n\n```python\n# Audit ingest script for unapproved channel remediation\ndef archive_off_channel_thread(chat_export_file: str, custodian_id: str):\n    metadata = extract_cryptographic_fingerprint(chat_export_file)\n    return vault_client.store_immutable(\n        payload=chat_export_file,\n        custodian=custodian_id,\n        rule_tag=\"SEC_17A_4\",\n        retention_years=3\n    )\n```',
        createdAt: subHours(now, 5).toISOString(),
        citations: [CITATIONS_BY_ID['sec-17a-4'], CITATIONS_BY_ID['finra-3110']],
      },
    ],
  },
  {
    id: 'thread-yesterday-1',
    title: 'Reg BI vs FINRA 2111 Suitability Comparison',
    pinned: true,
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        content:
          'Can you clarify how Reg BI conflicts of interest obligations differ from FINRA Rule 2111 suitability?',
        createdAt: subDays(now, 1).toISOString(),
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        content:
          'While **FINRA Rule 2111** focuses on whether an investment strategy is suitable for a client\'s profile, **SEC Regulation Best Interest (Reg BI)** imposes a higher standard of care and strict conflict mitigation obligations [[cite:sec-reg-bi]].\n\n### Core Comparison Table\n\n| Standard Dimension | FINRA Rule 2111 | SEC Reg BI (§ 240.15l-1) |\n| :--- | :--- | :--- |\n| **Target Audience** | All retail & institutional accounts | **Retail customers only** |\n| **Conflict Mitigation** | Disclosure recommended | **Mandatory mitigation or elimination** [[cite:sec-reg-bi]] |\n| **Cost Consideration** | Factor among many | **Explicit requirement to assess cost vs alternatives** |\n| **Form CRS Delivery** | Not mandated under 2111 | **Mandatory relationship summary** |\n\n* **Reasonable-Basis**: Both rules require due diligence into the product characteristics [[cite:finra-2111]].\n* **Customer-Specific**: Detailed investment profile analysis remains compulsory before recommendation.\n\n```sql\n-- Query retail account recommendations missing Form CRS acknowledgment\nSELECT account_id, rep_crd, recommendation_date\nFROM recommendations\nWHERE customer_type = \'RETAIL\'\n  AND form_crs_delivered = FALSE\n  AND recommendation_date >= DATEADD(day, -30, CURRENT_DATE);\n```',
        createdAt: subDays(now, 1).toISOString(),
        citations: [CITATIONS_BY_ID['sec-reg-bi'], CITATIONS_BY_ID['finra-2111']],
      },
    ],
  },
  {
    id: 'thread-days-ago-4',
    title: 'Hypothetical Performance Metrics in Pitch Decks',
    pinned: false,
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        content:
          'Can we present backtested model portfolio returns to retail prospects in our prospective client pitch deck?',
        createdAt: subDays(now, 4).toISOString(),
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        content:
          'The SEC severely restricts the distribution of **hypothetical performance** (including backtested, model, and targeted returns) under **SEC Rule 206(4)-1**.\n\n### Regulatory Barriers for Retail Distribution\n\n* **Targeted Audience Limitation**: Hypothetical performance may **not** be presented to mass retail audiences because firms cannot ensure recipients have the resources and analytical competence to understand the assumptions [[cite:sec-206-4-1]].\n* **Net of Fees Obligation**: Any performance presentation must show returns **net of all fees** with equal prominence to gross returns.\n* **Assumption Documentation**: All calculation methodologies, limitations, and rebalancing costs must be disclosed.\n\n| Audience Category | Hypothetical Returns Permitted? | Conditions |\n| :--- | :--- | :--- |\n| **Retail Prospects** | **Generally Prohibited** | High regulatory liability [[cite:sec-206-4-1]] |\n| **Institutional / QEP** | Permitted with policies | Documented recipient competence |\n\n```yaml\nperformance_validation_policy:\n  hypothetical_data: restricted\n  allowed_recipients:\n    - qualified_institutional_buyers\n    - qualified_purchasers\n  mandatory_attachments:\n    - fee_schedule_deduction_table\n    - benchmark_divergence_disclaimer\n```',
        createdAt: subDays(now, 4).toISOString(),
        citations: [CITATIONS_BY_ID['sec-206-4-1']],
      },
    ],
  },
  {
    id: 'thread-days-ago-6',
    title: 'Annual Written Supervisory Procedures (WSP) Review',
    pinned: false,
    createdAt: subDays(now, 6).toISOString(),
    updatedAt: subDays(now, 6).toISOString(),
    messages: [
      {
        id: 'msg-5-1',
        role: 'user',
        content:
          'What are the mandatory items that must be covered during our annual FINRA 3110 supervisory controls review?',
        createdAt: subDays(now, 6).toISOString(),
      },
      {
        id: 'msg-5-2',
        role: 'assistant',
        content:
          'Under **FINRA Rule 3110** and **Rule 3120**, member firms must test and verify their supervisory system annually and compile an executive report for senior leadership [[cite:finra-3110]].\n\n### Required Core Review Areas\n\n* **Supervisory Controls Testing**: Review written supervisory procedures for business lines, trading desks, and branch offices.\n* **Customer Complaints & Arbitrations**: Aggregate trend analysis on sales practice grievances.\n* **Electronic Communications & Correspondence**: Audit lexicons, sampling rates, and review queues [[cite:sec-17a-4]].\n* **Outside Business Activities (OBA)**: Cross-verify advisor disclosures against registered activities under FINRA Rule 3270.\n\n| Area of Supervision | Evaluation Frequency | Responsible Principal |\n| :--- | :--- | :--- |\n| **Trading Surveillance** | Daily / Weekly | Series 24 / Series 4 |\n| **Marketing & Advertising** | Prior to First Use | Series 24 [[cite:finra-2210-s4]] |\n| **Annual Compliance Report** | Annually | Chief Compliance Officer (CCO) |\n\n```bash\n# Run annual supervision audit script across branch communication logs\n./bin/audit-supervision --year 2026 --rule FINRA-3110 --output ./reports/wsp-summary.pdf\n```',
        createdAt: subDays(now, 6).toISOString(),
        citations: [CITATIONS_BY_ID['finra-3110'], CITATIONS_BY_ID['sec-17a-4'], CITATIONS_BY_ID['finra-2210-s4']],
      },
    ],
  },
];
