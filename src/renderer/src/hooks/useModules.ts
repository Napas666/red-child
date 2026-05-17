import { useStore } from '../store/useStore'
import { modules as securityModules } from '../data/courses/securityResearcher'
import { modules as crmModules } from '../data/courses/crmCourse'
import { modules as bpmModules } from '../data/courses/bpmCourse'

export function useModules() {
  const activeCourse = useStore((s) => s.activeCourse)
  if (activeCourse === 'crm') return crmModules
  if (activeCourse === 'bpm') return bpmModules
  return securityModules
}
