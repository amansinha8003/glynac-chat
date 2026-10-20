import { Citation } from '@/types/chat';

export const MOCK_CITATIONS: Citation[] = [
  {
    id: 'finra-2210-s4',
    label: 'FINRA Rule 2210(d)',
    source: 'FINRA Manual § 2210(d)(1) Content Standards',
    excerpt:
      'All member communications must be based on principles of fair dealing and good faith, must be fair and balanced, and must provide a sound basis for evaluating the facts in regard to any particular security or type of security, industry, or service. No member may make any false, exaggerated, unwarranted, promissory or misleading statement or claim.',
    docUrl: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210',
  },
  {
    id: 'sec-17a-4',
    label: 'SEC Rule 17a-4(f)',
    source: '17 CFR § 240.17a-4 Electronic Recordkeeping',
    excerpt:
      'Broker-dealers must preserve all electronic communications relating to their business as such for a period of not less than three years, the first two years in an easily accessible place. Records must be maintained in either write-once-read-many (WORM) format or an alternative audit-trail system ensuring verify-and-replay capabilities.',
    docUrl: 'https://www.ecfr.gov/current/title-17/section-240.17a-4',
  },
  {
    id: 'finra-2111',
    label: 'FINRA Rule 2111',
    source: 'FINRA Manual § 2111 Suitability Obligations',
    excerpt:
      'A member or an associated person must have a reasonable basis to believe that a recommended transaction or investment strategy involving a security or securities is suitable for the customer, based on the information obtained through the reasonable diligence of the member or associated person to ascertain the customer’s investment profile.',
    docUrl: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/2111',
  },
  {
    id: 'sec-206-4-1',
    label: 'SEC Rule 206(4)-1',
    source: '17 CFR § 275.206(4)-1 Investment Adviser Marketing',
    excerpt:
      'It is unlawful for any registered investment adviser to disseminate any advertisement that includes any untrue statement of a material fact, or omits to state a material fact necessary in order to make the statement made not misleading. Testimonials and endorsements require clear disclosure of compensation and material conflicts of interest.',
    docUrl: 'https://www.sec.gov/rules/final/2020/ia-5653.pdf',
  },
  {
    id: 'finra-3110',
    label: 'FINRA Rule 3110',
    source: 'FINRA Manual § 3110 Supervisory Systems',
    excerpt:
      'Each member shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations, and with applicable FINRA rules. Written Supervisory Procedures (WSPs) must specifically designate supervisory personnel and audit intervals.',
    docUrl: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/3110',
  },
  {
    id: 'sec-reg-bi',
    label: 'SEC Reg BI § 240.15l-1',
    source: '17 CFR § 240.15l-1 Regulation Best Interest',
    excerpt:
      'A broker, dealer, or natural person who is an associated person of a broker or dealer, when making a recommendation of any securities transaction or investment strategy to a retail customer, shall act in the best interest of the retail customer at the time the recommendation is made, without placing the financial interest ahead of the customer.',
    docUrl: 'https://www.sec.gov/rules/final/2019/34-86031.pdf',
  },
];

export const CITATIONS_BY_ID: Record<string, Citation> = MOCK_CITATIONS.reduce(
  (acc, citation) => {
    acc[citation.id] = citation;
    return acc;
  },
  {} as Record<string, Citation>
);
