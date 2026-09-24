export const TOUR_STEPS: { title: string; body: string; target?: string }[] = [
  { title: 'Welcome to NETCLICS', body: 'The NETCONF ↔ CLI Conversion System helps you turn device configuration into the formats your automation needs.' },
  { title: 'Choose a platform and formats', target: 'settings', body: 'Select the device platform and its YANG module set, then choose CLI or NETCONF XML input and your preferred output format.' },
  { title: 'Find the right output format', target: 'settings', body: 'CLI shows vendor syntax, NETCONF XML and JSON provide structured YANG data, and Acton gdata and adata help you write StratoWeave transforms.' },
  { title: 'Enter configuration', target: 'input', body: 'Paste your first CLI or NETCONF XML configuration here. Each step is applied in sequence, building on the configuration left by the previous step.' },
  { title: 'Build a sequence', target: 'add-step', body: 'Add steps to explore successive changes. Use Up, Down, and Remove on each step to adjust the sequence before converting.' },
  { title: 'Run the conversion', target: 'convert', body: 'When the platform, module set, and all inputs are ready, select Convert. NETCLICS processes the sequence using a backend device instance; results appear when it completes.' },
  { title: 'Review the results', target: 'output', body: 'Diff shows what each step changes. Full configuration shows the complete result after that step. Once available, copy or download the output, or expand Base configuration below the steps to inspect the starting point.' },
  { title: 'Help is always here', target: 'header-actions', body: 'System status shows available platforms and device instances. Visit StratoWeave to learn more, or use Guided tour to restart this walkthrough. Finish or dismiss the tour to keep it from opening on future visits in this browser.' }
];
