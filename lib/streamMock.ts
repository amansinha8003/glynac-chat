export interface StreamOptions {
  prompt: string;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

const FINRA_RESPONSE = `Under **FINRA Rule 2210(d)(1)**, no member firm may make false, exaggerated, unwarranted, or misleading statements or claims, nor may they predict or guarantee future performance [[cite:finra-2210-s4]].

### Prohibited Practices & Risk Standards

| Terminology | Status | Supervisory Standard |
| :--- | :--- | :--- |
| **"Guaranteed Returns"** | **Strictly Prohibited** | Immediate supervisory rejection [[cite:finra-2210-s4]] |
| **"Downside Protected"** | Conditional | Permitted only with full option disclosures |
| **"Risk-Free Yield"** | **Strictly Prohibited** | Statutory violation under SEC Reg BI |

### Mandatory Compliance Directives
* **Balanced Presentation**: Equal prominence must be given to potential risks as to rewards.
* **Principal Pre-Approval**: Series 24 review is compulsory prior to retail distribution.
* **Substantiation**: Maintain empirical basis for all economic projections.

\`\`\`json
{
  "ruleId": "FINRA-2210-MKT",
  "flaggedTerm": "guaranteed",
  "severity": "CRITICAL_VIOLATION",
  "action": "REJECT_AND_LOG"
}
\`\`\`

All customer-facing materials require supervisory archiving under [[cite:finra-2210-s4]].`;

const SEC_RESPONSE = `Under **SEC Rule 206(4)-1** (the Marketing Rule) and **SEC Rule 17a-4**, investment advisers and broker-dealers must satisfy substantiation, recordkeeping, and testimonial disclosure requirements [[cite:sec-206-4-1]].

### Regulatory Requirements Summary

| Requirement | Rule Basis | Compliance Obligation |
| :--- | :--- | :--- |
| **Clear Disclosures** | SEC Rule 206(4)-1 | Prominent placement at mention [[cite:sec-206-4-1]] |
| **Books & Records** | SEC Rule 17a-4 | WORM format for 3+ years [[cite:sec-17a-4]] |
| **Conflict Elimination** | SEC Reg BI | Retail customer best interest standard |

### Operational Directives
* **Contemporaneous Records**: Log written approval before any promotional release.
* **Disqualification Verification**: Audit bad-actor status for all solicitors.
* **Electronic Retention**: Ensure off-channel communications are archived.

\`\`\`python
# Automated verification for SEC Rule 17a-4 WORM archiving
def audit_sec_compliance(record_id: str, custodian_id: str):
    return vault_client.verify_immutable_record(
        record_id=record_id,
        custodian=custodian_id,
        standard="SEC_17A_4"
    )
\`\`\`

Compliance teams must cross-verify records with [[cite:sec-17a-4]] prior to examination.`;

const SUITABILITY_RESPONSE = `Under **FINRA Rule 2111** and **SEC Regulation Best Interest (Reg BI)**, broker-dealers must establish a reasonable basis for customer recommendations [[cite:finra-2111]] and prioritize the retail customer's interest [[cite:sec-reg-bi]].

### Core Comparison Matrix

| Standard Dimension | FINRA Rule 2111 | SEC Reg BI (§ 240.15l-1) |
| :--- | :--- | :--- |
| **Target Audience** | All accounts | Retail customers only |
| **Duty of Care** | Reasonable-basis suitability | Eliminate or mitigate conflicts [[cite:sec-reg-bi]] |
| **Cost Evaluation** | General factor | Explicit comparison against alternatives |
| **Relationship Disclosure** | Not mandated under 2111 | Mandatory Form CRS delivery |

### Suitability Review Checklist
* **Financial Profile**: Verify investment horizon, liquidity needs, and tax bracket.
* **Reasonable-Basis Obligation**: Understand economic risks and product complexity [[cite:finra-2111]].
* **Supervisory Logging**: Require designated principal approval on complex products.

\`\`\`sql
-- Query recommendations lacking Form CRS delivery confirmation
SELECT account_id, rep_crd, recommendation_date
FROM client_recommendations
WHERE customer_type = 'RETAIL'
  AND form_crs_delivered = FALSE;
\`\`\`

Refer to supervisory procedures for compliance standards under [[cite:sec-reg-bi]].`;

const DEFAULT_RESPONSE = `Under current **SEC** and **FINRA** regulatory frameworks, all broker-dealer communications, advisory operations, and marketing activities are subject to comprehensive supervisory review [[cite:finra-2210-s4]].

### Supervisory Control Standards

| Control Area | Authority | Frequency |
| :--- | :--- | :--- |
| **Supervisory Procedures** | FINRA Rule 3110 | Continuous principal oversight [[cite:finra-3110]] |
| **Marketing Review** | SEC Rule 206(4)-1 | Prior to first distribution [[cite:sec-206-4-1]] |
| **Records Archiving** | SEC Rule 17a-4 | 3-year WORM storage [[cite:sec-17a-4]] |

### Action Items
* **Compliance Logging**: Maintain full audit trails for supervisory checks.
* **Principal Approval**: Obtain Series 24 sign-off for retail client materials.
* **Archival Ingestion**: Verify immutable storage across all communication channels.

\`\`\`bash
# Run compliance audit against broker-dealer communication archives
./scripts/audit-compliance.sh --scope full --standards FINRA,SEC
\`\`\`

Refer to firm WSPs for detailed instructions under [[cite:finra-3110]].`;

function getResponseForPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('guaranteed') || lower.includes('finra')) {
    return FINRA_RESPONSE;
  }
  if (lower.includes('sec')) {
    return SEC_RESPONSE;
  }
  if (lower.includes('suitability') || lower.includes('reg bi')) {
    return SUITABILITY_RESPONSE;
  }
  return DEFAULT_RESPONSE;
}

export async function streamMockResponse({ prompt, onChunk, signal }: StreamOptions): Promise<void> {
  const fullText = getResponseForPrompt(prompt);
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
