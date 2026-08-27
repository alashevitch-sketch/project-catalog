export interface PageSection { id: string; label: string }

export const overviewSections: PageSection[] = [
  { id: 'top', label: 'Обзор' },
  { id: 'analytics', label: 'Показатели' },
  { id: 'projects', label: 'Проекты' },
  { id: 'about', label: 'О каталоге' },
]
export const projectSections: PageSection[] = [
  { id: 'overview', label: 'О проекте' },
  { id: 'cover', label: 'Обложка' },
  { id: 'indicators', label: 'Показатели' },
  { id: 'stages', label: 'Этапы' },
]

export function sectionSearch(search: string, section: string) {
  const params = new URLSearchParams(search)
  params.set('section', section)
  return `?${params.toString()}`
}

export function selectedSection(search: string, sections: PageSection[]) {
  const requested = new URLSearchParams(search).get('section')
  return sections.find(section => section.id === requested)?.id ?? sections[0].id
}
