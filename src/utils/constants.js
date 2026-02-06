export const STATUS = {
  planted: { label: 'Planted', bg: 'bg-sky-400/15', text: 'text-sky-500', dot: 'bg-sky-400' },
  germinated: { label: 'Sprouted', bg: 'bg-leaf-400/15', text: 'text-leaf-600', dot: 'bg-leaf-400' },
  potted: { label: 'Potted', bg: 'bg-clay-500/15', text: 'text-clay-500', dot: 'bg-clay-400' },
  shared: { label: 'Shared', bg: 'bg-berry-500/15', text: 'text-berry-500', dot: 'bg-berry-400' },
  discarded: { label: 'Gone', bg: 'bg-soil-300/20', text: 'text-soil-400', dot: 'bg-soil-300' },
}

export const STATUS_TRANSITIONS = {
  planted: ['germinated'],
  germinated: ['potted'],
  potted: ['shared', 'discarded'],
  shared: [],
  discarded: [],
}

export const ACTION_LABELS = {
  germinated: 'Mark as Sprouted',
  potted: 'Mark as Potted',
  shared: 'Mark as Shared',
  discarded: 'Mark as Discarded',
}
