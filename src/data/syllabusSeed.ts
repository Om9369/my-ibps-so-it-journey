// src/data/syllabusSeed.ts
import { SyllabusSubject, PreparationPhase, ConceptDifficulty, ExamPriority } from '../types/syllabus';

export const SYLLABUS_VERSION = '1.0.0';

/**
 * Helper to build concepts with default difficulty and examPriority
 */
function makeConcept(
  id: string,
  subtopicId: string,
  topicId: string,
  moduleId: string,
  subjectId: string,
  title: string,
  description: string,
  difficulty: ConceptDifficulty,
  examPriority: ExamPriority,
  prerequisiteIds: string[] = [],
  studyMins = 30,
  practiceMins = 20
) {
  return {
    id,
    subtopicId,
    topicId,
    moduleId,
    subjectId,
    title,
    description,
    difficulty,
    examPriority,
    prerequisiteIds,
    estimatedStudyMinutes: studyMins,
    estimatedPracticeMinutes: practiceMins,
  };
}

export const SEED_SUBJECTS: SyllabusSubject[] = [
  // 1. Computer Fundamentals
  {
    id: 'sub-comp-fund',
    name: 'Computer Fundamentals',
    code: 'CF',
    category: 'IT',
    weightageWeight: 1.1,
    description: 'Hardware basics, generations, CPU internal units, memory hierarchy, number systems and digital logic.',
    iconName: 'Cpu',
    modules: [
      {
        id: 'mod-cf-basics',
        subjectId: 'sub-comp-fund',
        name: 'Computer Basics & Architecture Intro',
        topics: [
          {
            id: 'top-cf-intro',
            moduleId: 'mod-cf-basics',
            subjectId: 'sub-comp-fund',
            name: 'Computer Basics',
            examPriority: 3,
            subtopics: [
              {
                id: 'subt-cf-intro-1',
                topicId: 'top-cf-intro',
                moduleId: 'mod-cf-basics',
                subjectId: 'sub-comp-fund',
                name: 'System Components & Functional Units',
                concepts: [
                  makeConcept('cnc-cf-1', 'subt-cf-intro-1', 'top-cf-intro', 'mod-cf-basics', 'sub-comp-fund', 'Computer Functional Block Diagram', 'Input, CPU (ALU, CU, Registers), Storage, and Output flow', 'L0', 3, []),
                  makeConcept('cnc-cf-2', 'subt-cf-intro-1', 'top-cf-intro', 'mod-cf-basics', 'sub-comp-fund', 'Computer Generations (1st to 5th)', 'Vacuum tubes, transistors, ICs, VLSI, ULSI & AI microprocessors', 'L1', 2, []),
                  makeConcept('cnc-cf-3', 'subt-cf-intro-1', 'top-cf-intro', 'mod-cf-basics', 'sub-comp-fund', 'Types of Computers', 'Micro, Mini, Mainframe, Supercomputer, and Embedded systems', 'L1', 2, []),
                ],
              },
            ],
          },
          {
            id: 'top-cf-cpu-units',
            moduleId: 'mod-cf-basics',
            subjectId: 'sub-comp-fund',
            name: 'CPU, ALU, Control Unit & Registers',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-cf-cpu-1',
                topicId: 'top-cf-cpu-units',
                moduleId: 'mod-cf-basics',
                subjectId: 'sub-comp-fund',
                name: 'Central Processing Core Units',
                concepts: [
                  makeConcept('cnc-cf-4', 'subt-cf-cpu-1', 'top-cf-cpu-units', 'mod-cf-basics', 'sub-comp-fund', 'Arithmetic Logic Unit (ALU)', 'Arithmetic & bitwise logical operations, flag registers', 'L1', 3, ['cnc-cf-1']),
                  makeConcept('cnc-cf-5', 'subt-cf-cpu-1', 'top-cf-cpu-units', 'mod-cf-basics', 'sub-comp-fund', 'Control Unit (Hardwired vs Microprogrammed)', 'Timing, control signals, opcode decoding and instruction sequencing', 'L2', 4, ['cnc-cf-4']),
                  makeConcept('cnc-cf-6', 'subt-cf-cpu-1', 'top-cf-cpu-units', 'mod-cf-basics', 'sub-comp-fund', 'CPU Dedicated Registers', 'PC, IR, MAR, MBR, AC, and Status/Flag registers', 'L2', 4, ['cnc-cf-5']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cf-memory',
        subjectId: 'sub-comp-fund',
        name: 'Memory Hierarchy & Storage Devices',
        topics: [
          {
            id: 'top-cf-mem-hier',
            moduleId: 'mod-cf-memory',
            subjectId: 'sub-comp-fund',
            name: 'Memory Hierarchy & Primary Storage',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-cf-mem-1',
                topicId: 'top-cf-mem-hier',
                moduleId: 'mod-cf-memory',
                subjectId: 'sub-comp-fund',
                name: 'RAM, ROM & Cache Memory Levels',
                concepts: [
                  makeConcept('cnc-cf-7', 'subt-cf-mem-1', 'top-cf-mem-hier', 'mod-cf-memory', 'sub-comp-fund', 'Memory Hierarchy Pyramid', 'Trade-offs between speed, cost per bit, and capacity across levels', 'L1', 5, []),
                  makeConcept('cnc-cf-8', 'subt-cf-mem-1', 'top-cf-mem-hier', 'mod-cf-memory', 'sub-comp-fund', 'RAM (SRAM vs DRAM) and ROM Types', 'Dynamic refresh cycles vs static flip-flops, PROM, EPROM, EEPROM', 'L1', 4, ['cnc-cf-7']),
                  makeConcept('cnc-cf-9', 'subt-cf-mem-1', 'top-cf-mem-hier', 'mod-cf-memory', 'sub-comp-fund', 'Cache Memory (L1, L2, L3) Principles', 'Locality of reference (Temporal & Spatial), hit ratio and miss penalty', 'L2', 5, ['cnc-cf-7']),
                ],
              },
              {
                id: 'subt-cf-mem-2',
                topicId: 'top-cf-mem-hier',
                moduleId: 'mod-cf-memory',
                subjectId: 'sub-comp-fund',
                name: 'Secondary Storage & Input/Output Devices',
                concepts: [
                  makeConcept('cnc-cf-10', 'subt-cf-mem-2', 'top-cf-mem-hier', 'mod-cf-memory', 'sub-comp-fund', 'Magnetic, Optical & Flash Storage', 'HDD track/sector geometry, SSD NAND flash, seek time and latency', 'L1', 3, ['cnc-cf-7']),
                  makeConcept('cnc-cf-11', 'subt-cf-mem-2', 'top-cf-mem-hier', 'mod-cf-memory', 'sub-comp-fund', 'Input and Output Peripherals', 'Keyboards, scanners, OCR/MICR in banking, impact vs non-impact printers', 'L0', 2, []),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cf-numbers',
        subjectId: 'sub-comp-fund',
        name: 'Number Systems, Encodings & Logic Gates',
        topics: [
          {
            id: 'top-cf-num-sys',
            moduleId: 'mod-cf-numbers',
            subjectId: 'sub-comp-fund',
            name: 'Number Systems & Arithmetic',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-cf-num-1',
                topicId: 'top-cf-num-sys',
                moduleId: 'mod-cf-numbers',
                subjectId: 'sub-comp-fund',
                name: 'Radix Conversions & Complements',
                concepts: [
                  makeConcept('cnc-cf-12', 'subt-cf-num-1', 'top-cf-num-sys', 'mod-cf-numbers', 'sub-comp-fund', 'Radix Conversions (Binary, Octal, Hex, Decimal)', 'Interconversions, fraction conversions, bit groupings', 'L1', 4, []),
                  makeConcept('cnc-cf-13', 'subt-cf-num-1', 'top-cf-num-sys', 'mod-cf-numbers', 'sub-comp-fund', 'Binary Arithmetic & Complements (1s & 2s)', '2s complement representation of negative numbers and overflow detection', 'L2', 4, ['cnc-cf-12']),
                  makeConcept('cnc-cf-14', 'subt-cf-num-1', 'top-cf-num-sys', 'mod-cf-numbers', 'sub-comp-fund', 'Character Encodings (ASCII, Unicode, BCD, EBCDIC)', '7-bit/8-bit ASCII values, UTF-8 variable width format in systems', 'L1', 3, ['cnc-cf-12']),
                ],
              },
            ],
          },
          {
            id: 'top-cf-logic',
            moduleId: 'mod-cf-numbers',
            subjectId: 'sub-comp-fund',
            name: 'Boolean Logic & Logic Gates',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-cf-logic-1',
                topicId: 'top-cf-logic',
                moduleId: 'mod-cf-numbers',
                subjectId: 'sub-comp-fund',
                name: 'Logic Gates & Boolean Algebra',
                concepts: [
                  makeConcept('cnc-cf-15', 'subt-cf-logic-1', 'top-cf-logic', 'mod-cf-numbers', 'sub-comp-fund', 'Basic & Universal Logic Gates', 'AND, OR, NOT, NAND, NOR universal gates, XOR, XNOR truth tables', 'L1', 4, ['cnc-cf-12']),
                  makeConcept('cnc-cf-16', 'subt-cf-logic-1', 'top-cf-logic', 'mod-cf-numbers', 'sub-comp-fund', 'Boolean Laws & De Morgan Theorems', 'Distributive, absorption, involution laws, SOP and POS expressions', 'L2', 4, ['cnc-cf-15']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 2. Computer Architecture
  {
    id: 'sub-comp-arch',
    name: 'Computer Architecture',
    code: 'CA',
    category: 'IT',
    weightageWeight: 1.2,
    description: 'CPU Organization, Instruction cycles, Pipelining, Cache mapping, Interrupts, and DMA.',
    iconName: 'Server',
    modules: [
      {
        id: 'mod-ca-cpu-org',
        subjectId: 'sub-comp-arch',
        name: 'CPU Organization & Instruction Set',
        topics: [
          {
            id: 'top-ca-instr-cycle',
            moduleId: 'mod-ca-cpu-org',
            subjectId: 'sub-comp-arch',
            name: 'Instruction Cycle & Register Transfer',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-ca-instr-1',
                topicId: 'top-ca-instr-cycle',
                moduleId: 'mod-ca-cpu-org',
                subjectId: 'sub-comp-arch',
                name: 'Fetch-Decode-Execute Phases',
                concepts: [
                  makeConcept('cnc-ca-1', 'subt-ca-instr-1', 'top-ca-instr-cycle', 'mod-ca-cpu-org', 'sub-comp-arch', 'Instruction Cycle & Micro-operations', 'Fetch phase, indirect cycle, execute phase, and interrupt cycle timing', 'L1', 4, ['cnc-cf-6']),
                  makeConcept('cnc-ca-2', 'subt-ca-instr-1', 'top-ca-instr-cycle', 'mod-ca-cpu-org', 'sub-comp-arch', 'Addressing Modes', 'Immediate, Direct, Indirect, Register, Relative, Indexed addressing', 'L2', 5, ['cnc-ca-1']),
                  makeConcept('cnc-ca-3', 'subt-ca-instr-1', 'top-ca-instr-cycle', 'mod-ca-cpu-org', 'sub-comp-arch', 'RISC vs CISC Architectures', 'Single-cycle vs multi-cycle instructions, hardwired vs microcode control', 'L2', 4, ['cnc-ca-2']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-ca-pipeline-cache',
        subjectId: 'sub-comp-arch',
        name: 'Pipelining, Cache Organization & I/O',
        topics: [
          {
            id: 'top-ca-pipelining',
            moduleId: 'mod-ca-pipeline-cache',
            subjectId: 'sub-comp-arch',
            name: 'Pipelining & Hazards',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-ca-pipe-1',
                topicId: 'top-ca-pipelining',
                moduleId: 'mod-ca-pipeline-cache',
                subjectId: 'sub-comp-arch',
                name: 'Linear Pipeline & Speedup',
                concepts: [
                  makeConcept('cnc-ca-4', 'subt-ca-pipe-1', 'top-ca-pipelining', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Pipelining Stages & Ideal Speedup', 'K-stage pipeline, throughput calculation: S = k*n / (k + n - 1)', 'L2', 5, ['cnc-ca-1']),
                  makeConcept('cnc-ca-5', 'subt-ca-pipe-1', 'top-ca-pipelining', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Pipeline Hazards (Structural, Data, Control)', 'RAW, WAR, WAW dependencies, forwarding, stall cycles, branch prediction', 'L3', 5, ['cnc-ca-4']),
                ],
              },
            ],
          },
          {
            id: 'top-ca-cache-io',
            moduleId: 'mod-ca-pipeline-cache',
            subjectId: 'sub-comp-arch',
            name: 'Cache Mapping, Interrupts & DMA',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-ca-cache-1',
                topicId: 'top-ca-cache-io',
                moduleId: 'mod-ca-pipeline-cache',
                subjectId: 'sub-comp-arch',
                name: 'Cache Mapping & Memory Org',
                concepts: [
                  makeConcept('cnc-ca-6', 'subt-ca-cache-1', 'top-ca-cache-io', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Cache Mapping Techniques', 'Direct mapping, Associative mapping, Set-associative mapping, Tag calculation', 'L2', 5, ['cnc-cf-9']),
                  makeConcept('cnc-ca-7', 'subt-ca-cache-1', 'top-ca-cache-io', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Cache Replacement & Write Policies', 'LRU, FIFO, LFU, Write-Through vs Write-Back, cache coherence', 'L2', 4, ['cnc-ca-6']),
                ],
              },
              {
                id: 'subt-ca-io-1',
                topicId: 'top-ca-cache-io',
                moduleId: 'mod-ca-pipeline-cache',
                subjectId: 'sub-comp-arch',
                name: 'Interrupts, DMA & I/O Organization',
                concepts: [
                  makeConcept('cnc-ca-8', 'subt-ca-io-1', 'top-ca-cache-io', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Programmed I/O vs Interrupt-Driven I/O', 'Vectored vs non-vectored interrupts, maskable/non-maskable interrupts', 'L2', 4, ['cnc-ca-1']),
                  makeConcept('cnc-ca-9', 'subt-ca-io-1', 'top-ca-cache-io', 'mod-ca-pipeline-cache', 'sub-comp-arch', 'Direct Memory Access (DMA)', 'DMA controller, burst mode, cycle stealing, bus arbitration mechanisms', 'L2', 4, ['cnc-ca-8']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 3. Operating Systems
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'OS',
    category: 'IT',
    weightageWeight: 1.4,
    description: 'Process management, CPU scheduling, synchronization, deadlocks, paging, virtual memory, and security.',
    iconName: 'Terminal',
    modules: [
      {
        id: 'mod-os-proc',
        subjectId: 'sub-os',
        name: 'Processes, Threads & CPU Scheduling',
        topics: [
          {
            id: 'top-os-processes',
            moduleId: 'mod-os-proc',
            subjectId: 'sub-os',
            name: 'Process Fundamentals & States',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-os-proc-1',
                topicId: 'top-os-processes',
                moduleId: 'mod-os-proc',
                subjectId: 'sub-os',
                name: 'Process Control Block & Context Switching',
                concepts: [
                  makeConcept('cnc-os-1', 'subt-os-proc-1', 'top-os-processes', 'mod-os-proc', 'sub-os', 'OS Architecture & Kernel Modes', 'Monolithic vs microkernel, user mode vs kernel mode syscalls', 'L1', 4, []),
                  makeConcept('cnc-os-2', 'subt-os-proc-1', 'top-os-processes', 'mod-os-proc', 'sub-os', 'Process States & Lifecycle', 'New, Ready, Running, Waiting, Terminated, 5-state and 7-state models', 'L1', 5, ['cnc-os-1']),
                  makeConcept('cnc-os-3', 'subt-os-proc-1', 'top-os-processes', 'mod-os-proc', 'sub-os', 'Process Control Block (PCB) & Context Switch', 'Registers, PID, state, memory limits, overhead of context switching', 'L2', 5, ['cnc-os-2']),
                  makeConcept('cnc-os-4', 'subt-os-proc-1', 'top-os-processes', 'mod-os-proc', 'sub-os', 'Threads & Multithreading Models', 'User-level vs kernel-level threads, Many-to-One, One-to-One, Many-to-Many', 'L2', 4, ['cnc-os-3']),
                ],
              },
            ],
          },
          {
            id: 'top-os-sched',
            moduleId: 'mod-os-proc',
            subjectId: 'sub-os',
            name: 'CPU Scheduling Algorithms',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-os-sched-1',
                topicId: 'top-os-sched',
                moduleId: 'mod-os-proc',
                subjectId: 'sub-os',
                name: 'Non-Preemptive & Preemptive Scheduling',
                concepts: [
                  makeConcept('cnc-os-5', 'subt-os-sched-1', 'top-os-sched', 'mod-os-proc', 'sub-os', 'First Come First Served (FCFS) & Convoy Effect', 'Arrival time, burst time, turnaround time, waiting time, convoy effect', 'L1', 4, ['cnc-os-2']),
                  makeConcept('cnc-os-6', 'subt-os-sched-1', 'top-os-sched', 'mod-os-proc', 'sub-os', 'SJF & Shortest Remaining Time First (SRTF)', 'Optimal average waiting time, preemption mechanics, starvation', 'L2', 5, ['cnc-os-5']),
                  makeConcept('cnc-os-7', 'subt-os-sched-1', 'top-os-sched', 'mod-os-proc', 'sub-os', 'Priority Scheduling & Aging', 'Static vs dynamic priority, indefinite blocking (starvation) and aging solution', 'L2', 4, ['cnc-os-6']),
                  makeConcept('cnc-os-8', 'subt-os-sched-1', 'top-os-sched', 'mod-os-proc', 'sub-os', 'Round Robin (RR) & Time Quantum Impact', 'Ready queue circular FIFO, small vs large time quantum trade-off', 'L2', 5, ['cnc-os-5']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-os-sync-dead',
        subjectId: 'sub-os',
        name: 'Synchronization & Deadlocks',
        topics: [
          {
            id: 'top-os-sync',
            moduleId: 'mod-os-sync-dead',
            subjectId: 'sub-os',
            name: 'Process Synchronization',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-os-sync-1',
                topicId: 'top-os-sync',
                moduleId: 'mod-os-sync-dead',
                subjectId: 'sub-os',
                name: 'Critical Section & Semaphores',
                concepts: [
                  makeConcept('cnc-os-9', 'subt-os-sync-1', 'top-os-sync', 'mod-os-sync-dead', 'sub-os', 'Critical Section Problem & Criteria', 'Mutual exclusion, progress, bounded waiting criteria, Peterson algorithm', 'L2', 5, ['cnc-os-3']),
                  makeConcept('cnc-os-10', 'subt-os-sync-1', 'top-os-sync', 'mod-os-sync-dead', 'sub-os', 'Mutex Locks & Counting Semaphores', 'Wait() (P) and Signal() (V) atomic primitives, spinlocks, binary semaphores', 'L2', 5, ['cnc-os-9']),
                  makeConcept('cnc-os-11', 'subt-os-sync-1', 'top-os-sync', 'mod-os-sync-dead', 'sub-os', 'Classical Synchronization Problems', 'Producer-Consumer (Bounded Buffer), Readers-Writers, Dining Philosophers', 'L3', 4, ['cnc-os-10']),
                ],
              },
            ],
          },
          {
            id: 'top-os-deadlock',
            moduleId: 'mod-os-sync-dead',
            subjectId: 'sub-os',
            name: 'Deadlocks & Avoidance',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-os-dead-1',
                topicId: 'top-os-deadlock',
                moduleId: 'mod-os-sync-dead',
                subjectId: 'sub-os',
                name: 'Coffman Conditions & Banker Algorithm',
                concepts: [
                  makeConcept('cnc-os-12', 'subt-os-dead-1', 'top-os-deadlock', 'mod-os-sync-dead', 'sub-os', 'Deadlock Necessary Conditions & RAG', 'Mutual exclusion, hold and wait, no preemption, circular wait, cycle in RAG', 'L2', 5, ['cnc-os-9']),
                  makeConcept('cnc-os-13', 'subt-os-dead-1', 'top-os-deadlock', 'mod-os-sync-dead', 'sub-os', 'Deadlock Prevention & Detection', 'Eliminating one of Coffman conditions, wait-for graphs, recovery strategies', 'L2', 4, ['cnc-os-12']),
                  makeConcept('cnc-os-14', 'subt-os-dead-1', 'top-os-deadlock', 'mod-os-sync-dead', 'sub-os', 'Banker Algorithm for Deadlock Avoidance', 'Safe state determination, Allocation, Max, Need = Max - Allocation matrices', 'L3', 5, ['cnc-os-12']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-os-mem-file',
        subjectId: 'sub-os',
        name: 'Memory Management, File Systems & Security',
        topics: [
          {
            id: 'top-os-mem-mgmt',
            moduleId: 'mod-os-mem-file',
            subjectId: 'sub-os',
            name: 'Paging & Virtual Memory',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-os-mem-1',
                topicId: 'top-os-mem-mgmt',
                moduleId: 'mod-os-mem-file',
                subjectId: 'sub-os',
                name: 'Paging, Segmentation & TLB',
                concepts: [
                  makeConcept('cnc-os-15', 'subt-os-mem-1', 'top-os-mem-mgmt', 'mod-os-mem-file', 'sub-os', 'Contiguous Memory Allocation & Fragmentation', 'Fixed vs dynamic partitioning, First-fit, Best-fit, Worst-fit, internal/external', 'L1', 4, ['cnc-cf-7']),
                  makeConcept('cnc-os-16', 'subt-os-mem-1', 'top-os-mem-mgmt', 'mod-os-mem-file', 'sub-os', 'Paging Hardware & Translation Lookaside Buffer (TLB)', 'Page tables, page size, frame size, TLB hit ratio, Effective Access Time (EAT)', 'L2', 5, ['cnc-os-15']),
                  makeConcept('cnc-os-17', 'subt-os-mem-1', 'top-os-mem-mgmt', 'mod-os-mem-file', 'sub-os', 'Segmentation', 'User view of memory, segment table (base and limit registers), sharing segments', 'L2', 3, ['cnc-os-16']),
                ],
              },
              {
                id: 'subt-os-mem-2',
                topicId: 'top-os-mem-mgmt',
                moduleId: 'mod-os-mem-file',
                subjectId: 'sub-os',
                name: 'Virtual Memory & Page Replacement',
                concepts: [
                  makeConcept('cnc-os-18', 'subt-os-mem-2', 'top-os-mem-mgmt', 'mod-os-mem-file', 'sub-os', 'Demand Paging & Page Fault Handling', 'Pure demand paging, page fault service time, dirty bit, thrashing phenomenon', 'L2', 5, ['cnc-os-16']),
                  makeConcept('cnc-os-19', 'subt-os-mem-2', 'top-os-mem-mgmt', 'mod-os-mem-file', 'sub-os', 'Page Replacement Algorithms (FIFO, LRU, Optimal)', 'Belady Anomaly in FIFO, optimal benchmark, LRU stack implementation', 'L2', 5, ['cnc-os-18']),
                ],
              },
            ],
          },
          {
            id: 'top-os-files-sec',
            moduleId: 'mod-os-mem-file',
            subjectId: 'sub-os',
            name: 'File Systems, Disk Scheduling & OS Security',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-os-file-1',
                topicId: 'top-os-files-sec',
                moduleId: 'mod-os-mem-file',
                subjectId: 'sub-os',
                name: 'Disk Scheduling & Security',
                concepts: [
                  makeConcept('cnc-os-20', 'subt-os-file-1', 'top-os-files-sec', 'mod-os-mem-file', 'sub-os', 'Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK)', 'Seek time optimization, starvation in SSTF, elevator SCAN behavior', 'L2', 4, ['cnc-cf-10']),
                  makeConcept('cnc-os-21', 'subt-os-file-1', 'top-os-files-sec', 'mod-os-mem-file', 'sub-os', 'File Systems (FAT, NTFS, Inodes)', 'Contiguous, linked, indexed allocation, directory structures, inode pointers', 'L1', 3, ['cnc-os-1']),
                  makeConcept('cnc-os-22', 'subt-os-file-1', 'top-os-files-sec', 'mod-os-mem-file', 'sub-os', 'OS Protection & Security', 'Access matrix, ACLs, user authentication, kernel privilege rings', 'L2', 3, ['cnc-os-1']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 4. DBMS
  {
    id: 'sub-dbms',
    name: 'DBMS',
    code: 'DBMS',
    category: 'IT',
    weightageWeight: 1.5,
    description: 'Relational model, Keys, SQL, Joins, Normalization, Transactions, Concurrency, and Indexing.',
    iconName: 'Database',
    modules: [
      {
        id: 'mod-dbms-relational',
        subjectId: 'sub-dbms',
        name: 'Database Architecture & Relational Model',
        topics: [
          {
            id: 'top-dbms-fund',
            moduleId: 'mod-dbms-relational',
            subjectId: 'sub-dbms',
            name: 'Database Fundamentals & Schemas',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-dbms-fund-1',
                topicId: 'top-dbms-fund',
                moduleId: 'mod-dbms-relational',
                subjectId: 'sub-dbms',
                name: 'Three-Tier Architecture & Data Independence',
                concepts: [
                  makeConcept('cnc-dbms-1', 'subt-dbms-fund-1', 'top-dbms-fund', 'mod-dbms-relational', 'sub-dbms', 'DBMS vs File Processing System', 'Data redundancy, inconsistency, concurrent access, atomicity benefits', 'L0', 3, []),
                  makeConcept('cnc-dbms-2', 'subt-dbms-fund-1', 'top-dbms-fund', 'mod-dbms-relational', 'sub-dbms', 'Three-Schema Architecture & Data Independence', 'Physical, logical, external schemas; physical and logical data independence', 'L1', 4, ['cnc-dbms-1']),
                  makeConcept('cnc-dbms-3', 'subt-dbms-fund-1', 'top-dbms-fund', 'mod-dbms-relational', 'sub-dbms', 'Data Models & ER Diagrams', 'Hierarchical, Network, Relational; Entity, Weak Entity, Attributes, Cardinality', 'L1', 4, ['cnc-dbms-2']),
                ],
              },
            ],
          },
          {
            id: 'top-dbms-rel-model',
            moduleId: 'mod-dbms-relational',
            subjectId: 'sub-dbms',
            name: 'Relational Model, Keys & Constraints',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dbms-keys-1',
                topicId: 'top-dbms-rel-model',
                moduleId: 'mod-dbms-relational',
                subjectId: 'sub-dbms',
                name: 'Relational Keys & Integrity Constraints',
                concepts: [
                  makeConcept('cnc-dbms-4', 'subt-dbms-keys-1', 'top-dbms-rel-model', 'mod-dbms-relational', 'sub-dbms', 'Super Key, Candidate Key & Primary Key', 'Minimal super keys as candidate keys; Primary key uniqueness and NOT NULL', 'L2', 5, ['cnc-dbms-2']),
                  makeConcept('cnc-dbms-5', 'subt-dbms-keys-1', 'top-dbms-rel-model', 'mod-dbms-relational', 'sub-dbms', 'Foreign Key & Referential Integrity', 'Parent-child tables, ON DELETE CASCADE, ON UPDATE SET NULL semantics', 'L2', 5, ['cnc-dbms-4']),
                  makeConcept('cnc-dbms-6', 'subt-dbms-keys-1', 'top-dbms-rel-model', 'mod-dbms-relational', 'sub-dbms', 'Domain & Entity Constraints', 'CHECK constraint, UNIQUE constraint vs Primary key differences', 'L1', 4, ['cnc-dbms-4']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-dbms-sql',
        subjectId: 'sub-dbms',
        name: 'SQL Language & Advanced Queries',
        topics: [
          {
            id: 'top-dbms-sql-queries',
            moduleId: 'mod-dbms-sql',
            subjectId: 'sub-dbms',
            name: 'SQL DDL, DML, Clauses & Aggregates',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dbms-sql-1',
                topicId: 'top-dbms-sql-queries',
                moduleId: 'mod-dbms-sql',
                subjectId: 'sub-dbms',
                name: 'Core SQL Query Commands',
                concepts: [
                  makeConcept('cnc-dbms-7', 'subt-dbms-sql-1', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'DDL, DML, DCL, TCL Statements', 'CREATE, ALTER, DROP, TRUNCATE vs DELETE, GRANT, REVOKE, COMMIT, ROLLBACK', 'L1', 5, ['cnc-dbms-4']),
                  makeConcept('cnc-dbms-8', 'subt-dbms-sql-1', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'WHERE, ORDER BY, GROUP BY & HAVING Clauses', 'Execution order of clauses; row filtering (WHERE) vs group filtering (HAVING)', 'L2', 5, ['cnc-dbms-7']),
                  makeConcept('cnc-dbms-9', 'subt-dbms-sql-1', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'Aggregate Functions & NULL Handling', 'COUNT(*), COUNT(col), SUM, AVG, MIN, MAX; three-valued logic (NULL handling)', 'L2', 4, ['cnc-dbms-8']),
                ],
              },
              {
                id: 'subt-dbms-sql-2',
                topicId: 'top-dbms-sql-queries',
                moduleId: 'mod-dbms-sql',
                subjectId: 'sub-dbms',
                name: 'SQL Joins, Subqueries & Views',
                concepts: [
                  makeConcept('cnc-dbms-10', 'subt-dbms-sql-2', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'SQL JOIN Operations (Inner, Outer, Self, Cross)', 'Natural Join, Left/Right/Full Outer Join, Cartesian product mechanics', 'L2', 5, ['cnc-dbms-8']),
                  makeConcept('cnc-dbms-11', 'subt-dbms-sql-2', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'Correlated Subqueries & Nested SELECT', 'IN, ANY, ALL, EXISTS, NOT EXISTS subquery evaluations', 'L2', 4, ['cnc-dbms-10']),
                  makeConcept('cnc-dbms-12', 'subt-dbms-sql-2', 'top-dbms-sql-queries', 'mod-dbms-sql', 'sub-dbms', 'Views & Indexes (B-Trees / B+ Trees)', 'Virtual tables, materialized views, sparse vs dense index, B+ tree leaf links', 'L2', 4, ['cnc-dbms-10']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-dbms-norm-trans',
        subjectId: 'sub-dbms',
        name: 'Normalization, Transactions & Concurrency',
        topics: [
          {
            id: 'top-dbms-norm',
            moduleId: 'mod-dbms-norm-trans',
            subjectId: 'sub-dbms',
            name: 'Functional Dependencies & Normalization',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dbms-norm-1',
                topicId: 'top-dbms-norm',
                moduleId: 'mod-dbms-norm-trans',
                subjectId: 'sub-dbms',
                name: 'Normal Forms (1NF to BCNF)',
                concepts: [
                  makeConcept('cnc-dbms-13', 'subt-dbms-norm-1', 'top-dbms-norm', 'mod-dbms-norm-trans', 'sub-dbms', 'Functional Dependencies & Attribute Closure', 'Armstrong axioms, reflexivity, augmentation, transitivity, finding closure X+', 'L2', 5, ['cnc-dbms-4']),
                  makeConcept('cnc-dbms-14', 'subt-dbms-norm-1', 'top-dbms-norm', 'mod-dbms-norm-trans', 'sub-dbms', '1NF, 2NF & Partial Dependency', 'Atomic values in 1NF, elimination of partial dependency (non-prime on part of candidate key)', 'L2', 5, ['cnc-dbms-13']),
                  makeConcept('cnc-dbms-15', 'subt-dbms-norm-1', 'top-dbms-norm', 'mod-dbms-norm-trans', 'sub-dbms', '3NF, BCNF & Transitive Dependency', '3NF: X->Y where X is superkey or Y is prime; BCNF: strictly X is superkey', 'L3', 5, ['cnc-dbms-14']),
                  makeConcept('cnc-dbms-16', 'subt-dbms-norm-1', 'top-dbms-norm', 'mod-dbms-norm-trans', 'sub-dbms', 'Lossless Join & Dependency Preservation Decomposition', 'Intersection is superkey for at least one relation; dependency coverage testing', 'L3', 4, ['cnc-dbms-15']),
                ],
              },
            ],
          },
          {
            id: 'top-dbms-trans',
            moduleId: 'mod-dbms-norm-trans',
            subjectId: 'sub-dbms',
            name: 'Transactions, ACID & Concurrency Control',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dbms-trans-1',
                topicId: 'top-dbms-trans',
                moduleId: 'mod-dbms-norm-trans',
                subjectId: 'sub-dbms',
                name: 'ACID Properties & Serializability',
                concepts: [
                  makeConcept('cnc-dbms-17', 'subt-dbms-trans-1', 'top-dbms-trans', 'mod-dbms-norm-trans', 'sub-dbms', 'ACID Properties of Transactions', 'Atomicity (Undo log), Consistency, Isolation (Locks), Durability (Redo log)', 'L1', 5, ['cnc-dbms-7']),
                  makeConcept('cnc-dbms-18', 'subt-dbms-trans-1', 'top-dbms-trans', 'mod-dbms-norm-trans', 'sub-dbms', 'Serializability (Conflict vs View)', 'Precedence graph cycle detection for conflict serializability, dirty reads', 'L2', 5, ['cnc-dbms-17']),
                  makeConcept('cnc-dbms-19', 'subt-dbms-trans-1', 'top-dbms-trans', 'mod-dbms-norm-trans', 'sub-dbms', 'Two-Phase Locking (2PL: Strict, Rigorous)', 'Growing and shrinking phases; cascade rollback prevention via Strict 2PL', 'L3', 5, ['cnc-dbms-18']),
                  makeConcept('cnc-dbms-20', 'subt-dbms-trans-1', 'top-dbms-trans', 'mod-dbms-norm-trans', 'sub-dbms', 'Crash Recovery, WAL & Checkpoints', 'Write-Ahead Logging protocol, ARIES algorithm, Redo/Undo pass on recovery', 'L2', 4, ['cnc-dbms-17']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 5. Computer Networks
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CN',
    category: 'IT',
    weightageWeight: 1.5,
    description: 'OSI 7 Layers, TCP/IP, IPv4, Subnetting, CIDR, Transport Protocols, Routing, and Network Security.',
    iconName: 'Network',
    modules: [
      {
        id: 'mod-cn-models',
        subjectId: 'sub-cn',
        name: 'Networking Models & Physical/Data Link Layers',
        topics: [
          {
            id: 'top-cn-basics',
            moduleId: 'mod-cn-models',
            subjectId: 'sub-cn',
            name: 'Network Topologies & Reference Models',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-cn-topo-1',
                topicId: 'top-cn-basics',
                moduleId: 'mod-cn-models',
                subjectId: 'sub-cn',
                name: 'Topologies, Devices & Media',
                concepts: [
                  makeConcept('cnc-cn-1', 'subt-cn-topo-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'Network Topologies & Types (LAN, MAN, WAN)', 'Bus, Star, Ring, Mesh formula: n*(n-1)/2 links, Tree, Hybrid topologies', 'L0', 3, []),
                  makeConcept('cnc-cn-2', 'subt-cn-topo-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'Network Devices (Hub, Switch, Router, Gateway)', 'Hub (L1), Bridge/Switch (L2 MAC learning), Router (L3 IP routing), Gateway (L7)', 'L1', 4, ['cnc-cn-1']),
                  makeConcept('cnc-cn-3', 'subt-cn-topo-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'Transmission Media & Ethernet', 'Twisted pair (UTP/STP), Coaxial, Fiber optics, CSMA/CD and CSMA/CA', 'L1', 3, ['cnc-cn-2']),
                ],
              },
              {
                id: 'subt-cn-osi-1',
                topicId: 'top-cn-basics',
                moduleId: 'mod-cn-models',
                subjectId: 'sub-cn',
                name: 'OSI 7 Layers vs TCP/IP Protocol Suite',
                concepts: [
                  makeConcept('cnc-cn-4', 'subt-cn-osi-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'OSI 7-Layer Model Architecture', 'Physical, Data Link, Network, Transport, Session, Presentation, Application duties', 'L1', 5, ['cnc-cn-2']),
                  makeConcept('cnc-cn-5', 'subt-cn-osi-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'Encapsulation & Decapsulation Headers', 'Data -> Segment -> Packet -> Frame -> Bits header appending at each layer', 'L1', 4, ['cnc-cn-4']),
                  makeConcept('cnc-cn-6', 'subt-cn-osi-1', 'top-cn-basics', 'mod-cn-models', 'sub-cn', 'Data Link Protocols & Flow/Error Control', 'Framing, Stop-and-Wait, Go-Back-N, Selective Repeat, CRC polynomial check', 'L2', 5, ['cnc-cn-4']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cn-ip-addressing',
        subjectId: 'sub-cn',
        name: 'IP Addressing, Subnetting, CIDR & Network Layer',
        topics: [
          {
            id: 'top-cn-ip-cidr',
            moduleId: 'mod-cn-ip-addressing',
            subjectId: 'sub-cn',
            name: 'IPv4, Subnetting & CIDR Calculation',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-cn-ip-1',
                topicId: 'top-cn-ip-cidr',
                moduleId: 'mod-cn-ip-addressing',
                subjectId: 'sub-cn',
                name: 'IP Classes, Private IPs & ARP',
                concepts: [
                  makeConcept('cnc-cn-7', 'subt-cn-ip-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'IPv4 Addressing & Classes (A, B, C, D, E)', '32-bit addresses, Class ranges, default masks, multicast and experimental ranges', 'L1', 5, ['cnc-cn-4']),
                  makeConcept('cnc-cn-8', 'subt-cn-ip-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'Private IP Ranges (RFC 1918) & NAT', '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, NAT port translation (PAT)', 'L2', 4, ['cnc-cn-7']),
                  makeConcept('cnc-cn-9', 'subt-cn-ip-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'ARP & RARP / MAC Address', 'Address Resolution Protocol IP to MAC translation, ARP cache poisoning', 'L2', 4, ['cnc-cn-7']),
                ],
              },
              {
                id: 'subt-cn-cidr-1',
                topicId: 'top-cn-ip-cidr',
                moduleId: 'mod-cn-ip-addressing',
                subjectId: 'sub-cn',
                name: 'Subnetting & CIDR Host Calculation',
                concepts: [
                  makeConcept('cnc-cn-10', 'subt-cn-cidr-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'Subnet Mask & Subnetting Mechanics', 'Borrowing host bits for subnets; Network ID, First Host, Last Host, Broadcast ID', 'L2', 5, ['cnc-cn-7']),
                  makeConcept('cnc-cn-11', 'subt-cn-cidr-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'CIDR (Classless Inter-Domain Routing)', 'Slash notation /24 to /30, usable hosts formula: 2^(32-prefix) - 2', 'L3', 5, ['cnc-cn-10']),
                  makeConcept('cnc-cn-12', 'subt-cn-cidr-1', 'top-cn-ip-cidr', 'mod-cn-ip-addressing', 'sub-cn', 'IPv6 Fundamentals', '128-bit hex notation, compression rules (::), lack of broadcast (anycast)', 'L1', 3, ['cnc-cn-7']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cn-trans-app',
        subjectId: 'sub-cn',
        name: 'Transport, Routing & Application Protocols',
        topics: [
          {
            id: 'top-cn-trans-route',
            moduleId: 'mod-cn-trans-app',
            subjectId: 'sub-cn',
            name: 'TCP, UDP, Routing Protocols & Switching',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-cn-tcp-1',
                topicId: 'top-cn-trans-route',
                moduleId: 'mod-cn-trans-app',
                subjectId: 'sub-cn',
                name: 'Transport Layer: TCP vs UDP',
                concepts: [
                  makeConcept('cnc-cn-13', 'subt-cn-tcp-1', 'top-cn-trans-route', 'mod-cn-trans-app', 'sub-cn', 'TCP vs UDP Differences', 'Connection-oriented reliable byte stream vs connectionless lightweight datagram', 'L1', 5, ['cnc-cn-4']),
                  makeConcept('cnc-cn-14', 'subt-cn-tcp-1', 'top-cn-trans-route', 'mod-cn-trans-app', 'sub-cn', 'TCP 3-Way Handshake & Connection Termination', 'SYN, SYN-ACK, ACK seq numbers; FIN, ACK 4-way disconnect, TIME_WAIT state', 'L2', 5, ['cnc-cn-13']),
                  makeConcept('cnc-cn-15', 'subt-cn-tcp-1', 'top-cn-trans-route', 'mod-cn-trans-app', 'sub-cn', 'TCP Congestion Control & Flow Control', 'Sliding window, Slow Start, Congestion Avoidance, AIMD, Fast Retransmit', 'L3', 4, ['cnc-cn-14']),
                ],
              },
              {
                id: 'subt-cn-route-1',
                topicId: 'top-cn-trans-route',
                moduleId: 'mod-cn-trans-app',
                subjectId: 'sub-cn',
                name: 'Routing Protocols & Switching',
                concepts: [
                  makeConcept('cnc-cn-16', 'subt-cn-route-1', 'top-cn-trans-route', 'mod-cn-trans-app', 'sub-cn', 'Routing Protocols (RIP, OSPF, BGP)', 'Distance vector hop count limit, OSPF Dijkstra link-state, BGP path vector', 'L2', 4, ['cnc-cn-10']),
                  makeConcept('cnc-cn-17', 'subt-cn-route-1', 'top-cn-trans-route', 'mod-cn-trans-app', 'sub-cn', 'VLANs & ICMP Diagnostics', 'Virtual LAN 802.1Q tagging, ICMP Ping, Traceroute TTL expiration', 'L2', 4, ['cnc-cn-2']),
                ],
              },
            ],
          },
          {
            id: 'top-cn-app-sec',
            moduleId: 'mod-cn-trans-app',
            subjectId: 'sub-cn',
            name: 'Application Protocols & Network Security',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-cn-app-1',
                topicId: 'top-cn-app-sec',
                moduleId: 'mod-cn-trans-app',
                subjectId: 'sub-cn',
                name: 'Well-Known Application Protocols',
                concepts: [
                  makeConcept('cnc-cn-18', 'subt-cn-app-1', 'top-cn-app-sec', 'mod-cn-trans-app', 'sub-cn', 'DNS, DHCP, HTTP & HTTPS Ports', 'DNS port 53 UDP, DHCP DORA process port 67/68, HTTP 80 vs HTTPS 443 SSL/TLS', 'L1', 5, ['cnc-cn-13']),
                  makeConcept('cnc-cn-19', 'subt-cn-app-1', 'top-cn-app-sec', 'mod-cn-trans-app', 'sub-cn', 'Email & File Protocols (FTP, SMTP, POP3, IMAP, SSH)', 'FTP 20/21, SMTP 25, POP3 110, IMAP 143, SSH port 22 encrypted shell', 'L1', 4, ['cnc-cn-18']),
                  makeConcept('cnc-cn-20', 'subt-cn-app-1', 'top-cn-app-sec', 'mod-cn-trans-app', 'sub-cn', 'Firewalls, IDS/IPS & Network Security', 'Packet filtering, stateful inspection, signature-based IDS vs anomaly IPS', 'L2', 4, ['cnc-cn-4']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 6. Data Structures & Algorithms
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: 'DSA',
    category: 'IT',
    weightageWeight: 1.4,
    description: 'Arrays, Linked Lists, Stacks, Queues, Trees, BST, AVL, Graphs, Sorting, and Asymptotic Complexity.',
    iconName: 'GitBranch',
    modules: [
      {
        id: 'mod-dsa-linear',
        subjectId: 'sub-dsa',
        name: 'Linear Data Structures & Complexity',
        topics: [
          {
            id: 'top-dsa-complexity',
            moduleId: 'mod-dsa-linear',
            subjectId: 'sub-dsa',
            name: 'Algorithm Fundamentals & Asymptotic Complexity',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dsa-comp-1',
                topicId: 'top-dsa-complexity',
                moduleId: 'mod-dsa-linear',
                subjectId: 'sub-dsa',
                name: 'Big O, Big Omega & Big Theta',
                concepts: [
                  makeConcept('cnc-dsa-1', 'subt-dsa-comp-1', 'top-dsa-complexity', 'mod-dsa-linear', 'sub-dsa', 'Asymptotic Notations (O, Ω, Θ)', 'Upper bound (Big O), Lower bound (Big Omega), Tight bound (Big Theta) definitions', 'L1', 5, []),
                  makeConcept('cnc-dsa-2', 'subt-dsa-comp-1', 'top-dsa-complexity', 'mod-dsa-linear', 'sub-dsa', 'Time & Space Complexity Analysis', 'Constant O(1), Logarithmic O(log n), Linear O(n), Quadratic O(n^2), loop analysis', 'L2', 5, ['cnc-dsa-1']),
                ],
              },
            ],
          },
          {
            id: 'top-dsa-arrays-lists',
            moduleId: 'mod-dsa-linear',
            subjectId: 'sub-dsa',
            name: 'Arrays, Linked Lists, Stacks & Queues',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dsa-arr-1',
                topicId: 'top-dsa-arrays-lists',
                moduleId: 'mod-dsa-linear',
                subjectId: 'sub-dsa',
                name: 'Arrays & Memory Address Calculation',
                concepts: [
                  makeConcept('cnc-dsa-3', 'subt-dsa-arr-1', 'top-dsa-arrays-lists', 'mod-dsa-linear', 'sub-dsa', 'Row-Major & Column-Major Addressing', '1D base + i*w; 2D Row-Major: Base + ((i - L1)*N + (j - L2))*w formula', 'L2', 5, ['cnc-dsa-2']),
                  makeConcept('cnc-dsa-4', 'subt-dsa-arr-1', 'top-dsa-arrays-lists', 'mod-dsa-linear', 'sub-dsa', 'Singly, Doubly & Circular Linked Lists', 'Pointer operations, insertion/deletion complexities, cycle detection (Floyd algorithm)', 'L2', 5, ['cnc-dsa-3']),
                ],
              },
              {
                id: 'subt-dsa-stack-1',
                topicId: 'top-dsa-arrays-lists',
                moduleId: 'mod-dsa-linear',
                subjectId: 'sub-dsa',
                name: 'Stacks, Queues, Circular Queues & Deques',
                concepts: [
                  makeConcept('cnc-dsa-5', 'subt-dsa-stack-1', 'top-dsa-arrays-lists', 'mod-dsa-linear', 'sub-dsa', 'Stacks (LIFO) & Expression Evaluation', 'Push/Pop, Infix to Postfix conversion using precedence stack, Postfix evaluation', 'L2', 5, ['cnc-dsa-4']),
                  makeConcept('cnc-dsa-6', 'subt-dsa-stack-1', 'top-dsa-arrays-lists', 'mod-dsa-linear', 'sub-dsa', 'Queues (FIFO), Circular Queues & Deques', 'Front/Rear pointers, (rear + 1) % size formula, double-ended queue operations', 'L2', 4, ['cnc-dsa-5']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-dsa-trees-graphs',
        subjectId: 'sub-dsa',
        name: 'Trees, Graphs, Hashing & Algorithms',
        topics: [
          {
            id: 'top-dsa-trees',
            moduleId: 'mod-dsa-trees-graphs',
            subjectId: 'sub-dsa',
            name: 'Trees, Binary Trees, BST & AVL Trees',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dsa-tree-1',
                topicId: 'top-dsa-trees',
                moduleId: 'mod-dsa-trees-graphs',
                subjectId: 'sub-dsa',
                name: 'Binary Trees & Traversals',
                concepts: [
                  makeConcept('cnc-dsa-7', 'subt-dsa-tree-1', 'top-dsa-trees', 'mod-dsa-trees-graphs', 'sub-dsa', 'Binary Tree Properties & Traversals', 'Full, complete, strict binary trees; Inorder, Preorder, Postorder traversals', 'L2', 5, ['cnc-dsa-4']),
                  makeConcept('cnc-dsa-8', 'subt-dsa-tree-1', 'top-dsa-trees', 'mod-dsa-trees-graphs', 'sub-dsa', 'Binary Search Tree (BST)', 'Left < Root < Right property, Inorder traversal yields sorted order, search O(h)', 'L2', 5, ['cnc-dsa-7']),
                  makeConcept('cnc-dsa-9', 'subt-dsa-tree-1', 'top-dsa-trees', 'mod-dsa-trees-graphs', 'sub-dsa', 'AVL Trees & Balancing Rotations', 'Balance factor {-1, 0, +1}; LL, RR, LR, RL rotation steps to restore balance', 'L3', 5, ['cnc-dsa-8']),
                ],
              },
            ],
          },
          {
            id: 'top-dsa-graphs-search-sort',
            moduleId: 'mod-dsa-trees-graphs',
            subjectId: 'sub-dsa',
            name: 'Graphs, Searching, Sorting & Hashing',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-dsa-graph-1',
                topicId: 'top-dsa-graphs-search-sort',
                moduleId: 'mod-dsa-trees-graphs',
                subjectId: 'sub-dsa',
                name: 'Graphs (BFS, DFS, Shortest Path, MST)',
                concepts: [
                  makeConcept('cnc-dsa-10', 'subt-dsa-graph-1', 'top-dsa-graphs-search-sort', 'mod-dsa-trees-graphs', 'sub-dsa', 'Graph Representations & Traversals (BFS & DFS)', 'Adjacency matrix vs list; BFS queue traversal O(V+E), DFS recursive stack O(V+E)', 'L2', 4, ['cnc-dsa-7']),
                  makeConcept('cnc-dsa-11', 'subt-dsa-graph-1', 'top-dsa-graphs-search-sort', 'mod-dsa-trees-graphs', 'sub-dsa', 'Dijkstra & Minimum Spanning Tree (Prim/Kruskal)', 'Single source shortest path, greedy edge selection, cycle detection using Disjoint Set', 'L3', 4, ['cnc-dsa-10']),
                ],
              },
              {
                id: 'subt-dsa-sort-1',
                topicId: 'top-dsa-graphs-search-sort',
                moduleId: 'mod-dsa-trees-graphs',
                subjectId: 'sub-dsa',
                name: 'Sorting, Searching & Hash Tables',
                concepts: [
                  makeConcept('cnc-dsa-12', 'subt-dsa-sort-1', 'top-dsa-graphs-search-sort', 'mod-dsa-trees-graphs', 'sub-dsa', 'Linear Search vs Binary Search', 'O(n) sequential vs O(log n) divide-and-conquer on sorted collections', 'L1', 4, ['cnc-dsa-2']),
                  makeConcept('cnc-dsa-13', 'subt-dsa-sort-1', 'top-dsa-graphs-search-sort', 'mod-dsa-trees-graphs', 'sub-dsa', 'Sorting Algorithms Benchmark', 'Bubble, Insertion, Selection O(n^2); Merge Sort, Heap Sort O(n log n); Quick Sort best/worst', 'L2', 5, ['cnc-dsa-12']),
                  makeConcept('cnc-dsa-14', 'subt-dsa-sort-1', 'top-dsa-graphs-search-sort', 'mod-dsa-trees-graphs', 'sub-dsa', 'Hash Tables & Collision Resolution', 'Direct addressing, hash functions (division, mid-square), chaining vs open addressing', 'L2', 4, ['cnc-dsa-3']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 7. Programming & OOP
  {
    id: 'sub-prog-oop',
    name: 'Programming & OOP',
    code: 'OOP',
    category: 'IT',
    weightageWeight: 1.2,
    description: 'Control flow, Functions, Recursion, OOP Pillars, Interfaces, Overloading/Overriding, and Constructors.',
    iconName: 'Code',
    modules: [
      {
        id: 'mod-prog-fund',
        subjectId: 'sub-prog-oop',
        name: 'Programming Fundamentals & Flow Control',
        topics: [
          {
            id: 'top-prog-basics',
            moduleId: 'mod-prog-fund',
            subjectId: 'sub-prog-oop',
            name: 'Variables, Data Types, Control & Functions',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-prog-b1',
                topicId: 'top-prog-basics',
                moduleId: 'mod-prog-fund',
                subjectId: 'sub-prog-oop',
                name: 'Language Basics & Recursion',
                concepts: [
                  makeConcept('cnc-oop-1', 'subt-prog-b1', 'top-prog-basics', 'mod-prog-fund', 'sub-prog-oop', 'Data Types, Operators & Precedence', 'Primitive types, type casting, bitwise operators, short-circuit evaluation', 'L1', 3, []),
                  makeConcept('cnc-oop-2', 'subt-prog-b1', 'top-prog-basics', 'mod-prog-fund', 'sub-prog-oop', 'Control Structures (Loops & Conditions)', 'if-else, switch-case, for, while, do-while, break and continue mechanics', 'L1', 3, ['cnc-oop-1']),
                  makeConcept('cnc-oop-3', 'subt-prog-b1', 'top-prog-basics', 'mod-prog-fund', 'sub-prog-oop', 'Functions, Parameter Passing & Recursion', 'Call by value vs call by reference, recursion base conditions, stack overflow', 'L2', 4, ['cnc-oop-2']),
                  makeConcept('cnc-oop-4', 'subt-prog-b1', 'top-prog-basics', 'mod-prog-fund', 'sub-prog-oop', 'Exception Handling Mechanisms', 'try, catch, finally blocks, checked vs unchecked exceptions, custom throws', 'L2', 4, ['cnc-oop-3']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-oop-pillars',
        subjectId: 'sub-prog-oop',
        name: 'Object-Oriented Programming (OOP) Core',
        topics: [
          {
            id: 'top-oop-core',
            moduleId: 'mod-oop-pillars',
            subjectId: 'sub-prog-oop',
            name: 'Classes, Encapsulation, Inheritance & Polymorphism',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-oop-core-1',
                topicId: 'top-oop-core',
                moduleId: 'mod-oop-pillars',
                subjectId: 'sub-prog-oop',
                name: 'The Four Pillars of OOP',
                concepts: [
                  makeConcept('cnc-oop-5', 'subt-oop-core-1', 'top-oop-core', 'mod-oop-pillars', 'sub-prog-oop', 'Classes, Objects & Constructors', 'Default, parameterized, copy constructors; initialization order, "this" keyword', 'L1', 4, ['cnc-oop-1']),
                  makeConcept('cnc-oop-6', 'subt-oop-core-1', 'top-oop-core', 'mod-oop-pillars', 'sub-prog-oop', 'Encapsulation & Abstraction', 'Access modifiers (private, protected, public), getters/setters, abstract classes', 'L2', 4, ['cnc-oop-5']),
                  makeConcept('cnc-oop-7', 'subt-oop-core-1', 'top-oop-core', 'mod-oop-pillars', 'sub-prog-oop', 'Inheritance & Subtyping', 'Single, Multilevel, Hierarchical inheritance; diamond problem and interface resolution', 'L2', 5, ['cnc-oop-6']),
                  makeConcept('cnc-oop-8', 'subt-oop-core-1', 'top-oop-core', 'mod-oop-pillars', 'sub-prog-oop', 'Polymorphism (Overloading vs Overriding)', 'Compile-time (method overloading) vs runtime (method overriding & dynamic binding)', 'L2', 5, ['cnc-oop-7']),
                  makeConcept('cnc-oop-9', 'subt-oop-core-1', 'top-oop-core', 'mod-oop-pillars', 'sub-prog-oop', 'Interfaces & Multiple Inheritance', 'Abstract contracts, default interface methods, loose coupling in enterprise apps', 'L2', 4, ['cnc-oop-8']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 8. Software Engineering
  {
    id: 'sub-se',
    name: 'Software Engineering',
    code: 'SE',
    category: 'IT',
    weightageWeight: 1.1,
    description: 'SDLC Models, Agile, Scrum, Testing (White/Black-box), Cohesion/Coupling, and Maintenance.',
    iconName: 'Layers',
    modules: [
      {
        id: 'mod-se-sdlc',
        subjectId: 'sub-se',
        name: 'SDLC Models, Agile & DevOps',
        topics: [
          {
            id: 'top-se-models',
            moduleId: 'mod-se-sdlc',
            subjectId: 'sub-se',
            name: 'SDLC Lifecycle & Agile Methodologies',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-se-sdlc-1',
                topicId: 'top-se-models',
                moduleId: 'mod-se-sdlc',
                subjectId: 'sub-se',
                name: 'Waterfall, Spiral, Agile & Scrum',
                concepts: [
                  makeConcept('cnc-se-1', 'subt-se-sdlc-1', 'top-se-models', 'mod-se-sdlc', 'sub-se', 'SDLC Phases & Waterfall Model', 'Requirements, Design, Coding, Testing, Deployment, Maintenance sequence', 'L1', 4, []),
                  makeConcept('cnc-se-2', 'subt-se-sdlc-1', 'top-se-models', 'mod-se-sdlc', 'sub-se', 'Spiral Model & Risk Analysis', 'Radial loops: Objective, Risk analysis, Engineering, Evaluation cycles', 'L2', 3, ['cnc-se-1']),
                  makeConcept('cnc-se-3', 'subt-se-sdlc-1', 'top-se-models', 'mod-se-sdlc', 'sub-se', 'Agile Principles, Scrum & Kanban', 'Sprints, daily standups, backlog grooming, burndown charts, Kanban WIP limits', 'L2', 5, ['cnc-se-1']),
                  makeConcept('cnc-se-4', 'subt-se-sdlc-1', 'top-se-models', 'mod-se-sdlc', 'sub-se', 'DevOps & CI/CD Pipelines Basics', 'Continuous integration, automated regression testing, version control branching', 'L1', 3, ['cnc-se-3']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-se-design-testing',
        subjectId: 'sub-se',
        name: 'Software Design, Testing & Metrics',
        topics: [
          {
            id: 'top-se-testing',
            moduleId: 'mod-se-design-testing',
            subjectId: 'sub-se',
            name: 'Software Testing & Design Principles',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-se-test-1',
                topicId: 'top-se-testing',
                moduleId: 'mod-se-design-testing',
                subjectId: 'sub-se',
                name: 'Testing Levels & Black/White Box Testing',
                concepts: [
                  makeConcept('cnc-se-5', 'subt-se-test-1', 'top-se-testing', 'mod-se-design-testing', 'sub-se', 'Cohesion vs Coupling in Software Design', 'Desirability of high cohesion and loose/low coupling; module independence types', 'L2', 5, ['cnc-se-1']),
                  makeConcept('cnc-se-6', 'subt-se-test-1', 'top-se-testing', 'mod-se-design-testing', 'sub-se', 'Testing Hierarchy (Unit, Integration, System, Acceptance)', 'V-model mapping, bottom-up vs top-down stubs and drivers in integration', 'L2', 4, ['cnc-se-5']),
                  makeConcept('cnc-se-7', 'subt-se-test-1', 'top-se-testing', 'mod-se-design-testing', 'sub-se', 'Black-Box Testing (BVA & Equivalence Partitioning)', 'Valid and invalid partitions, boundary value analysis off-by-one testing', 'L2', 4, ['cnc-se-6']),
                  makeConcept('cnc-se-8', 'subt-se-test-1', 'top-se-testing', 'mod-se-design-testing', 'sub-se', 'White-Box Testing & Cyclomatic Complexity', 'Control flow graph, Cyclomatic Complexity V(G) = E - N + 2P formula, basis path testing', 'L3', 5, ['cnc-se-6']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 9. Cybersecurity
  {
    id: 'sub-cyber',
    name: 'Cybersecurity',
    code: 'SEC',
    category: 'IT',
    weightageWeight: 1.4,
    description: 'CIA Triad, Cryptography (AES, RSA, Hashing), PKI, SSL/TLS, Malware, Attacks, and IT Act.',
    iconName: 'Shield',
    modules: [
      {
        id: 'mod-cyber-fund',
        subjectId: 'sub-cyber',
        name: 'Security Principles, Malware & Cyber Attacks',
        topics: [
          {
            id: 'top-cyber-threats',
            moduleId: 'mod-cyber-fund',
            subjectId: 'sub-cyber',
            name: 'CIA Triad, Access Control & Malware',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-cyber-t1',
                topicId: 'top-cyber-threats',
                moduleId: 'mod-cyber-fund',
                subjectId: 'sub-cyber',
                name: 'Core Security Fundamentals',
                concepts: [
                  makeConcept('cnc-sec-1', 'subt-cyber-t1', 'top-cyber-threats', 'mod-cyber-fund', 'sub-cyber', 'CIA Triad (Confidentiality, Integrity, Availability)', 'Non-repudiation, authentication vs authorization, access control matrices', 'L1', 4, []),
                  makeConcept('cnc-sec-2', 'subt-cyber-t1', 'top-cyber-threats', 'mod-cyber-fund', 'sub-cyber', 'Malware Types (Viruses, Worms, Trojans, Ransomware)', 'Self-replicating network worms, Trojan backdoors, phishing and social engineering', 'L1', 4, ['cnc-sec-1']),
                  makeConcept('cnc-sec-3', 'subt-cyber-t1', 'top-cyber-threats', 'mod-cyber-fund', 'sub-cyber', 'Common Cyber Attacks (DoS/DDoS, SQLi, XSS, CSRF)', 'Denial of service botnets, SQL injection parameterization, cross-site scripting sanitization', 'L2', 5, ['cnc-sec-2']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cyber-crypto',
        subjectId: 'sub-cyber',
        name: 'Cryptography, PKI, Digital Signatures & SSL/TLS',
        topics: [
          {
            id: 'top-cyber-encryption',
            moduleId: 'mod-cyber-crypto',
            subjectId: 'sub-cyber',
            name: 'Symmetric & Asymmetric Cryptography',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-cyber-c1',
                topicId: 'top-cyber-encryption',
                moduleId: 'mod-cyber-crypto',
                subjectId: 'sub-cyber',
                name: 'Encryption Algorithms & Ciphers',
                concepts: [
                  makeConcept('cnc-sec-4', 'subt-cyber-c1', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'Symmetric Encryption (DES, 3DES, AES)', 'Shared secret key, block vs stream ciphers, key distribution problem', 'L2', 5, ['cnc-sec-1']),
                  makeConcept('cnc-sec-5', 'subt-cyber-c1', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'Asymmetric Encryption & RSA Algorithm', 'Public/Private key pairs, prime factorization trapdoor, RSA key generation steps', 'L2', 5, ['cnc-sec-4']),
                  makeConcept('cnc-sec-6', 'subt-cyber-c1', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'Cryptographic Hashing (MD5, SHA-256)', 'One-way property, avalanche effect, collision resistance, message digests', 'L2', 5, ['cnc-sec-5']),
                ],
              },
              {
                id: 'subt-cyber-pki',
                topicId: 'top-cyber-encryption',
                moduleId: 'mod-cyber-crypto',
                subjectId: 'sub-cyber',
                name: 'Digital Signatures, Certificates & PKI',
                concepts: [
                  makeConcept('cnc-sec-7', 'subt-cyber-pki', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'Digital Signatures & Non-Repudiation', 'Signing with sender private key, verifying with sender public key; tamper-proofing', 'L2', 5, ['cnc-sec-6']),
                  makeConcept('cnc-sec-8', 'subt-cyber-pki', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'Digital Certificates & Public Key Infrastructure (PKI)', 'X.509 format, Certificate Authority (CA) root chain, revocation lists (CRL/OCSP)', 'L2', 4, ['cnc-sec-7']),
                  makeConcept('cnc-sec-9', 'subt-cyber-pki', 'top-cyber-encryption', 'mod-cyber-crypto', 'sub-cyber', 'SSL/TLS Handshake Protocol', 'Session key negotiation, asymmetric handshake to symmetric bulk transfer', 'L2', 5, ['cnc-sec-8']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 10. Banking Technology
  {
    id: 'sub-bank-tech',
    name: 'Banking Technology',
    code: 'BT',
    category: 'IT',
    weightageWeight: 1.5,
    description: 'Core Banking Solutions, UPI, IMPS, NEFT, RTGS, ISO 8583, EMV, SWIFT, and PCI-DSS compliance.',
    iconName: 'CreditCard',
    modules: [
      {
        id: 'mod-bt-cbs',
        subjectId: 'sub-bank-tech',
        name: 'Core Banking Solutions & Indian Banking Architecture',
        topics: [
          {
            id: 'top-bt-cbs-arch',
            moduleId: 'mod-bt-cbs',
            subjectId: 'sub-bank-tech',
            name: 'CBS Architecture & Channel Integration',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-bt-cbs-1',
                topicId: 'top-bt-cbs-arch',
                moduleId: 'mod-bt-cbs',
                subjectId: 'sub-bank-tech',
                name: 'Core Banking Solutions (CBS)',
                concepts: [
                  makeConcept('cnc-bt-1', 'subt-bt-cbs-1', 'top-bt-cbs-arch', 'mod-bt-cbs', 'sub-bank-tech', 'Indian Banking Technical Infrastructure', 'Anytime anywhere banking, centralized database architecture (Finacle, BaNCS)', 'L1', 5, []),
                  makeConcept('cnc-bt-2', 'subt-bt-cbs-1', 'top-bt-cbs-arch', 'mod-bt-cbs', 'sub-bank-tech', 'Delivery Channels (ATM, POS, Internet & Mobile Banking)', 'ATM switches, NDC/DDC protocols, POS terminals, internet banking 2FA', 'L2', 4, ['cnc-bt-1']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-bt-payments',
        subjectId: 'sub-bank-tech',
        name: 'Payment Systems, NPCI & Security Standards',
        topics: [
          {
            id: 'top-bt-digital-payments',
            moduleId: 'mod-bt-payments',
            subjectId: 'sub-bank-tech',
            name: 'UPI, IMPS, NEFT, RTGS, AEPS & BBPS',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-bt-pay-1',
                topicId: 'top-bt-digital-payments',
                moduleId: 'mod-bt-payments',
                subjectId: 'sub-bank-tech',
                name: 'NPCI Payment Infrastructure',
                concepts: [
                  makeConcept('cnc-bt-3', 'subt-bt-pay-1', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'Unified Payments Interface (UPI) Architecture', 'Virtual Payment Address (VPA), PSP banks, NPCI switch, 2-factor MPIN authentication', 'L2', 5, ['cnc-bt-1']),
                  makeConcept('cnc-bt-4', 'subt-bt-pay-1', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'IMPS, NEFT & RTGS Transaction Settlement', 'Batch settlement (NEFT half-hourly) vs real-time gross settlement (RTGS, IMPS limits)', 'L2', 5, ['cnc-bt-3']),
                  makeConcept('cnc-bt-5', 'subt-bt-pay-1', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'AEPS, BBPS & National Financial Switch (NFS)', 'Aadhaar biometric micro-ATMs, interoperable bill payments, NFS ATM routing', 'L2', 4, ['cnc-bt-4']),
                ],
              },
              {
                id: 'subt-bt-standards',
                topicId: 'top-bt-digital-payments',
                moduleId: 'mod-bt-payments',
                subjectId: 'sub-bank-tech',
                name: 'Financial Messaging & Payment Security',
                concepts: [
                  makeConcept('cnc-bt-6', 'subt-bt-standards', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'ISO 8583 & ISO 20022 Financial Messaging', 'Bitmaps, Message Type Identifiers (MTI 0100, 0200, 0800), XML-based ISO 20022', 'L3', 5, ['cnc-bt-3']),
                  makeConcept('cnc-bt-7', 'subt-bt-standards', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'EMV Chip Cards, SWIFT & PCI-DSS Compliance', 'Contact/contactless chips, SWIFT MT messages vs ISO 20022, cardholder data security', 'L2', 4, ['cnc-bt-6']),
                  makeConcept('cnc-bt-8', 'subt-bt-standards', 'top-bt-digital-payments', 'mod-bt-payments', 'sub-bank-tech', 'Banking APIs (REST, JSON, XML & Webhooks)', 'Open banking protocols, Account Aggregator framework, OAuth token security', 'L2', 4, ['cnc-bt-6']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 11. Emerging Technologies
  {
    id: 'sub-emerging',
    name: 'Emerging Technologies',
    code: 'ET',
    category: 'IT',
    weightageWeight: 1.0,
    description: 'Cloud Computing, Virtualization, Containers, AI/ML in Banking, Blockchain, and IoT.',
    iconName: 'Zap',
    modules: [
      {
        id: 'mod-et-cloud-ai',
        subjectId: 'sub-emerging',
        name: 'Cloud Computing, AI/ML & Blockchain',
        topics: [
          {
            id: 'top-et-cloud',
            moduleId: 'mod-et-cloud-ai',
            subjectId: 'sub-emerging',
            name: 'Cloud Service Models & Virtualization',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-et-c1',
                topicId: 'top-et-cloud',
                moduleId: 'mod-et-cloud-ai',
                subjectId: 'sub-emerging',
                name: 'Cloud Infrastructure & Containers',
                concepts: [
                  makeConcept('cnc-et-1', 'subt-et-c1', 'top-et-cloud', 'mod-et-cloud-ai', 'sub-emerging', 'Cloud Service Models (IaaS, PaaS, SaaS)', 'Shared responsibility model, public, private, hybrid, community clouds', 'L1', 4, []),
                  makeConcept('cnc-et-2', 'subt-et-c1', 'top-et-cloud', 'mod-et-cloud-ai', 'sub-emerging', 'Virtualization (Hypervisors) & Containers (Docker)', 'Type-1 bare-metal vs Type-2 hosted hypervisors, OS-level virtualization', 'L2', 4, ['cnc-et-1']),
                ],
              },
            ],
          },
          {
            id: 'top-et-ai-blockchain',
            moduleId: 'mod-et-cloud-ai',
            subjectId: 'sub-emerging',
            name: 'AI, Machine Learning, IoT & Blockchain',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-et-ai-1',
                topicId: 'top-et-ai-blockchain',
                moduleId: 'mod-et-cloud-ai',
                subjectId: 'sub-emerging',
                name: 'AI/ML in Banking & Distributed Ledgers',
                concepts: [
                  makeConcept('cnc-et-3', 'subt-et-ai-1', 'top-et-ai-blockchain', 'mod-et-cloud-ai', 'sub-emerging', 'AI & Machine Learning Fundamentals in Banking', 'Supervised vs unsupervised models, fraud detection, credit risk scoring, chatbots', 'L1', 4, []),
                  makeConcept('cnc-et-4', 'subt-et-ai-1', 'top-et-ai-blockchain', 'mod-et-cloud-ai', 'sub-emerging', 'Blockchain, Smart Contracts & Distributed Ledgers', 'Proof of Work vs Proof of Stake, immutable transaction ledgers, trade finance use cases', 'L2', 4, ['cnc-et-3']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 12. Banking Awareness
  {
    id: 'sub-ba',
    name: 'Banking Awareness',
    code: 'BA',
    category: 'Banking & CA',
    weightageWeight: 1.2,
    description: 'RBI, Monetary Policy, Priority Sector Lending, NPA, Basel Norms, and Government Schemes.',
    iconName: 'Landmark',
    modules: [
      {
        id: 'mod-ba-rbi-policy',
        subjectId: 'sub-ba',
        name: 'Reserve Bank of India & Monetary Framework',
        topics: [
          {
            id: 'top-ba-rbi',
            moduleId: 'mod-ba-rbi-policy',
            subjectId: 'sub-ba',
            name: 'RBI Origin, Functions & Monetary Policy',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-ba-rbi-1',
                topicId: 'top-ba-rbi',
                moduleId: 'mod-ba-rbi-policy',
                subjectId: 'sub-ba',
                name: 'RBI Structure & Monetary Policy Rates',
                concepts: [
                  makeConcept('cnc-ba-1', 'subt-ba-rbi-1', 'top-ba-rbi', 'mod-ba-rbi-policy', 'sub-ba', 'RBI Functions & Organization', 'Central banking duties, currency issuance, banker to banks, banker to government', 'L1', 4, []),
                  makeConcept('cnc-ba-2', 'subt-ba-rbi-1', 'top-ba-rbi', 'mod-ba-rbi-policy', 'sub-ba', 'Monetary Policy Tools (Repo, Rev Repo, SDF, MSF, Bank Rate)', 'Policy corridor, liquidity adjustment facility (LAF), marginal standing facility', 'L2', 5, ['cnc-ba-1']),
                  makeConcept('cnc-ba-3', 'subt-ba-rbi-1', 'top-ba-rbi', 'mod-ba-rbi-policy', 'sub-ba', 'Reserve Ratios (CRR & SLR) & OMO', 'Cash Reserve Ratio formula, Statutory Liquidity Ratio approved securities, open market operations', 'L2', 5, ['cnc-ba-2']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-ba-norms-schemes',
        subjectId: 'sub-ba',
        name: 'Banking Operations, Basel Norms, NPAs & Schemes',
        topics: [
          {
            id: 'top-ba-operations',
            moduleId: 'mod-ba-norms-schemes',
            subjectId: 'sub-ba',
            name: 'Priority Sector Lending, NPAs & Basel Norms',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-ba-ops-1',
                topicId: 'top-ba-operations',
                moduleId: 'mod-ba-norms-schemes',
                subjectId: 'sub-ba',
                name: 'Regulatory Framework & Asset Quality',
                concepts: [
                  makeConcept('cnc-ba-4', 'subt-ba-ops-1', 'top-ba-operations', 'mod-ba-norms-schemes', 'sub-ba', 'Priority Sector Lending (PSL) Targets', '40% total ANBC target, Agriculture (18%), Microenterprises (7.5%), Weaker sections', 'L2', 5, ['cnc-ba-1']),
                  makeConcept('cnc-ba-5', 'subt-ba-ops-1', 'top-ba-operations', 'mod-ba-norms-schemes', 'sub-ba', 'NPA Classification (SMA-0/1/2, Substandard, Doubtful, Loss)', '90-day overdue rule, provisioning norms, SARFAESI Act, IBC 2016, DRT recovery', 'L2', 5, ['cnc-ba-4']),
                  makeConcept('cnc-ba-6', 'subt-ba-ops-1', 'top-ba-operations', 'mod-ba-norms-schemes', 'sub-ba', 'Basel III Accord & Capital Adequacy (CRAR)', 'Tier 1 core capital, Tier 2 capital, 9% minimum CRAR in India, Capital Conservation Buffer', 'L2', 4, ['cnc-ba-5']),
                  makeConcept('cnc-ba-7', 'subt-ba-ops-1', 'top-ba-operations', 'mod-ba-norms-schemes', 'sub-ba', 'Government Financial Inclusion Schemes', 'PMJDY zero-balance accounts, PMJJBY insurance, PMSBY accidental cover, APY pension, MUDRA loans', 'L1', 4, ['cnc-ba-1']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 13. English
  {
    id: 'sub-eng',
    name: 'English Language',
    code: 'ENG',
    category: 'English',
    weightageWeight: 1.0,
    description: 'Grammar, Subject-Verb agreement, Reading Comprehension, Cloze Test, Error Spotting, and Vocabulary.',
    iconName: 'BookOpen',
    modules: [
      {
        id: 'mod-eng-grammar',
        subjectId: 'sub-eng',
        name: 'Grammar Foundations & Error Detection',
        topics: [
          {
            id: 'top-eng-syntax',
            moduleId: 'mod-eng-grammar',
            subjectId: 'sub-eng',
            name: 'Parts of Speech, Tenses & Subject-Verb Agreement',
            examPriority: 4,
            subtopics: [
              {
                id: 'subt-eng-g1',
                topicId: 'top-eng-syntax',
                moduleId: 'mod-eng-grammar',
                subjectId: 'sub-eng',
                name: 'Core Grammar Rules',
                concepts: [
                  makeConcept('cnc-eng-1', 'subt-eng-g1', 'top-eng-syntax', 'mod-eng-grammar', 'sub-eng', 'Subject-Verb Agreement Rules', 'Singular/plural subject matching, compound subjects with "and", "either/or", "neither/nor"', 'L1', 5, []),
                  makeConcept('cnc-eng-2', 'subt-eng-g1', 'top-eng-syntax', 'mod-eng-grammar', 'sub-eng', 'Verb Tenses & Conditional Sentences', 'Past perfect vs simple past, zero/first/second/third conditional clauses', 'L1', 4, ['cnc-eng-1']),
                  makeConcept('cnc-eng-3', 'subt-eng-g1', 'top-eng-syntax', 'mod-eng-grammar', 'sub-eng', 'Prepositions & Phrasal Verbs', 'Prepositions of time/place, confusing pairs (between/among, beside/besides), bank phrasal verbs', 'L2', 4, ['cnc-eng-1']),
                  makeConcept('cnc-eng-4', 'subt-eng-g1', 'top-eng-syntax', 'mod-eng-grammar', 'sub-eng', 'Error Spotting & Sentence Improvement', 'Identifying faulty parallelism, dangling modifiers, pronoun-antecedent agreement', 'L2', 5, ['cnc-eng-1']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-eng-comprehension',
        subjectId: 'sub-eng',
        name: 'Comprehension, Passages & Vocabulary',
        topics: [
          {
            id: 'top-eng-reading',
            moduleId: 'mod-eng-comprehension',
            subjectId: 'sub-eng',
            name: 'Reading Comprehension, Cloze Test & Para Jumbles',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-eng-rc-1',
                topicId: 'top-eng-reading',
                moduleId: 'mod-eng-comprehension',
                subjectId: 'sub-eng',
                name: 'Passage Strategies & Verbal Drill',
                concepts: [
                  makeConcept('cnc-eng-5', 'subt-eng-rc-1', 'top-eng-reading', 'mod-eng-comprehension', 'sub-eng', 'Reading Comprehension Strategies', 'Skimming economic editorials, finding main theme, author tone, inference questions', 'L2', 5, ['cnc-eng-1']),
                  makeConcept('cnc-eng-6', 'subt-eng-rc-1', 'top-eng-reading', 'mod-eng-comprehension', 'sub-eng', 'Cloze Test & Fillers (Single/Double)', 'Grammar cues, collocation matching, context elimination techniques', 'L2', 4, ['cnc-eng-1']),
                  makeConcept('cnc-eng-7', 'subt-eng-rc-1', 'top-eng-reading', 'mod-eng-comprehension', 'sub-eng', 'Para Jumbles & Sentence Rearrangement', 'Opening sentence identification, mandatory pair linking, chronological transition markers', 'L2', 4, ['cnc-eng-5']),
                  makeConcept('cnc-eng-8', 'subt-eng-rc-1', 'top-eng-reading', 'mod-eng-comprehension', 'sub-eng', 'Banking Exam Vocabulary, Synonyms & Antonyms', 'High-frequency financial editorial vocabulary with contextual antonym drills', 'L1', 4, []),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 14. Reasoning
  {
    id: 'sub-reas',
    name: 'Reasoning Ability',
    code: 'REAS',
    category: 'Reasoning',
    weightageWeight: 1.1,
    description: 'Syllogism, Inequalities, Puzzles, Seating Arrangements, Blood Relations, and Input-Output.',
    iconName: 'Puzzle',
    modules: [
      {
        id: 'mod-reas-logical',
        subjectId: 'sub-reas',
        name: 'Logical Reasoning & Deductive Logic',
        topics: [
          {
            id: 'top-reas-deductive',
            moduleId: 'mod-reas-logical',
            subjectId: 'sub-reas',
            name: 'Syllogism, Inequality & Direction Sense',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-reas-d1',
                topicId: 'top-reas-deductive',
                moduleId: 'mod-reas-logical',
                subjectId: 'sub-reas',
                name: 'Deductive Rules',
                concepts: [
                  makeConcept('cnc-reas-1', 'subt-reas-d1', 'top-reas-deductive', 'mod-reas-logical', 'sub-reas', 'Syllogism (All, Some, No, Only A Few)', 'Definite conclusion vs possibility cases, "Only a few" Venn diagram representation', 'L2', 5, []),
                  makeConcept('cnc-reas-2', 'subt-reas-d1', 'top-reas-deductive', 'mod-reas-logical', 'sub-reas', 'Inequalities (Direct & Coded)', 'Priority order (> vs >=), Opposite sign blocks, Either-Or complementary pairs', 'L1', 5, []),
                  makeConcept('cnc-reas-3', 'subt-reas-d1', 'top-reas-deductive', 'mod-reas-logical', 'sub-reas', 'Direction Sense & Distance', 'Pythagoras theorem shortest distance, angle rotations, sunrise/sunset shadow positions', 'L1', 4, []),
                  makeConcept('cnc-reas-4', 'subt-reas-d1', 'top-reas-deductive', 'mod-reas-logical', 'sub-reas', 'Blood Relations (Family Tree & Coded)', 'Standard tree symbols, generational tiers, direct vs coded symbol relations', 'L1', 4, []),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-reas-puzzles',
        subjectId: 'sub-reas',
        name: 'Puzzles, Seating Arrangements & Input-Output',
        topics: [
          {
            id: 'top-reas-analytical',
            moduleId: 'mod-reas-puzzles',
            subjectId: 'sub-reas',
            name: 'Seating Arrangements, Floor Puzzles & Input-Output',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-reas-p1',
                topicId: 'top-reas-analytical',
                moduleId: 'mod-reas-puzzles',
                subjectId: 'sub-reas',
                name: 'Advanced Bank Puzzles',
                concepts: [
                  makeConcept('cnc-reas-5', 'subt-reas-p1', 'top-reas-analytical', 'mod-reas-puzzles', 'sub-reas', 'Linear & Circular Seating Arrangements', 'Facing north/south parallel lines, circular inward/outward with multiple variables', 'L2', 5, ['cnc-reas-3']),
                  makeConcept('cnc-reas-6', 'subt-reas-p1', 'top-reas-analytical', 'mod-reas-puzzles', 'sub-reas', 'Floor, Box & Flat Puzzles', 'Vertical multi-story matrices, empty boxes, conditional constraint elimination', 'L2', 5, ['cnc-reas-5']),
                  makeConcept('cnc-reas-7', 'subt-reas-p1', 'top-reas-analytical', 'mod-reas-puzzles', 'sub-reas', 'Machine Input-Output (Single & Double Shift)', 'Sorting logic by word length, alphabetical order, number parity, arithmetic shifts', 'L2', 4, ['cnc-reas-1']),
                  makeConcept('cnc-reas-8', 'subt-reas-p1', 'top-reas-analytical', 'mod-reas-puzzles', 'sub-reas', 'Data Sufficiency (Reasoning)', 'Evaluating whether statement 1, 2, or both together are sufficient without full solve', 'L2', 4, ['cnc-reas-5']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 15. Quantitative Aptitude
  {
    id: 'sub-quant',
    name: 'Quantitative Aptitude',
    code: 'QA',
    category: 'Quant',
    weightageWeight: 1.1,
    description: 'Speed Math, Simplification, Percentages, Ratio, Arithmetic (Work, Interest), and Data Interpretation.',
    iconName: 'Calculator',
    modules: [
      {
        id: 'mod-quant-speed',
        subjectId: 'sub-quant',
        name: 'Speed Math, Simplification & Quadratic Equations',
        topics: [
          {
            id: 'top-quant-arith-base',
            moduleId: 'mod-quant-speed',
            subjectId: 'sub-quant',
            name: 'Speed Math, Number Series & Quadratics',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-quant-s1',
                topicId: 'top-quant-arith-base',
                moduleId: 'mod-quant-speed',
                subjectId: 'sub-quant',
                name: 'Foundation Drills',
                concepts: [
                  makeConcept('cnc-qa-1', 'subt-quant-s1', 'top-quant-arith-base', 'mod-quant-speed', 'sub-quant', 'Vedic Speed Math & Squares/Cubes/Fractions', 'Squares up to 50, cubes up to 30, percentage fraction conversion tables (1/2 to 1/20)', 'L0', 5, []),
                  makeConcept('cnc-qa-2', 'subt-quant-s1', 'top-quant-arith-base', 'mod-quant-speed', 'sub-quant', 'Simplification & Approximation (BODMAS)', 'Order of operations, surds & indices shortcuts, decimal rounding techniques', 'L1', 5, ['cnc-qa-1']),
                  makeConcept('cnc-qa-3', 'subt-quant-s1', 'top-quant-arith-base', 'mod-quant-speed', 'sub-quant', 'Missing & Wrong Number Series', 'Arithmetic differences, geometric multiplication, alternating series, squares/cubes gap', 'L2', 5, ['cnc-qa-1']),
                  makeConcept('cnc-qa-4', 'subt-quant-s1', 'top-quant-arith-base', 'mod-quant-speed', 'sub-quant', 'Quadratic Equations (Sign Method Shortcut)', 'Sign transformation table (+ + -> - -, - + -> + +), root comparison tricks', 'L1', 5, ['cnc-qa-2']),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-quant-arithmetic-di',
        subjectId: 'sub-quant',
        name: 'Arithmetic Applications & Data Interpretation',
        topics: [
          {
            id: 'top-quant-applications',
            moduleId: 'mod-quant-arithmetic-di',
            subjectId: 'sub-quant',
            name: 'Percentages, Ratio, Commercial Math & DI',
            examPriority: 5,
            subtopics: [
              {
                id: 'subt-quant-app-1',
                topicId: 'top-quant-applications',
                moduleId: 'mod-quant-arithmetic-di',
                subjectId: 'sub-quant',
                name: 'Commercial Arithmetic & DI Analysis',
                concepts: [
                  makeConcept('cnc-qa-5', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Percentages, Profit & Loss and Discount', 'Base percentage shift, CP/MP/SP relationships, successive discount formula', 'L2', 5, ['cnc-qa-1']),
                  makeConcept('cnc-qa-6', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Ratio, Proportion, Partnership & Ages', 'Investment * time = profit share ratio, age difference constant invariant', 'L2', 4, ['cnc-qa-5']),
                  makeConcept('cnc-qa-7', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Simple Interest & Compound Interest (SI/CI)', 'Difference formulas for 2 & 3 years: P(R/100)^2, effective annual rate', 'L2', 4, ['cnc-qa-5']),
                  makeConcept('cnc-qa-8', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Time & Work, Pipes & Cisterns', 'Efficiency LCM method: Total Work = LCM of times, negative work by leakage', 'L2', 4, ['cnc-qa-6']),
                  makeConcept('cnc-qa-9', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Time, Speed & Distance, Trains & Boats', 'Relative speed in same/opposite directions, upstream/downstream formulas', 'L2', 4, ['cnc-qa-6']),
                  makeConcept('cnc-qa-10', 'subt-quant-app-1', 'top-quant-applications', 'mod-quant-arithmetic-di', 'sub-quant', 'Data Interpretation (Tables, Bar, Pie, Line)', 'Tabular, bar chart, and pie chart angle-to-percentage conversions for bank Prelims', 'L2', 5, ['cnc-qa-5', 'cnc-qa-6']),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const INITIAL_PREP_PHASES: PreparationPhase[] = [
  {
    phaseNumber: 0,
    name: 'Phase 0 — Diagnostic & Baseline',
    goal: 'Establish baseline scores across IT, Reasoning, English, and Quant through diagnostic sectional tests.',
    targetMonths: 'Current Baseline',
    targetSubjects: ['CF', 'CA', 'DBMS', 'OS', 'CN', 'QA', 'REAS', 'ENG'],
    isCurrent: false,
    completionPct: 100,
  },
  {
    phaseNumber: 1,
    name: 'Phase 1 — Foundation Building',
    goal: 'Build fundamental computer, hardware, number systems, programming basics, speed math, and grammar knowledge.',
    targetMonths: 'Oct 2026 – Dec 2026',
    targetSubjects: ['sub-comp-fund', 'sub-comp-arch', 'sub-prog-oop', 'sub-eng', 'sub-quant', 'sub-reas'],
    isCurrent: true,
    completionPct: 20,
  },
  {
    phaseNumber: 2,
    name: 'Phase 2 — Core IT Mastery',
    goal: 'Master core professional IT knowledge: Operating Systems, DBMS, Computer Networks, and Data Structures.',
    targetMonths: 'Jan 2027 – Mar 2027',
    targetSubjects: ['sub-os', 'sub-dbms', 'sub-cn', 'sub-dsa'],
    isCurrent: false,
    completionPct: 0,
  },
  {
    phaseNumber: 3,
    name: 'Phase 3 — Advanced IT & Architecture',
    goal: 'Master Cybersecurity, Cryptography, Software Engineering SDLC/testing, and Advanced Networking/DB.',
    targetMonths: 'Apr 2027 – May 2027',
    targetSubjects: ['sub-cyber', 'sub-se', 'sub-comp-arch', 'sub-emerging'],
    isCurrent: false,
    completionPct: 0,
  },
  {
    phaseNumber: 4,
    name: 'Phase 4 — Banking Technology & Systems',
    goal: 'Master Core Banking Solutions (CBS), NPCI payments (UPI, IMPS), ISO 8583, and RBI Banking Awareness.',
    targetMonths: 'Jun 2027 – Jul 2027',
    targetSubjects: ['sub-bank-tech', 'sub-ba'],
    isCurrent: false,
    completionPct: 0,
  },
  {
    phaseNumber: 5,
    name: 'Phase 5 — Exam Integration & Timed Speed Drills',
    goal: 'Full Prelims and Mains mock simulations, speed drills, and targeted repair of recurring weakness topics.',
    targetMonths: 'Jul 2027 – Aug 2027',
    targetSubjects: ['All Subjects'],
    isCurrent: false,
    completionPct: 0,
  },
  {
    phaseNumber: 6,
    name: 'Phase 6 — Final Revision & Exam Readiness',
    goal: 'Spaced repetition cycles (1d, 3d, 7d, 14d, 30d), mistake notebook zeroing, and high-yield consolidation.',
    targetMonths: 'August 2027 Exam Cycle',
    targetSubjects: ['All Subjects'],
    isCurrent: false,
    completionPct: 0,
  },
];
