export type Rep = {
  /** Stable id used as the <Select> value. */
  value: string;
  /** Display name shown in the dropdown and on the application. */
  name: string;
  /** Inbox CC'd when this rep is selected. */
  email: string;
};

// Reps shown in the application "Rep" dropdown. When a rep is selected, their
// submission is CC'd to this email — the main submissions inbox always stays the
// primary recipient. Add new reps here as "value / name / email" entries.
export const REPS: Rep[] = [
  { value: "david-miller", name: "David Miller", email: "davidm@bayviewadvance.com" },
  { value: "asdrubal-acosta", name: "Asdrubal Acosta", email: "asdrubal@bayviewadvance.com" },
  { value: "hershey-klein", name: "Hershey Klein", email: "labs@optentia.com" },
  { value: "md-safir", name: "MD Safir", email: "MD@bayviewadvance.com" },
  { value: "joseph-katan", name: "Joseph Katan", email: "joseph@bayviewadvance.com" },
  { value: "alex", name: "Alex", email: "alex@bayviewadvance.com" },
  { value: "daevon", name: "Daevon", email: "daevon@bayviewadvance.com" },
  { value: "ahmir", name: "Ahmir", email: "ahmir@bayviewadvance.com" },
];

export const findRep = (value: string): Rep | undefined =>
  REPS.find((rep) => rep.value === value);
