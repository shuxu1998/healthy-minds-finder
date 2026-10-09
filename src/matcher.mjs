export function matchTherapists(data, answers, demoMode = false) {
  if (!['adult_individual','child_teen','couples','family'].includes(answers.service)) return [];
  if (!['A','G','R','L','M','X'].includes(answers.topic)) return [];
  const bands = {under6:[0,5],age6_7:[6,7],age8_14:[8,14],age15_17:[15,17]};
  if (answers.service === 'child_teen' && !bands[answers.age]) return [];
  return data.filter(t => {
    if (!t.active || (!demoMode && t.reviewStatus !== 'approved')) return false;
    if (!t.services.includes(answers.service)) return false;
    if (answers.service === 'child_teen') {
      const [min,max] = bands[answers.age];
      if (!Number.isInteger(t.childMin) || !Number.isInteger(t.childMax) || min < t.childMin || max > t.childMax) return false;
    }
    return answers.topic === 'X' || t.topics.includes(answers.topic);
  }).sort((a,b) => a.sortOrder-b.sortOrder || a.id.localeCompare(b.id));
}
