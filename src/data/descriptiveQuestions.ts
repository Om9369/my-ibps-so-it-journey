// src/data/descriptiveQuestions.ts
export interface DescriptivePrompt {
  id: string;
  topic: string;
  module: string;
  questionText: string;
  targetWordCount: number;
  timeLimitMinutes: number;
  modelAnswer: string;
  keyEvaluationPoints: string[];
  difficulty: 'L2' | 'L3';
  examPriority: 4 | 5;
}

export const DESCRIPTIVE_PROMPTS: DescriptivePrompt[] = [
  {
    id: 'desc-tcp-handshake',
    topic: 'Computer Networks',
    module: 'Transport Layer Protocols',
    questionText: 'Explain the TCP Three-Way Handshake connection establishment process, sequence number synchronization, and its vulnerability to SYN Flood DDoS attacks in banking applications.',
    targetWordCount: 250,
    timeLimitMinutes: 15,
    difficulty: 'L2',
    examPriority: 5,
    keyEvaluationPoints: [
      'SYN packet sent by client with Initial Sequence Number (ISN_c)',
      'SYN-ACK response from server with its own ISN_s and Ack = ISN_c + 1',
      'ACK final reply from client acknowledging server sequence number',
      'SYN Flood attack mechanics (half-open connection queue starvation)',
      'Mitigations: SYN Cookies, firewalls, connection timeouts',
    ],
    modelAnswer: `The TCP Three-Way Handshake is the stateful connection establishment mechanism used by the Transmission Control Protocol (RFC 793) to synchronize initial sequence numbers (ISNs) and negotiate buffer parameters before reliable bidirectional data transmission begins.

Step 1: SYN (Synchronize)
The initiating client selects a random Initial Sequence Number (ISN_c) and transmits a TCP segment with the SYN control flag enabled to the destination server's listening port. The client enters the SYN-SENT state.

Step 2: SYN-ACK (Synchronize-Acknowledgment)
Upon receiving the SYN packet, the server allocates Transmission Control Block (TCB) memory and reserves connection resources in its backlog queue. It responds with a segment having both SYN and ACK flags set. The server advertises its own random sequence number (ISN_s) and acknowledges the client's packet with an acknowledgment number equal to ISN_c + 1. The server enters the SYN-RECEIVED state.

Step 3: ACK (Acknowledgment)
The client receives the SYN-ACK segment and replies with a final ACK packet containing acknowledgment number ISN_s + 1. Both host sockets transition into the ESTABLISHED state, enabling application-layer data flow (e.g., HTTPS in online banking).

Security Implications in Banking (SYN Flood):
In a SYN Flood DDoS attack, malicious actors transmit massive volumes of spoofed SYN packets without completing the third step (ACK). The server's half-open connection backlog table becomes completely exhausted, denying legitimate banking customers access. Mitigation techniques include enabling SYN Cookies (stateless sequence calculation without initial resource allocation), TCP backlog queue scaling, and edge Web Application Firewalls (WAF).`,
  },
  {
    id: 'desc-dbms-normalization',
    topic: 'DBMS',
    module: 'Database Normalization',
    questionText: 'Explain Database Normalization from 1NF through BCNF. Discuss why BCNF is stricter than 3NF and the trade-offs between normalization and query performance in banking transaction systems.',
    targetWordCount: 250,
    timeLimitMinutes: 15,
    difficulty: 'L3',
    examPriority: 5,
    keyEvaluationPoints: [
      'Definition of 1NF (atomicity), 2NF (full functional dependency), 3NF (transitive dependency removal)',
      'BCNF condition: in every functional dependency X -> Y, X must be a superkey',
      'Anomaly prevention (Insertion, Update, Deletion)',
      'Trade-offs: Join overhead in highly normalized schemas vs controlled denormalization for OLAP/reporting',
    ],
    modelAnswer: `Database Normalization is a systematic schema refinement methodology based on functional dependencies to minimize data redundancy and eliminate insertion, update, and deletion anomalies.

1. First Normal Form (1NF):
Eliminates repeating attribute groups. Every column must hold atomic (indivisible) values, and each record must have a unique identity.

2. Second Normal Form (2NF):
Satisfies 1NF and guarantees that every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies. This is relevant for composite primary keys.

3. Third Normal Form (3NF):
Satisfies 2NF and eliminates transitive dependencies (X -> Y and Y -> Z where Z is not part of any candidate key). A relation R is in 3NF if for every functional dependency X -> Y, either X is a superkey or Y is a prime attribute.

4. Boyce-Codd Normal Form (BCNF):
A stricter variant of 3NF. A relation is in BCNF if and only if for every non-trivial functional dependency X -> Y, X is strictly a superkey. In 3NF, Y could be a prime attribute even if X was not a superkey; BCNF disallows this, eliminating all redundancy based on functional dependencies.

Banking System Trade-offs:
In OLTP Core Banking Systems (CBS), 3NF/BCNF normalization is critical for accounts and ledger balance tables to ensure ACID compliance and prevent inconsistent financial balances. However, higher normalization increases table joins, impacting read latency. Consequently, banking analytical data warehouses (OLAP) selectively denormalize into Star/Snowflake schemas for high-speed reporting.`,
  },
  {
    id: 'desc-upi-processing',
    topic: 'Banking Technology',
    module: 'Digital Payments Architecture',
    questionText: 'Describe the architectural workflow of a Unified Payments Interface (UPI) transaction from sender to receiver. Highlight the roles of NPCI Switch, PSP Apps, Core Banking Systems, and 2-Factor Authentication.',
    targetWordCount: 250,
    timeLimitMinutes: 15,
    difficulty: 'L2',
    examPriority: 5,
    keyEvaluationPoints: [
      'Roles: Payer PSP app, Remitter Bank CBS, NPCI UPI Central Switch, Beneficiary Bank CBS, Payee PSP',
      'Virtual Payment Address (VPA) resolution without sharing raw bank account details',
      'Debit leg: MPIN validation via Common Library (CL) against Remitter CBS',
      'Credit leg: Real-time credit to Beneficiary account via IMPS rail',
      '2-Factor Authentication (Device binding + MPIN)',
    ],
    modelAnswer: `Unified Payments Interface (UPI), developed by the National Payments Corporation of India (NPCI), is an interoperable instant real-time payment architecture built on top of the Immediate Payment Service (IMPS) messaging rail.

Key Architectural Components:
1. Payer & Payee PSP Apps: Front-end applications (e.g., BHIM, Google Pay) providing user interface and Virtual Payment Address (VPA) resolution.
2. NPCI Central UPI Switch: Routes financial and non-financial requests between participant entities and manages clearing.
3. Remitter & Beneficiary Banks: Host account balances inside their Core Banking Solutions (CBS).

Transaction Execution Workflow:
1. Initiation & Addressing: The sender enters the payee's VPA (or scans a QR code) and specifies the amount. The payer PSP sends an address resolution request to the NPCI switch to verify the recipient's bank routing details.
2. Two-Factor Authentication (2FA): The transaction authenticates via device binding (SIM binding token) as Factor 1, and user entry of the 4/6-digit MPIN encrypted via the NPCI Common Library (CL) as Factor 2.
3. Debit Leg: NPCI transmits the debit authorization request to the Remitter Bank's CBS. The remitter bank validates the encrypted MPIN, verifies available funds, debits the account, and returns a successful debit response to NPCI.
4. Credit Leg: Upon confirmed debit, NPCI forwards a real-time credit instruction to the Beneficiary Bank's CBS, which immediately credits the payee's account.
5. Confirmation: NPCI broadcasts synchronous push notifications and SMS confirmations to both remitter and beneficiary through their respective PSP apps.`,
  },
  {
    id: 'desc-os-deadlocks',
    topic: 'Operating Systems',
    module: 'Process Synchronization & Concurrency',
    questionText: 'Analyze the four Coffman conditions necessary for a Deadlock to occur in an operating system. Compare Deadlock Prevention, Deadlock Avoidance (Banker\'s Algorithm), and Deadlock Detection.',
    targetWordCount: 250,
    timeLimitMinutes: 15,
    difficulty: 'L2',
    examPriority: 5,
    keyEvaluationPoints: [
      'Four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
      'Deadlock Prevention: Invaliding at least one of the 4 conditions',
      'Deadlock Avoidance: Banker\'s algorithm, Safe vs Unsafe states using available/max/allocation matrices',
      'Deadlock Detection & Recovery: Resource allocation graph cycle detection and process termination',
    ],
    modelAnswer: `A Deadlock is an operating system condition where a set of concurrent processes are permanently blocked because each process holds resources while waiting for other resources acquired by processes in the same set.

The Four Necessary Coffman Conditions:
1. Mutual Exclusion: At least one resource must be non-shareable.
2. Hold and Wait: A process holding at least one resource is currently requesting additional resources held by other processes.
3. No Preemption: Resources cannot be forcibly seized; they can only be released voluntarily by the holding process after task completion.
4. Circular Wait: A closed chain of processes exists {P0, P1, ..., Pn} such that P0 waits for a resource held by P1, and Pn waits for a resource held by P0.

Handling Strategies Comparison:
- Deadlock Prevention: Eliminates deadlock by designing system constraints that guarantee at least one Coffman condition cannot hold. For instance, imposing a global numerical ordering on all resource acquisitions structurally eliminates Circular Wait, though this reduces resource utilization.
- Deadlock Avoidance: Allows the four conditions to exist dynamically but tracks resource allocation state. The operating system uses algorithms such as Dijkstra's Banker's Algorithm to verify whether granting a request keeps the system in a "Safe State" (a state with at least one complete sequence where all processes can finish). If granting leads to an Unsafe State, the process is forced to wait.
- Deadlock Detection and Recovery: Grants requests optimistically without pre-checks. Periodically executes cycle-detection algorithms on the Resource Allocation Graph (Wait-For Graph). When detected, recovery proceeds via process termination or selective resource preemption with rollback.`,
  },
  {
    id: 'desc-cyber-pki',
    topic: 'Cybersecurity',
    module: 'Cryptography & Public Key Infrastructure',
    questionText: 'Explain the principles of Public Key Cryptography and Public Key Infrastructure (PKI). Detail how digital signatures ensure Confidentiality, Integrity, and Non-Repudiation in financial transmissions.',
    targetWordCount: 250,
    timeLimitMinutes: 15,
    difficulty: 'L3',
    examPriority: 5,
    keyEvaluationPoints: [
      'Asymmetric key pairs: Public key (distributed) and Private key (kept secret)',
      'Digital Signature mechanics: Hashing message, encrypting hash with sender private key',
      'Verification: Decrypting signature with sender public key, comparing computed hash',
      'PKI components: Certificate Authority (CA), Registration Authority (RA), X.509 format, CRL',
      'Guarantees: Authentication, Integrity, and Non-repudiation in electronic banking',
    ],
    modelAnswer: `Public Key Cryptography (Asymmetric Cryptography) utilizes mathematically linked key pairs: a public key that is openly distributed, and a private key that remains strictly confidential with the owner. The security is grounded in computationally hard mathematical trapdoor functions, such as large integer prime factorization (RSA) or discrete logarithms over elliptic curves (ECC).

Public Key Infrastructure (PKI):
PKI provides the institutional and technical framework for managing digital identities and certificate lifecycles. It binds public keys to verified legal entities via digital certificates (X.509 standard) signed by trusted third-party Certificate Authorities (CAs). A PKI ecosystem includes Registration Authorities (RAs) for identity validation, Certificate Revocation Lists (CRL/OCSP) for compromised key revocation, and secure hardware security modules (HSMs).

Digital Signature Mechanics in Banking:
1. The sender creates a fixed-length cryptographic hash (digest) of the financial payload using a collision-resistant algorithm such as SHA-256.
2. The sender encrypts the message digest using their own private key, forming the Digital Signature.
3. The receiver decrypts the signature using the sender's verified public key, retrieving the original digest.
4. The receiver computes an independent hash of the received payload and compares the two digests.

Core Security Guarantees:
- Integrity: Any modification of transaction parameters (e.g., account number or amount) alters the payload digest, causing signature validation to fail.
- Authentication: Successful decryption with the sender's public key proves the transmission originated from the holder of the corresponding private key.
- Non-Repudiation: Because only the sender possesses the private key, the sender cannot legally deny authorizing the electronic financial transaction.`,
  },
];
